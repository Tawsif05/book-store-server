/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import config from '../config';
import AppError from '../errors/AppError';
import { handleZodError } from '../errors/handleZodError';
import { handleCastError } from '../errors/handleCastError';
import handleValidationError from '../errors/handleValidationError';
import { handleDuplicateError } from '../errors/handleDuplicateError';
import { handleGenericError } from '../errors/handleGenericError';


export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {

  let statusCode = 500;
  let message = 'Something went wrong!';
  let error: object = {
    path: '',
    message: 'Something went wrong',
  };

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    error = { msg: err?.message };
  } else if (err.name && err.name === 'ZodError') {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.error;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.error;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.error;
  } else if (err.code && err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.error;
  } else if (err instanceof Error) {
    const simplifiedError = handleGenericError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    error = simplifiedError?.error;
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};