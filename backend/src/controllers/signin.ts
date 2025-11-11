import { Context } from "hono";
import { sign } from "hono/jwt";
import { HTTPStatusCode } from "../statusCodes";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const signin = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const parsedInputs: SigninType = c.get("signinData");
        const email = parsedInputs.email;
        const password = parsedInputs.password;

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(!existingUser || !(await bcrypt.compare(password,existingUser.password))){
            return c.json({
                message: "incorrect username or passwords"
            },HTTPStatusCode.BAD_REQUEST)
        }

        const token = await sign({id: existingUser.id},(c.env.JWT_SECRET));

        if(!token){
            return c.json({
                message: "Token could not be generated"
            },HTTPStatusCode.INTERNAL_SERVER_ERROR)
        }

        return c.json({
            message: "User signed in successfully",
            token: token
        },HTTPStatusCode.OK)
    }catch(err){
        return c.json({
            message: (err as any).message   
        },HTTPStatusCode.INTERNAL_SERVER_ERROR)
    }
}