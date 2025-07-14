
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Fingerprint, LoaderCircle, Check, ShieldQuestion, ShieldCheck } from "lucide-react";

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
import { verifyBiometricLogin, handleLogin } from "./actions";
import { useToast } from "@/hooks/use-toast";

type BiometricState = "idle" | "scanning" | "analyzing" | "success" | "error";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [biometricState, setBiometricState] = useState<BiometricState>("idle");
  const [biometricMessage, setBiometricMessage] = useState("Use your fingerprint to sign in.");
  const [progress, setProgress] = useState(0);
  const [captchaState, setCaptchaState] = useState<"unchecked" | "checking" | "verified">("unchecked");
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);


  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaState !== 'verified' || !formRef.current) return;

    setIsLoading(true);
    const formData = new FormData(formRef.current);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await handleLogin({ email, password });

    if (result.success) {
      toast({
        title: "Sign In Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Sign In Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleCaptchaCheck = () => {
    if (captchaState === 'unchecked') {
      setCaptchaState('checking');
      setTimeout(() => {
        setCaptchaState('verified');
      }, 1500);
    }
  }

  const resetBiometricDialog = useCallback(() => {
    setBiometricState('idle');
    setProgress(0);
    setBiometricMessage("Use your fingerprint to sign in.");
  }, []);

  const handleBiometricLogin = () => {
    setIsBiometricOpen(true);
    setBiometricState("scanning");
    setBiometricMessage("Place your finger on the sensor.");
    setProgress(0);
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBiometricOpen && biometricState === "scanning") {
        timer = setTimeout(() => {
            setBiometricState("analyzing");
            setBiometricMessage("Analyzing biometric and behavioral data...");
        }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isBiometricOpen, biometricState]);


  useEffect(() => {
    if (biometricState !== "analyzing") return;
    
    let progressInterval: NodeJS.Timeout;

    const callVerification = async () => {
        const result = await verifyBiometricLogin();
        clearInterval(progressInterval);
        setProgress(100);

        if (result.success) {
            setBiometricState("success");
            setBiometricMessage(result.message);
            setTimeout(() => {
                setIsBiometricOpen(false);
                router.push("/dashboard");
            }, 2000);
        } else {
            setBiometricState("error");
            setBiometricMessage(result.message);
        }
    };

    progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    callVerification();

    return () => clearInterval(progressInterval);
  }, [biometricState, router]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" />
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Securely sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={onLoginSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="analyst@verisafe.co"
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

            <div className="flex items-center space-x-2 rounded-md border border-input p-3 bg-secondary/50">
                <div onClick={handleCaptchaCheck} className="cursor-pointer">
                    <div className="h-6 w-6 rounded-sm border border-primary bg-background flex items-center justify-center">
                        {captchaState === 'checking' && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {captchaState === 'verified' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                </div>
                <Label htmlFor="terms" className="flex-1">
                  {captchaState === 'checking' ? 'Analyzing...' : "I am not a robot"}
                </Label>
                <div className="text-center">
                    <ShieldQuestion className="h-6 w-6 text-muted-foreground"/>
                    <p className="text-xs text-muted-foreground">VeriSafe AI</p>
                </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={captchaState !== 'verified' || isLoading}>
              {isLoading && <LoaderCircle className="animate-spin mr-2" />}
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
            resetBiometricDialog();
          }
          setIsBiometricOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Biometric Authentication</DialogTitle>
                <DialogDescription>
                    {biometricMessage}
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-6 py-8">
                {biometricState !== 'success' && (
                    <Fingerprint 
                        className={cn(
                            "h-24 w-24 text-muted-foreground transition-colors duration-500",
                            biometricState === 'scanning' && 'animate-pulse text-primary',
                            (biometricState === 'analyzing' || biometricState === 'success') && 'text-primary',
                            biometricState === 'error' && 'text-destructive'
                        )}
                    />
                )}
                {biometricState === 'success' && (
                    <ShieldCheck className="h-24 w-24 text-green-500" />
                )}

                {(biometricState === 'analyzing' || biometricState === 'success') && (
                    <div className="w-full max-w-xs space-y-2">
                         <Progress value={progress} className="h-2" />
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
