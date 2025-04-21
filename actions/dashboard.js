"use server"; 
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; // Corrected import statement
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialized = { ...obj }; 

    if (obj.balance) {
        serialized.balance = obj.balance.toNumber(); 
    }

    if (obj.amount) {
        serialized.amount = obj.balance.toNumber(); 
    }
    return serialized; // Ensure the function returns the serialized object
}; 

export async function createAccount(data) {
    try {
        const { userId } = await auth(); 
        if (!userId) throw new Error("Unauthorized"); 

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }, 
        }); 

        if (!user) {
            throw new Error("User not found"); 
        }

        // Convert Balance to float before saving 
        const balanceFloat = parseFloat(data.balance); // Fixed typo: 'pasrseFloat' to 'parseFloat'
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount"); 
        }

        // Check if this is the user's first account 
        const existingAccounts = await db.account.findMany({ // Fixed typo: 'createAccount' to 'account'
            where: { userId: user.id }, 
        }); 

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault; 
        // If this account should be default, unset other default accounts 
        if (shouldBeDefault) {
            await db.account.updateMany({ // Fixed typo: 'apdateMany' to 'updateMany'
                where: { userId: user.id, isDefault: true }, 
                data: { isDefault: false }, 
            }); 
        }

        const account = await db.account.create({ // Fixed typo: 'creat' to 'create'
            data: {
                ...data, 
                balance: balanceFloat, 
                userId: user.id, 
                isDefault: shouldBeDefault, 
            }, 
        }); 

        const serializedAccount = serializeTransaction(account); 

        // Assuming revalidatePath is defined elsewhere in your code
        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount }; 

    } catch (error) {
        throw new Error(error.message); 
    }
}

export async function getUserAccounts() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    try {
      const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              transactions: true,
            },
          },
        },
      });
  
      // Serialize accounts before sending to client
      const serializedAccounts = accounts.map(serializeTransaction);
  
      return serializedAccounts;
    } catch (error) {
      console.error(error.message);
    }
  }
  