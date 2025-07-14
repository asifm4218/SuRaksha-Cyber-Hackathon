
import { getUserDetails } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";

export default async function ProfilePage({ searchParams }: { searchParams: { email?: string }}) {
  const email = searchParams.email;
  const user = email ? await getUserDetails(email) : null;
  const userInitials = user?.fullName?.split(' ').map(n => n[0]).join('') || 'U';

  if (!user) {
    return (
        <div className="flex-1 space-y-4">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
        <Card>
            <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>
                We couldn't retrieve user details. Please try logging in again.
            </CardDescription>
            </CardHeader>
        </Card>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-lg font-semibold md:text-2xl">My Profile</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <CardDescription>
            Review and manage your personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User profile picture" data-ai-hint="user avatar" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <h2 className="text-2xl font-bold">{user.fullName}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <Separator className="my-6" />
            <div className="grid gap-4 text-sm">
                <div className="grid grid-cols-2">
                    <span className="font-semibold">Full Name:</span>
                    <span>{user.fullName}</span>
                </div>
                 <div className="grid grid-cols-2">
                    <span className="font-semibold">Email:</span>
                    <span>{user.email}</span>
                </div>
                 <div className="grid grid-cols-2">
                    <span className="font-semibold">Account Status:</span>
                    <span className="text-green-500">Active</span>
                </div>
                 <div className="grid grid-cols-2">
                    <span className="font-semibold">Member Since:</span>
                    <span>January 2024</span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
