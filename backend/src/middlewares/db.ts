import { Context, Next } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '../generated/prisma/edge';

export const db = async (c: Context, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set("prisma", prisma);
  await next();
};
