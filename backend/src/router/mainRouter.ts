import { Hono } from "hono";
import { userRouter } from "./userRouter";
import { blogRouter } from "./blogRouter";

export const mainRouter = new Hono();

mainRouter.route("/user",userRouter);
mainRouter.route("/blog",blogRouter);