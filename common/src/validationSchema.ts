import * as z from 'zod'

export const signupSchema = z.object({
    email: z.email({message: "Invalid email format"}),
    name: z.string().min(1,{message: "Name cannot be empty"}),
    password: z.string().min(8,{message: "Password cannot be less tha 8 characters"})
})

export type SignupType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    email: z.email({message: "Invalid email format"}),
    password: z.string().min(8,{message: "Password cannot be less tha 8 characters"})
})

export type SigninType = z.infer<typeof signinSchema>;

export const createPostSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export type CreatePostType = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
});

export type UpdatePostType = z.infer<typeof updatePostSchema>;