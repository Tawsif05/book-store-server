import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from '../User/user.validation';
import { authControllers } from './auth.controller';
import { authValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './auth.interface';

const authRouter = Router();

authRouter.post(
  '/register',
  validateRequest(userValidation.userValidationSchema),
  authControllers.registerUser
);

authRouter.post(
  '/login',
  validateRequest(authValidation.loginValidationSchema),
  authControllers.loginUser
);

authRouter.post(
  '/change-password',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(authValidation.changePasswordValidationSchema),
  authControllers.changePassword
);

authRouter.post('/refresh-token', authControllers.refreshToken);

authRouter.get(
  '/me',
  auth(USER_ROLE.user, USER_ROLE.admin),
  authControllers.getMe
);

authRouter.get(
  '/all-users',
  auth(USER_ROLE.admin),
  authControllers.getAllUsers
);

authRouter.patch(
  '/update-profile',
  auth(USER_ROLE.user, USER_ROLE.admin),
  authControllers.updateProfile
);

authRouter.post("/change-status/:userId",
  auth(USER_ROLE.admin),
  authControllers.changeStatus
);

export const authRoutes = authRouter;
