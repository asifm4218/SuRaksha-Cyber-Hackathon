
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A detailed log of all your transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Transactions page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
