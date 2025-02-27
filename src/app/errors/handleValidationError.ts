import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
    const error = Object.values(err.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
          return {
            path: val?.path,
            message: val?.message,
          };
        },
      );

  const statusCode = StatusCodes.BAD_REQUEST;

  return {
    statusCode,
    message: 'Validation Error',
    error,
  };
};

export default handleValidationError;