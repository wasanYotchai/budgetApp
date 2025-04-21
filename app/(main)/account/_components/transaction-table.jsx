"use client";

import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import React, { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { useEffect } from "react";

const pastelBackground = "bg-[#fef9f4]"; // Soft paper-like background
const pastelBorder = "border-[#e6dcd3]"; // Subtle border
const pastelText = "text-[#4b4b4b]"; // Warm gray text

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
const router = useRouter();
const [selectedIds, setSelectedIds] = useState ([]);
const [sortConfig, setSortConfig] = useState ({
    field: "date", 
    direction: "desc",
});

const [searchTerm, setSearchTerm] = useState("");
const [typeFilter, setTypeFilter] = useState("");
const [recurringFilter, setRecurringFilter] = useState("");

    
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase(); 
        result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
    );
    }

        // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

      // Apply sorting
      result.sort((a, b) => {
        let comparison = 0;
  
        switch (sortConfig.field) {
          case "date":
            comparison = new Date(a.date) - new Date(b.date);
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          default:
            comparison = 0;
        }
        
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result; 
  }, [
    transactions, searchTerm, typeFilter, recurringFilter, sortConfig,]);


  const handleSort = (field) => {
    setSortConfig((current) => {
      return {
        field,
        direction: current.field === field && current.direction === "asc" ? "desc" : "asc"
      };
    });
  };
  
  const handleSelect = (id) => {
    setSelectedIds((current) => 
        current.includes(id)
        ? current.filter ((item) => item != id)
        : [...current, id]
    );
  }; 
  const handleSelectAll = () => {
    setSelectedIds((current) =>
        current.length === filteredAndSortedTransactions.length  
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  }; 

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);


  const handleClearFillters = () => {
    setSearchTerm(""); 
    setTypeFilter("");
    setRecurringFilter(""); 
    setSelectedIds([]);
  };

  return (
    <div className={`space-y-4 font-[ui-rounded] ${pastelText}`}>
        {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#4B8B3B" /> // Dark Green Tea Matcha Color
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8" />
            </div>

            <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter} >
                    <SelectTrigger >
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INCOME" > Income </SelectItem>
                        <SelectItem value="EXPENSE" > Expense </SelectItem>
                    </SelectContent>
                </Select>

                <Select value={recurringFilter} 
                onValueChange={(value) => setRecurringFilter(value)} >
                    <SelectTrigger className="w-[140px]" >
                        <SelectValue placeholder="All Transaction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recurring" > Recurring Only </SelectItem>
                        <SelectItem value="non-recurring" > Non-recurring Only </SelectItem>
                    </SelectContent>
                </Select>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button 
                        variant = "destructive" 
                        size="sm" 
                        onClick={handleBulkDelete} >
                            <Trash className="h-4 w-4 mr2" />
                            Delete Selected ({selectedIds.length}) 
                        </Button>
                    </div>
                )}

                {(searchTerm || typeFilter || recurringFilter) &&(
                    <Button 
                    variant="outline" 
                    size="icon" 
                    onClick= {handleClearFillters} title="Clear Filters" > 
                        <X className="h-4 w-5" /> 
                    </Button>
                )}
            </div>
        </div>


      {/* Transaction Table */}
      <div className={`rounded-2xl border shadow-sm ${pastelBorder} ${pastelBackground}`}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#f1edea] transition-colors duration-200">
              <TableHead className="w-[50px]">
                <Checkbox
                onCheckedChange = {handleSelectAll}
                checked={
                    selectedIds.length ===
                    filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                } />
              </TableHead>
              <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                <div className="flex items-center">📅 Date {" "} 
                    {sortConfig.field ==='date' && 
                    (sortConfig.direction === "asc" ? ( 
                    <ChevronUp className="ml-1 h-4 w-4" />
                    ) : ( <ChevronDown className="ml-1 h-4 w-4" />
                ))} 
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                <div className="flex items-center">🌱 Category
                {sortConfig.field ==='category' && 
                    (sortConfig.direction === "asc" ? ( 
                    <ChevronUp className="ml-1 h-4 w-4" />
                    ) : ( <ChevronDown className="ml-1 h-4 w-4" />
                ))} 
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                <div className="flex items-center justify-end">💰 Amount
                {sortConfig.field ==='amount' && 
                    (sortConfig.direction === "asc" ? ( 
                    <ChevronUp className="ml-1 h-4 w-4" />
                    ) : ( <ChevronDown className="ml-1 h-4 w-4" />
                ))} 
                </div>
              </TableHead>
              <TableHead>⟳ Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                  No Transactions Found 🌧️
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-[#f8f4f1] transition duration-150 ease-in-out"
                >
                  <TableCell>
                    <Checkbox 
                    onCheckedChange = {() => handleSelect(transaction.id)}
                    checked = {selectedIds.includes(transaction.id)} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        backgroundColor: `${categoryColors[transaction.category]}80`,
                        color: "#333",
                      }}
                      className="px-2 py-1 rounded-full text-sm font-medium"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "EXPENSE" ? "#d67a7a" : "#69b382",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "−" : "+"}${(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="secondary"
                              className="gap-1 bg-[#e6f2ec] text-[#3d4f46] hover:bg-[#d4e8e0] border border-[#c3dcd2] shadow-sm rounded-full"
                            >
                              <RefreshCw className="h-3 w-3 text-[#6b8372]" />
                              {
                                RECURRING_INTERVALS[
                                  transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PPP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel
                        onClick={() =>
                            router.push(
                                `/transaction/create?edit=${transaction.id}`
                            )
                        }>
                            Edit</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                        className="text-red-600 hover:bg-red-50"
                        onClick={()=>deleteFn([transaction.id])} 
                        > 
                        🗑️ Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
