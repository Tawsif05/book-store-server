import { z } from 'zod';

const userValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),

    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Please provide a valid email' }),

    password: z
      .string({ required_error: 'Password is required' })
      .min(3, { message: 'Password must be more than 3 characters' })
      .max(20, { message: 'Password must be less than 20 characters' }),

    phone: z.string().optional(),

    address: z.string().optional(),

    city: z.string().optional(),
  }),
});

export const userValidation = {
  userValidationSchema,
};
