import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import config from '../config';
import User from '../modules/User/user.model';
import { TUserRole } from '../modules/Auth/auth.validation';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const getToken = req.headers?.authorization;
    if (!getToken) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'You are not authorized to access'
      );
    }

    const token = getToken.split(' ')[1] || getToken;

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { email, role } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }
    
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !!');
    }
    req.user = decoded;

    next();
  });
};
export default auth;
