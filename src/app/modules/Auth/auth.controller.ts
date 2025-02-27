import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';
import config from '../../config';

const registerUser = catchAsync(async (req, res) => {
  const result = await authServices.registerUserIntoDB(req.body);
  const { _id, name, email } = result;
  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: StatusCodes.CREATED,
    data: { _id, name, email },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    message: 'Login successful',
    statusCode: StatusCodes.OK,
    data: {
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await authServices.changePassword(req.user, passwordData);

  sendResponse(res, {
    success: true,
    message: 'Password is updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const {refreshToken} = req.cookies;

  

  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token is retrieved successfully',
    data: result,
  });
});


const getMe = catchAsync(async (req, res) => {
  const id = req?.user?._id;
  const result = await authServices.getMe(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User information is get successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await authServices.getAllUsers();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users are retrieved successfully',
    data: result,
  })
})


const updateProfile = catchAsync(async (req, res) => {
  const id = req?.user?._id;
  const payload = req.body;
  const result = await authServices.updateProfile(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});


const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.userId;
  const result = await authServices.changeStatus(id,req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Status updated successfully',
    data: result,
  });

})


export const authControllers = {
  registerUser,
  loginUser,
  refreshToken,
  changePassword,
  getMe,
  updateProfile,
  getAllUsers,
  changeStatus
};
