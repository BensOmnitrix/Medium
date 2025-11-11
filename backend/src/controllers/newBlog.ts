import { Context } from "hono";
import { HTTPStatusCode } from "../statusCodes";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/edge";

export interface Blog {
    title: string;
    content: string;
    published: boolean;
}

export const newBlog = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const id = c.get("jwtPayload").id;
        const data: Blog = await c.req.json();

        const title = data.title;
        const content = data.content;
        const published = data.published;

        const createBlog = await prisma.post.create({
            data:{
                title,
                content,
                published,
                authorId: id
            },
            select: {
                id: true
            }
        })

        if(!createBlog.id){
            return c.json({
                message: "Blog could not be published. Try Again after sometime",
            },HTTPStatusCode.INTERNAL_SERVER_ERROR);
        }

        return c.json({
            message: "Blog has been successfully published"
        },HTTPStatusCode.OK);
        
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
}   