
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { handleLogin, verifyBiometricLogin } from "@/app/actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building, Fingerprint, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Building className="h-8 w-8 text-primary" />
      <span className="text-xl font-semibold tracking-tight">Canara Bank</span>
    </div>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoginLoading(true);
    const formData = new FormData(formRef.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      const result = await handleLogin({ email, password });
      if (result.success) {
        toast({
          title: "Sign In Successful",
          description: "Welcome back to Canara Bank!",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Sign In Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    }
    setIsLoginLoading(false);
  };

  const handleBiometric = async () => {
    setIsBiometricLoading(true);
    const result = await verifyBiometricLogin();
    if (result.success) {
      toast({
        title: "Biometric Scan Successful",
        description: "Welcome back! Your identity has been verified.",
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Biometric Scan Failed",
        description:
          result.message || "Could not verify identity. Please try again.",
        variant: "destructive",
      });
    }
    setIsBiometricLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#003366] p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" />
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your digital banking dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleStandardLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="suresh@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={isLoginLoading}>
              {isLoginLoading && <LoaderCircle className="animate-spin" />}
              Sign in
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full font-semibold"
            onClick={handleBiometric}
            disabled={isBiometricLoading}
          >
            {isBiometricLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Fingerprint />
            )}
            Sign in with Biometrics
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
