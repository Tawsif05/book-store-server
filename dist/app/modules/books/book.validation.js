"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookValidation = exports.bookValidationSchema = void 0;
const zod_1 = require("zod");
exports.bookValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        author: zod_1.z.string().min(1, 'Author is required'),
        price: zod_1.z.number().positive('Price must be a positive number'),
        category: zod_1.z.string().min(1, 'Category is required'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        quantity: zod_1.z.number().int().nonnegative('Quantity must be a non-negative integer'),
        inStock: zod_1.z.boolean(),
        imgUrl: zod_1.z.string().url('Invalid image URL').optional(),
    }),
});
exports.bookValidation = { bookValidationSchema: exports.bookValidationSchema };
