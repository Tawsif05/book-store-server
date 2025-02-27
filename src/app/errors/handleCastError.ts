import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    message: err.message,
    statusCode: 400,
    error: err,
  };
};