
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [biometricStep, setBiometricStep] = useState<'initial' | 'scanning' | 'success' | 'error'>('initial');

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoginLoading(true);
    const formData = new FormData(formRef.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      const result = await handleLogin({ email, password });
      if (result.success && result.user) {
        toast({
          title: "Sign In Successful",
          description: "Welcome back to Canara Bank!",
        });
        router.push(`/dashboard?email=${result.user.email}`);
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

  const handleBiometricSignIn = async () => {
    setIsBiometricPromptOpen(true);
    setBiometricStep('scanning');
    setIsBiometricLoading(true);

    const result = await verifyBiometricLogin();
    if (result.success && result.user) {
        setBiometricStep('success');
        setTimeout(() => {
            setIsBiometricPromptOpen(false);
            toast({
                title: "Biometric Scan Successful",
                description: "Welcome back! Your identity has been verified.",
            });
            router.push(`/dashboard?email=${result.user.email}`);
        }, 2000);
    } else {
        setBiometricStep('error');
        toast({
            title: "Biometric Scan Failed",
            description: result.message || "Could not verify identity. Please try again.",
            variant: "destructive",
        });
    }
    setIsBiometricLoading(false);
  };

  const resetBiometricPrompt = () => {
    setIsBiometricPromptOpen(false);
    setBiometricStep('initial');
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#0f2851] p-4">
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
                  defaultValue="analyst@canara.co"
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
                <Input id="password" name="password" type="password" required defaultValue="password123" />
              </div>
              <Button type="submit" className="w-full font-semibold" disabled={isLoginLoading}>
                {isLoginLoading && <LoaderCircle className="animate-spin mr-2" />}
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
              <div className="absolute inset-0 flex items-center">
                  <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                      Or
                  </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full font-semibold"
              onClick={() => setIsBiometricPromptOpen(true)}
              disabled={isBiometricLoading}
            >
                <Fingerprint className="mr-2 h-4 w-4" />
              Sign in with Biometrics
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isBiometricPromptOpen} onOpenChange={resetBiometricPrompt}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
                <DialogTitle className="text-center">Biometric Authentication</DialogTitle>
                <DialogDescription className="text-center">
                    Please use your device's biometric sensor to continue.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                {biometricStep === 'initial' && (
                    <>
                        <p className="text-muted-foreground text-sm text-center">Ready to authenticate using your device's security features (e.g., fingerprint, face recognition).</p>
                        <Button onClick={handleBiometricSignIn}>Start Scan</Button>
                    </>
                )}
                {biometricStep === 'scanning' && (
                    <>
                        <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Scanning...</p>
                    </>
                )}
                {biometricStep === 'success' && (
                    <>
                         <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                            <Fingerprint className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-green-500">Verification Successful</p>
                    </>
                )}
                {biometricStep === 'error' && (
                     <>
                        <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
                            <Fingerprint className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-destructive">Verification Failed</p>
                    </>
                )}
            </div>
            <DialogFooter>
                {biometricStep !== 'scanning' && biometricStep !== 'success' && (
                    <Button variant="ghost" onClick={resetBiometricPrompt}>Cancel</Button>
                )}
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
