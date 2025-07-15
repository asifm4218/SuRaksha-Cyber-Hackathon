
"use client";

import { useState, useEffect } from "react";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AccountSummary } from "@/components/dashboard/account-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { BehaviorMonitor } from "@/components/dashboard/behavior-monitor";
import { getTransactions } from "@/app/actions";
import type { Transaction } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(125430.50);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      const initialTransactions = await getTransactions();
      setTransactions(initialTransactions);
      setIsLoading(false);
    }
    loadTransactions();
  }, []);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    if (newTransaction.type === 'Debit') {
        setBalance(prev => prev - newTransaction.amount);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Welcome Back!</h1>
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 lg:[grid-template-areas:'summary_summary_security''transactions_transactions_monitor']">
        <div className="lg:[grid-area:summary]">
             {isLoading ? <Skeleton className="h-36 w-full" /> : <AccountSummary balance={balance} />}
        </div>
        <div className="lg:[grid-area:summary]">
             {isLoading ? <Skeleton className="h-36 w-full" /> : <QuickActions onTransactionAdded={handleTransactionAdded} currentBalance={balance} />}
        </div>
        <div className="lg:[grid-area:transactions] lg:col-span-2">
           <RecentTransactions initialTransactions={transactions} isClient={!isLoading} />
        </div>
        <div className="lg:[grid-area:security]">
            <SecurityOverview />
        </div>
        <div className="lg:[grid-area:monitor]">
            <BehaviorMonitor />
        </div>
      </div>
    </>
  );
}
