import { Context, Next } from "hono";
import { HTTPStatusCode } from "../statusCodes";
import { signinSchema, SigninType, signupSchema, SignupType } from "@100xbensomnitrix/medium-common-bundle";

export const signupValidation = async (c: Context, next: Next) => {
    try{
        const body: SignupType = await c.req.json();
        const result = signupSchema.safeParse(body);
        if(!result.success){
            return c.json({
                message: result.error.flatten(),
            },HTTPStatusCode.BAD_REQUEST);
        }
        c.set("signupData",body);
        await next();
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.BAD_REQUEST);
    }
}

export const signinValidation = async (c: Context, next: Next) => {
    try{
        const body: SigninType = await c.req.json();
        const result = signinSchema.safeParse(body);
        if(!result.success){
            return c.json({
                message: result.error.flatten(),
            },HTTPStatusCode.BAD_REQUEST);
        }
        c.set("signinData",body);
        await next();
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.BAD_REQUEST);
    }
}