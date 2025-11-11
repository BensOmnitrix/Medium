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