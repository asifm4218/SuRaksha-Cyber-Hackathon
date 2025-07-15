import { TransactionHistory } from "@/components/dashboard/transaction-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
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
          <TransactionHistory />
        </CardContent>
      </Card>
    </div>
  );
}
