import { z } from 'zod';

export const userNameValidation = z.string().min(2, 'Username must be at least of 2 characters long').max(40, "Username Max length is 40 characters").regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');


export const signUpSchema = z.object({
    username : userNameValidation,
    email: z.string().regex(/.+\@.+\..+/, 'Please use a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
})