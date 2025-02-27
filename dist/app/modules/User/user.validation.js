"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Please provide a valid email' }),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(3, { message: 'Password must be more than 3 characters' })
            .max(20, { message: 'Password must be less than 20 characters' }),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
    }),
});
exports.userValidation = {
    userValidationSchema,
};
