
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { handleLogin, getAuthenticationChallenge, verifyBiometricLogin } from "@/app/actions";

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
import { cn, arrayBufferToBase64Url, base64UrlToUint8Array } from "@/lib/utils";
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
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [biometricStep, setBiometricStep] = useState<'initial' | 'scanning' | 'success' | 'error'>('initial');
  const [biometricError, setBiometricError] = useState('');

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
            description: "Welcome back to VeriSafe!",
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
            setBiometricError(result.message || "Could not verify identity. Please try again.");
            setBiometricStep('error');
        }
    } catch (error: any) {
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

  const onRecaptchaChange = (value: string | null) => {
    setIsRecaptchaVerified(!!value);
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground">
          <CardHeader className="items-center text-center">
            <Logo className="mb-4" />
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your secure banking dashboard.
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
               <div className="flex justify-center">
                 <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={onRecaptchaChange}
                  />
               </div>
              <Button type="submit" className="w-full font-semibold" disabled={isLoginLoading || !isRecaptchaVerified}>
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
    </>
  );
}
