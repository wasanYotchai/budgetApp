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
        serialized.amount = obj.amount.toNumber(); 
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
  

  export async function deleteAccount(accountId) {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
  
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      // Verify account belongs to the user
      const account = await db.account.findUnique({
        where: { id: accountId },
      });
  
      if (!account || account.userId !== user.id) {
        throw new Error("Account not found or access denied");
      }
  
      // Optionally delete related transactions first (if cascade isn't set in schema)
      await db.transaction.deleteMany({
        where: { accountId: account.id },
      });
  
      // Delete the account
      await db.account.delete({
        where: { id: account.id },
      });
  
      revalidatePath("/dashboard");
      return { success: true, message: "Account deleted successfully" };
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
  

  export async function updateDefaultAccount(accountId) {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
  
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
  
      if (!user) throw new Error("User not found");
  
      const account = await db.account.findUnique({
        where: { id: accountId },
      });
  
      if (!account || account.userId !== user.id) {
        throw new Error("Account not found or access denied");
      }
  
      // Unset all other default accounts
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          NOT: { id: accountId },
        },
        data: {
          isDefault: false,
        },
      });
  
      // Set this account as the default
      const updatedAccount = await db.account.update({
        where: { id: accountId },
        data: { isDefault: true },
      });
  
      revalidatePath("/dashboard");
  
      const serialized = serializeTransaction(updatedAccount);
      return { success: true, data: serialized };
    } catch (error) {
      throw new Error(error.message || "Failed to update default account");
    }
  }
  
  export async function getDashboardData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    // Get all user transactions
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });
  
    return transactions.map(serializeTransaction);
  }
