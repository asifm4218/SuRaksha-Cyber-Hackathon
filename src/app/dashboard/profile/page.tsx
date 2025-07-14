import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            This is where user profile settings would be displayed and managed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Profile page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
