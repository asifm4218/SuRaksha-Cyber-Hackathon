
"use client";

import { useState } from "react";
import { AccountSummary } from "@/components/dashboard/account-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { BehaviorMonitor } from "@/components/dashboard/behavior-monitor";
import { transactions as initialTransactions, type Transaction } from "@/lib/mock-data";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (newTransaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const transactionToAdd: Transaction = {
      id: `txn_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      ...newTransaction,
    };
    setTransactions(prev => [transactionToAdd, ...prev]);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Welcome Back!</h1>
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <AccountSummary />
            <QuickActions onTransaction={addTransaction} />
          </div>
          <RecentTransactions transactions={transactions} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <SecurityOverview />
            <BehaviorMonitor />
        </div>
      </div>
    </>
  );
}
