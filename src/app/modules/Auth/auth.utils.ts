import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
export const createToken = (
  jwtPayload: {
    email: string;
    role: 'user' | 'admin' | undefined;
    _id: Types.ObjectId;
  },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};