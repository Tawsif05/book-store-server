import { z } from 'zod';

export const bookValidationSchema = z.object({
  body: z.object({ 
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    price: z.number().positive('Price must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    quantity: z.number().int().nonnegative('Quantity must be a non-negative integer'),
    inStock: z.boolean(),
    imgUrl: z.string().url('Invalid image URL').optional(),
  }),
});

export const bookValidation = { bookValidationSchema };
