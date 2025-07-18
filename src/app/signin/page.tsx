
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { handleLogin, getAuthenticationChallenge, verifyBiometricLogin, getCaptchaChallenge } from "@/app/actions";
import Image from "next/image";
import type { CaptchaOutput } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Fingerprint, LoaderCircle, ShieldCheck, RefreshCw } from "lucide-react";
import { cn, arrayBufferToBase64Url, base64UrlToUint8Array } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { logFirebaseEvent, setFirebaseUser, setFirebaseUserProperties } from "@/services/firebase";
import { sessionManager } from "@/services/session-service";

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Smartphone className="h-8 w-8 text-primary" />
      <span className="text-xl font-semibold tracking-tight">VeriSafe</span>
    </div>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [biometricStep, setBiometricStep] = useState<'initial' | 'scanning' | 'success' | 'error'>('initial');
  const [biometricError, setBiometricError] = useState('');

  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaOutput | null>(null);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");

  const loadCaptcha = async () => {
    setIsCaptchaLoading(true);
    setCaptchaChallenge(null);
    setCaptchaInput("");
    const challenge = await getCaptchaChallenge();
    setCaptchaChallenge(challenge);
    setIsCaptchaLoading(false);
  }

  const handleStandardLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCaptchaOpen(true);
    loadCaptcha();
  };

  const handleCaptchaAndLogin = async () => {
    if (!formRef.current) return;
    setIsLoginLoading(true);

    const formData = new FormData(formRef.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      const result = await handleLogin({ email, password });
      if (result.success && result.user) {
        logFirebaseEvent("login_success", { method: "password" });
        setFirebaseUser(result.user.email);
        setFirebaseUserProperties({ account_type: "standard", user_tier: "silver" });
        sessionManager.createSession(result.user.email);
        toast({
            title: "Sign In Successful",
            description: "Welcome back to VeriSafe!",
        });
        router.push(`/dashboard?email=${result.user.email}`);
      } else {
        logFirebaseEvent("login_failure", { method: "password", reason: result.message });
        toast({
          title: "Sign In Failed",
          description: result.message,
          variant: "destructive",
        });
        setIsCaptchaOpen(false); // Close captcha on failure to allow retry
      }
    }
    setIsLoginLoading(false);
  };

  const handleBiometricSignIn = async () => {
    const email = emailRef.current?.value;
    if (!email) {
        setBiometricError("Please enter your email address first to look up your biometric credential.");
        setBiometricStep('error');
        return;
    }

    setIsBiometricLoading(true);
    setBiometricStep('scanning');

    try {
        const challengeResponse = await getAuthenticationChallenge(email);

        if (!challengeResponse.success) {
            setBiometricError(challengeResponse.message || 'Could not start biometric authentication.');
            setBiometricStep('error');
            setIsBiometricLoading(false);
            return;
        }

        const options = {
            challenge: base64UrlToUint8Array(challengeResponse.challenge!),
            rpId: challengeResponse.rpId,
            allowCredentials: challengeResponse.allowCredentials?.map(cred => ({
                ...cred,
                id: base64UrlToUint8Array(cred.id),
            })),
            userVerification: challengeResponse.userVerification,
            timeout: challengeResponse.timeout
        };

        const credential = await navigator.credentials.get({ publicKey: options as any }) as any;
        
        const verificationData = {
            id: credential.id,
            rawId: arrayBufferToBase64Url(credential.rawId),
            response: {
                clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
                authenticatorData: arrayBufferToBase64Url(credential.response.authenticatorData),
                signature: arrayBufferToBase64Url(credential.response.signature),
                userHandle: credential.response.userHandle ? arrayBufferToBase64Url(credential.response.userHandle) : null,
            },
            type: credential.type,
            challenge: challengeResponse.challenge, 
        };

        const result = await verifyBiometricLogin(email, verificationData);
        if (result.success && result.user) {
            logFirebaseEvent("login_success", { method: "biometric" });
            logFirebaseEvent("mfa_completed", { method: "biometric" });
            setFirebaseUser(result.user.email);
            setFirebaseUserProperties({ account_type: "premium", user_tier: "gold" });
            sessionManager.createSession(result.user.email);

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
            logFirebaseEvent("login_failure", { method: "biometric", reason: "verification_failed" });
            setBiometricError(result.message || "Could not verify identity. Please try again.");
            setBiometricStep('error');
        }
    } catch (error: any) {
        logFirebaseEvent("login_failure", { method: "biometric", reason: error.name || "exception" });
        console.error("Biometric sign-in error:", error);
        setBiometricError(error.name === 'NotAllowedError' ? 'Authentication cancelled.' : 'An unexpected error occurred.');
        setBiometricStep('error');
    }
    
    setIsBiometricLoading(false);
  };

  const resetBiometricPrompt = () => {
    setIsBiometricPromptOpen(false);
    setBiometricStep('initial');
    setBiometricError('');
  }

  return (
    <>
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center mb-2" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details to sign in to your account
            </p>
          </div>
          <form ref={formRef} onSubmit={handleStandardLoginAttempt} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="suresh@example.com"
                required
                defaultValue="analyst@canara.co"
                ref={emailRef}
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
            <Button type="submit" className="w-full font-semibold">
              Sign in
            </Button>
          </form>
           <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                  </span>
              </div>
            </div>
          <Button
            variant="outline"
            className="w-full font-semibold"
            onClick={() => setIsBiometricPromptOpen(true)}
          >
              <Fingerprint className="mr-2 h-4 w-4" />
            Sign in with Biometrics
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Image"
          width="1920"
          height="1080"
          data-ai-hint="fintech app mobile"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>

    {/* Biometric Dialog */}
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
                        <Button onClick={handleBiometricSignIn} disabled={isBiometricLoading}>
                            {isBiometricLoading ? <LoaderCircle className="animate-spin" /> : 'Start Scan'}
                        </Button>
                    </>
                )}
                {biometricStep === 'scanning' && (
                    <>
                        <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Scanning...</p>
                        <p className="text-xs text-muted-foreground text-center">Follow the instructions from your browser or operating system.</p>
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
                        <p className="text-sm text-muted-foreground text-center">{biometricError}</p>
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

    {/* CAPTCHA Dialog */}
    <Dialog open={isCaptchaOpen} onOpenChange={setIsCaptchaOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
                <DialogTitle className="flex items-center justify-center gap-2">
                    <ShieldCheck className="text-primary"/> Human Verification
                </DialogTitle>
                <DialogDescription className="text-center pt-2">
                    To protect your account, please type the text from the image below.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4 gap-4">
                {isCaptchaLoading ? (
                    <div className="w-full h-[100px] flex items-center justify-center">
                        <Skeleton className="w-[300px] h-full" />
                    </div>
                ) : captchaChallenge?.imageUrl && captchaChallenge.correctText !== 'error' ? (
                    <>
                        <div className="relative">
                            <Image src={captchaChallenge.imageUrl} alt="CAPTCHA image" width={300} height={100} className="rounded-lg border shadow-sm bg-muted"/>
                        </div>
                        <Input 
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            placeholder="Type the text here"
                            className="text-center tracking-widest"
                            maxLength={6}
                        />
                    </>
                ) : (
                    <div className="text-center text-destructive p-4">
                        <p>Could not load the verification challenge.</p>
                        <p className="text-sm text-muted-foreground">Please try again later.</p>
                    </div>
                )}
            </div>
            <DialogFooter className="sm:justify-between gap-2">
                 <Button 
                    variant="outline"
                    className="w-full"
                    onClick={loadCaptcha}
                    disabled={isCaptchaLoading}
                >
                    {isCaptchaLoading ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
                    New Image
                </Button>
                <Button 
                    className="w-full"
                    onClick={handleCaptchaAndLogin}
                    disabled={isLoginLoading || isCaptchaLoading || !captchaChallenge || captchaInput.toLowerCase() !== captchaChallenge?.correctText.toLowerCase()}
                >
                    {isLoginLoading ? <LoaderCircle className="animate-spin" /> : 'Sign in'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
