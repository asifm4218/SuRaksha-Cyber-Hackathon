
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Fingerprint, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [biometricState, setBiometricState] = useState<"idle" | "scanning" | "analyzing" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleBiometricLogin = () => {
    setIsBiometricOpen(true);
    setBiometricState("scanning");
    setProgress(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (biometricState === "scanning") {
      timer = setTimeout(() => {
        setBiometricState("analyzing");
      }, 2000);
    } else if (biometricState === "analyzing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setBiometricState("success"), 500);
            return 100;
          }
          return prev + 20;
        });
      }, 400);
      return () => clearInterval(interval);
    } else if (biometricState === "success") {
        timer = setTimeout(() => {
            setIsBiometricOpen(false);
            router.push("/dashboard");
        }, 1500);
    }
    return () => clearTimeout(timer);
  }, [biometricState, router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <Logo className="mb-2" />
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to VeriSafe</CardTitle>
          <CardDescription>Securely sign in to your Canara Bank account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="analyst@canara.co"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password123" />
            </div>
            <Button type="submit" className="w-full font-semibold">
              Sign In
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleBiometricLogin}>
              Sign In with Biometrics
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isBiometricOpen} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setBiometricState('idle');
            setProgress(0);
          }
          setIsBiometricOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Biometric Authentication</DialogTitle>
                <DialogDescription>
                    {biometricState === 'idle' && 'Use your fingerprint to sign in.'}
                    {biometricState === 'scanning' && 'Place your finger on the sensor.'}
                    {biometricState === 'analyzing' && 'Analyzing biometric and behavioral data...'}
                    {biometricState === 'success' && 'Authentication successful! Redirecting...'}
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-6 py-8">
                <Fingerprint 
                    className={cn(
                        "h-24 w-24 text-muted-foreground transition-colors duration-500",
                        biometricState === 'scanning' && 'animate-pulse text-primary',
                        biometricState === 'analyzing' && 'text-primary',
                        biometricState === 'success' && 'text-green-500'
                    )}
                />
                {(biometricState === 'analyzing' || biometricState === 'success') && (
                    <div className="w-full max-w-xs space-y-2">
                         <Progress value={progress} className="h-2" />
                         <p className="text-xs text-muted-foreground text-center">
                            Verifying behavioral patterns...
                         </p>
                    </div>
                )}
                 {biometricState === 'scanning' && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Waiting for input...
                    </p>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsBiometricOpen(false)}>
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
