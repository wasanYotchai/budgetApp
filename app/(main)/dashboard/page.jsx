// app/(main)/dashboard/page.tsx
import React, { Suspense } from 'react';
import CreateAccountDrawer from '@/components/create-account-drawer'; // should be a Client Component with "use client"
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { getUserAccounts } from '@/actions/dashboard';
import AccountCard from './_components/account-card';
import { getCurrentBudget } from '@/actions/budget';
import { BudgetProgress } from './_components/budget-progress';
import { DashboardOverview } from './_components/transaction-overview';
import { getDashboardData } from '@/actions/dashboard';

// Disable caching to always get the latest data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  let transactionData = [];

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
    transactionData = await getDashboardData(defaultAccount.id);
  }

  return (
    <div className="px-5 space-y-6">
      {/* Budget Progress */}
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget ?? 0}
          currentExpenses={budgetData?.currentExpenses ?? 0}
        />
      )}

      {/* Dashboard Overview */}
      <Suspense fallback={<p>Loading Overview...</p>}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactionData}
        />
      </Suspense>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts?.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>
  );
}







