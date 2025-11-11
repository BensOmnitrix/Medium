import { Context, Next } from "hono";
import { HTTPStatusCode } from "../statusCodes";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context,next: Next) => {
    try{
        const authHeader = c.req.header("Authorization");
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return c.json({
                message: "Invalid or expired token",
            },HTTPStatusCode.FORBIDDEN)
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return c.json({
                message: "Invalid or expired token",
            },HTTPStatusCode.FORBIDDEN)
        }
        const decodedData = await verify(token,(c.env.JWT_SECRET));
        c.set("jwtPayload",decodedData);
        await next();
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
}