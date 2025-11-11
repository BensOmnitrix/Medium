import { Context } from "hono";
import { SignupType } from "../validationSchema";
import { sign } from "hono/jwt";
import { HTTPStatusCode } from "../statusCodes";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const signup = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const parsedInputs : SignupType = c.get("signupData");
        const email = parsedInputs.email;
        const password = parsedInputs.password;
        const name = parsedInputs.name;

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(existingUser){
            return c.json({
                message: "User already exists"
            },HTTPStatusCode.BAD_REQUEST)
        }

        const hashedPasswords = await bcrypt.hash(password,parseInt(c.env.SALT_ROUNDS));

        const newUser = await prisma.user.create({
            data: {
                email,password: hashedPasswords,name
            },
            select: {
                id: true
            }
        })

        const token = await sign({id: newUser.id},(c.env.JWT_SECRET));

        if(!token){
            return c.json({
                message: "Token could not be generated"
            },HTTPStatusCode.INTERNAL_SERVER_ERROR)
        }

        return c.json({
            message: "User signed up successfully",
            token: token
        },HTTPStatusCode.OK)
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.BAD_REQUEST)
    }
}