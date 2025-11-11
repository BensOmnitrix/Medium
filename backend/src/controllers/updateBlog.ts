import { Context } from "hono";
import { Blog } from "./newBlog";
import { PrismaClient } from "../generated/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { HTTPStatusCode } from "../statusCodes";

type UpdateParams = Partial<Pick<Blog, 'title' | 'content'>>;

export const updateBlog = async (c: Context) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const id = c.get("jwtPayload").id;
        const postId = c.req.param("id");
        const data: UpdateParams = await c.req.json();

        if(!data.title && !data.content){
            return c.json({
                message: "No fields to update"
            },HTTPStatusCode.BAD_REQUEST)
        }

        const updatedBlog = await prisma.post.update({
            where:{
                id: postId,
                authorId: id
            },
            data: {...data},
            select:{
                id: true
            }
        })

        if(!updatedBlog.id){
            return c.json({
                message: "Title or content could not be updated"
            },HTTPStatusCode.INTERNAL_SERVER_ERROR);
        }

        return c.json({
            message: "Title or content has been successfully updated"
        },HTTPStatusCode.OK)
    }catch(err){
        return c.json({
            message: (err as any).message
        },HTTPStatusCode.INTERNAL_SERVER_ERROR);
    }
}