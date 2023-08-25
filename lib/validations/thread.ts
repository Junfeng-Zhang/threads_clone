
import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, {message: 'Minimum 3 characters'}),
  accountId: z.string(), // This is just ensuring that we pass all necessary Fields into our form
});

export const CommentsValidation = z.object({
  thread: z.string().nonempty().min(3, {message: 'Minimum 3 characters'}),
});