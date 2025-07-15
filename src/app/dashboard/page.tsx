
"use client";

import { useState, useEffect } from "react";
import { AccountSummary } from "@/components/dashboard/account-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { BehaviorMonitor } from "@/components/dashboard/behavior-monitor";
import { getTransactions, addTransaction as addTransactionAction } from "@/app/actions";
import type { Transaction } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTransactions() {
      const initialTransactions = await getTransactions();
      setTransactions(initialTransactions);
      setIsLoading(false);
    }
    loadTransactions();
  }, []);

  const addTransaction = async (newTransaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const result = await addTransactionAction(newTransaction);
    if (result.success && result.newTransaction) {
      setTransactions(prev => [result.newTransaction!, ...prev]);
       if (newTransaction.description.includes('Transfer')) {
         toast({
            title: "Transfer Successful",
            description: `Sent ₹${newTransaction.amount.toFixed(2)} to ${newTransaction.description.replace('Transfer to ', '')}.`,
        });
       } else {
        toast({
            title: "Bill Paid",
            description: `Paid ₹${newTransaction.amount.toFixed(2)} for ${newTransaction.description.replace('Bill payment - ', '')}.`,
        });
       }
    } else {
        toast({
            title: "Transaction Failed",
            description: "Could not save the transaction. Please try again.",
            variant: "destructive",
        });
    }
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
          <RecentTransactions transactions={transactions} isLoading={isLoading} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <SecurityOverview />
            <BehaviorMonitor />
        </div>
      </div>
    </>
  );
}
