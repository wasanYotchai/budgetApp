"use client";

import React, { useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { updateDefaultAccount, deleteAccount } from "@/actions/dashboard";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const [isPending, startTransition] = useTransition();

  const handleDefaultChange = async (checked) => {
    if (!checked && isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the account "${name}"?`
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        await deleteAccount(id);
        toast.success("Account deleted");
        window.location.reload(); // or use router.refresh() if available
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete account");
      }
    });
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-lg group transition-all duration-300 ease-in-out rounded-2xl border border-[#e3dfdb] bg-[#faf5ef] hover:bg-[#f1ece7]">
      {/* Header: Name + Switch + Delete Button */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 space-x-2">
        <Link href={`/account/${id}`} className="flex-1">
          <CardHeader className="p-0">
            <CardTitle className="text-base font-semibold capitalize text-[#5b4d3b] group-hover:text-[#8b6f47] transition-colors">
              {name}
            </CardTitle>
          </CardHeader>
        </Link>

        <Switch
          checked={isDefault}
          onCheckedChange={handleDefaultChange}
          disabled={updateDefaultLoading}
        />

        <Button
          variant="ghost"
          size="icon"
          className="text-[#b08968] hover:bg-[#fdfaf6] border border-[#e7e2dc] rounded-full shadow-sm shadow-[#e7e2dc]/40 transition-all duration-200 hover:scale-105"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Card Link */}
      <Link href={`/account/${id}`}>
        <CardContent className="px-4 pb-2">
          <div className="text-3xl font-bold text-[#7e6e5d]">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-[#a89f91] italic">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-[#a89f91] px-4 pb-4">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-[#92bfa1]" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-[#db8c8c]" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;

