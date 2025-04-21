// libs/checkUser.js

import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    // Build name string safely
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

    const newUser = await db.user.create({
      data: {
        id: user.id, // Assuming Clerk ID maps to the `id` column in your Supabase table
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name,
        imageUrl: user.imageUrl,
        updatedAt: new Date(),
      },
    });

    return newUser;
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};
