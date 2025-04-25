"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="bg-[#fdfaf6] border border-[#e9dccd] rounded-2xl shadow-md p-5 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-[#6b4f3b]">
            🍃 Monthly Budget (Default Account)
          </CardTitle>
  
          <div className="flex items-center gap-3 mt-2">
            {isEditing ? (
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-36 rounded-xl bg-[#fffaf3] text-[#5a3f2b] placeholder:text-[#bfa892] border border-[#e0cdb9] shadow-inner focus:ring-2 focus:ring-[#decab5]"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="hover:bg-[#e3d6c3] rounded-full transition"
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="hover:bg-[#fbeae8] rounded-full transition"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-sm text-[#8b6b4c] font-medium">
                  {initialBudget
                    ? `$${currentExpenses.toFixed(
                        2
                      )} of $${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 hover:bg-[#e3d6c3] rounded-full transition"
                >
                  <Pencil className="h-3 w-3 text-[#a9886f]" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
  
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              className="h-3 rounded-full bg-[#f2e8dc]"
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-[#f4c6c6]"
                  : percentUsed >= 75
                  ? "bg-[#f3e4a6]"
                  : "bg-[#b3d9b0]"
              }`}
            />
            <p className="text-xs text-right text-[#7a5e47] font-semibold">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}  
