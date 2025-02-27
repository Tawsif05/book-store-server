"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const orderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        products: zod_1.z.array(zod_1.z.object({
            product: zod_1.z.string().min(1, "Product ID is required"),
            quantity: zod_1.z.number().int().min(1, "Quantity must be at least one"),
        })).min(1, "At least one product is required"),
    }),
});
exports.orderValidation = {
    orderValidationSchema,
};
