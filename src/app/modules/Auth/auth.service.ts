import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TUser } from '../User/user.interface';
import User from '../User/user.model';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  //check if the user exist

  const user = await User.findOne({ email: payload?.email }).select(
    '+password'
  );

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User Not found!');
  }

  //check if the password is correct

  const isPasswordMatch = await bcrypt.compare(
    payload?.password,
    user?.password
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  //creating token for access and sent to the client

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    _id: user?.id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findById(userData._id).select('+password');

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password do not matched');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findByIdAndUpdate(userData._id, {
    password: newHashedPassword,
    passwordChangeAt: new Date(),
  });

  return { message: 'Password updated successfully' };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }

  if (
    user?.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    _id: user?.id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const getMe = async (id: string) => {
  const user = await User.findById(id).select('-password');
  return user;
};

const getAllUsers = async () => {
  const user = await User.find();
  return user;
}

const updateProfile = async (id: string, payload: Record<string, unknown>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};


export const authServices = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  changePassword,
  getMe,
  updateProfile,
  getAllUsers,
  changeStatus
};
