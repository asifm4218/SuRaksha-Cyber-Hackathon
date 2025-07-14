
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CardsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">My Cards</h1>
      <Card>
        <CardHeader>
          <CardTitle>Card Management</CardTitle>
          <CardDescription>
            View and manage your debit and credit cards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cards page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
