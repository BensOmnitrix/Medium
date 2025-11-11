import { Context } from "hono";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { HTTPStatusCode } from "../statusCodes";

export const fetchAllBlogs = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const id = c.get("jwtPayload").id;
        const response = await prisma.post.findMany({
            where: {
                authorId: id
            },
            select:{
                id: true,
                title: true,
                content: true,
                published: true
            }
        })

        if(response.length === 0){
            return c.json({
                message: "Cannot fetch the blog for the user. Try again later"
            },HTTPStatusCode.INTERNAL_SERVER_ERROR)
        }

        return c.json({
            blogs: response,
            message: "Blogs are fetched successfully"
        },HTTPStatusCode.OK)

    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.BAD_REQUEST)
    }
}