"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🌿 Pastel & Ghibli-inspired color palette
const pastelGreen = "#A8D5BA"; // Income
const pastelPink = "#F4B6C2"; // Expense
const gridColor = "#E0E4CC";
const backgroundColor = "#FEFCF3";
const borderColor = "#E4E2D5";
const fontColor = "#7C6F64";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const net = totals.income - totals.expense;

  const pieData = [
    { name: "Income", value: totals.income },
    { name: "Expense", value: totals.expense },
  ];

  return (
    <Card className="bg-[#FEFCF3] border border-[#E4E2D5] shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-base font-light text-[#7C6F64] font-serif">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px] border border-[#E4E2D5]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap justify-between items-center gap-8 mb-6 text-sm md:justify-evenly font-serif">
          {/* Total Income */}
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground text-[#7C6F64]">Total Income</p>
            <p className="text-lg font-bold text-[#5A9367]">
              ${totals.income.toFixed(2)}
            </p>
          </div>

          {/* Total Expenses */}
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground text-[#7C6F64]">Total Expenses</p>
            <p className="text-lg font-bold text-[#c45b5b]">
              ${totals.expense.toFixed(2)}
            </p>
          </div>

          {/* Net */}
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground text-[#7C6F64]">Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-[#5A9367]"
                  : "text-[#c45b5b]"
              }`}
            >
              ${(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>

          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <div className="w-[90px] h-[90px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={28}
                    outerRadius={40}
                    paddingAngle={5}
                  >
                    <Cell fill={pastelGreen} />
                    <Cell fill={pastelPink} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-[#7C6F64] mt-1">Income vs Expense</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke={fontColor}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                stroke={fontColor}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "#fefaf2",
                  border: "1px solid #e2ddd8",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill={pastelGreen}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill={pastelPink}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
