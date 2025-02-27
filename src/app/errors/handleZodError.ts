/* eslint-disable @typescript-eslint/no-explicit-any */

import { TGenericErrorResponse } from '../interface/error';

export const handleZodError = (err: any): TGenericErrorResponse => {
    const issues = err.issues.map((issue: any) => {
      return {
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      };
    });

  return {
    message: 'Validation error',
    statusCode: 400,
    error: issues,
  };
};