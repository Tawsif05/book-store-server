import { StatusCodes } from 'http-status-codes';
import { TGenericErrorResponse } from '../interface/error';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  return {
    message: err.message,
    statusCode: StatusCodes.CONFLICT,
    error: err,
  };
};