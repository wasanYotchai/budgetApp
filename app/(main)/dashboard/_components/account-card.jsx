"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { Switch } from "@/components/ui/switch";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (checked) => {
    // If trying to toggle off the default account
    if (!checked && isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
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
      {/* Header: Name + Switch (not wrapped in Link) */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
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
      </div>

      {/* Link wraps rest of the card */}
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
