import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Accounts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            View and manage your linked accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Accounts page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
