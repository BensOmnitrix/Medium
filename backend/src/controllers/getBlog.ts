import { Context } from "hono";
import { HTTPStatusCode } from "../statusCodes";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const getBlog = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const id = c.get('jwtPayload').id;
        const postId = c.req.param("id");

        const response = await prisma.post.findUnique({
            where:{
                id: postId,
                authorId: id
            },
            select: {
                id: true,
                title: true,
                content: true
            }
        })

        if(!response){
            return c.json({
                message: "Cannot fetch the blog. Try again later",
            },HTTPStatusCode.INTERNAL_SERVER_ERROR)
        }

        return c.json({
            blog: response,
            message: "Blog fetched successfully",
        })
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.INTERNAL_SERVER_ERROR)
    }
}