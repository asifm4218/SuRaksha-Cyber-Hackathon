
import { getLoginHistory } from "@/services/location-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginHistoryCard } from "@/components/dashboard/login-history-card";

export default async function SettingsPage({ searchParams }: { searchParams: { email?: string }}) {
  const email = searchParams.email;
  const loginHistory = email ? await getLoginHistory(email) : [];

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      
      <LoginHistoryCard loginHistory={loginHistory} />

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Manage your application settings and preferences here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Other settings page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
