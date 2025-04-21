// libs/prisma.js

import { PrismaClient } from "../lib/generated/prisma"; // adjust path if needed

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

