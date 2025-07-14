
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Manage your application settings and preferences here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
