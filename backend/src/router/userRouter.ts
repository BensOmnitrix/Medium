import { Hono } from "hono";
import { signinValidation, signupValidation } from "../middlewares/validation";
import { signup } from "../controllers/signup";
import { signin } from "../controllers/signin";

export const userRouter = new Hono();

userRouter.post("/signup",signupValidation,signup);
userRouter.post("/signin",signinValidation,signin);
