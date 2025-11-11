import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
import { newBlog } from "../controllers/newBlog";
import { updateBlog } from "../controllers/updateBlog";
import { getBlog } from "../controllers/getBlog";
import { fetchAllBlogs } from "../controllers/fetchAllblogs";

export const blogRouter = new Hono();

blogRouter.use(authMiddleware);
blogRouter.post("/new",newBlog);
blogRouter.get("/bulk",fetchAllBlogs);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/:id",getBlog);