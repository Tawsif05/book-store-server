import { StatusCodes } from 'http-status-codes';
import { TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleGenericError = (err: any): TGenericErrorResponse => {
  return {
    message: err.message,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    error: err,
  };
};