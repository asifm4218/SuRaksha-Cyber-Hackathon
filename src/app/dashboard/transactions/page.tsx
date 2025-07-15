
"use client";

import { useState } from 'react';
import { TransactionHistory } from "@/components/dashboard/transaction-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions as initialTransactions, type Transaction } from "@/lib/mock-data";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A detailed log of all your transactions. Use the filters to narrow down your search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionHistory transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
