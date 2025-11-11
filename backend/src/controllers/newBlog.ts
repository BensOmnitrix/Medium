import { Context } from "hono";
import { HTTPStatusCode } from "../statusCodes";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/edge";
import { createPostSchema, CreatePostType } from "@100xbensomnitrix/medium-common-bundle";

export const newBlog = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const id = c.get("jwtPayload").id;
        const data: CreatePostType = await c.req.json();

        const blogParams = createPostSchema.safeParse(data);
        if(!blogParams.success){
            return c.json({
                message: blogParams.error.flatten()
            },HTTPStatusCode.BAD_REQUEST);
        }

        const title = blogParams.data.title;
        const content = blogParams.data.content;

        const createBlog = await prisma.post.create({
            data:{
                title,
                content,
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