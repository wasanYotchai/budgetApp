import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";

const AccountsPage = async ({ params }) => {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="min-h-screen px-5 sm:px-8 md:px-12 py-6 space-y-8 bg-[#faf5ef] text-[#5b4d3b]">
      {/* Account Info Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between p-6 rounded-2xl bg-[#fdfaf6] border border-[#e5e0da] shadow-md shadow-[#e7e2dc]/50 transition-all duration-300 ease-in-out">
        {/* Left: Account Info */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wide text-[#7e6e5d] capitalize">
            {account.name}
          </h1>
          <p className="text-sm italic text-[#a89f91]">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        {/* Right: Balance + Transaction Count */}
        <div className="text-right space-y-1">
          <div className="text-2xl sm:text-3xl font-semibold text-[#8b6f47]">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-[#a89f91]">
            {account._count.transactions} Transaction
            {account._count.transactions !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* chart Section */}
      <Suspense
         fallback={<BarLoader className="mt-4" width={"100%"} color="#4CAF50" />} // Matcha Green Tea Color
>
         <AccountChart transactions={transactions} />
        </Suspense>


      {/* Transaction Table Section */}
      <Suspense
        fallback={
          <div className="mt-4 flex justify-center">
            <BarLoader width={"100%"} color="#c1b1a1" />
          </div>
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountsPage;
