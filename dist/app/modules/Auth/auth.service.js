"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("../User/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.create(payload);
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the user exist
    const user = yield user_model_1.default.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User Not found!');
    }
    //check if the password is correct
    const isPasswordMatch = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    //creating token for access and sent to the client
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        _id: user === null || user === void 0 ? void 0 : user.id,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userData._id).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found');
    }
    if (!(yield user_model_1.default.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Password do not matched');
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield user_model_1.default.findByIdAndUpdate(userData._id, {
        password: newHashedPassword,
        passwordChangeAt: new Date(),
    });
    return { message: 'Password updated successfully' };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found !');
    }
    if ((user === null || user === void 0 ? void 0 : user.passwordChangedAt) &&
        user_model_1.default.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized !');
    }
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        _id: user === null || user === void 0 ? void 0 : user.id,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id).select('-password');
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.find();
    return user;
});
const updateProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const changeStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.authServices = {
    registerUserIntoDB,
    loginUser,
    refreshToken,
    changePassword,
    getMe,
    updateProfile,
    getAllUsers,
    changeStatus
};
