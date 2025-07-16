
import { getTransactions } from "@/app/actions";
import { TransactionHistory } from "@/components/dashboard/transaction-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="flex-1 space-y-4 flex flex-col">
      <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A detailed log of all your transactions. Use the filters to narrow down your search.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <TransactionHistory initialTransactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
