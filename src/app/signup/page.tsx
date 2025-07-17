
"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { handleSignup, getRegistrationChallenge, verifyRegistration, getCaptchaChallenge } from "@/app/actions"
import type { CaptchaOutput } from "@/app/actions";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Smartphone, Fingerprint, LoaderCircle, ShieldCheck, RefreshCw } from "lucide-react"
import { cn, arrayBufferToBase64Url, base64UrlToUint8Array } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";


function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Smartphone className="h-8 w-8 text-primary" />
      <span className="text-xl font-semibold tracking-tight">VeriSafe</span>
    </div>
  );
}

export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [registerBiometrics, setRegisterBiometrics] = useState(false);
    
    const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
    const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaOutput | null>(null);
    const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
    const [captchaInput, setCaptchaInput] = useState("");

    const handleInitiateSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(formRef.current!);
        const mpin = formData.get('mpin') as string;
        if (mpin.length !== 6 || !/^\d{6}$/.test(mpin)) {
            toast({
                title: "Invalid MPIN",
                description: "MPIN must be exactly 6 digits.",
                variant: "destructive",
            });
            return;
        }

        setIsCaptchaOpen(true);
        loadCaptcha();
    }

    const loadCaptcha = async () => {
        setIsCaptchaLoading(true);
        setCaptchaChallenge(null);
        setCaptchaInput("");
        const challenge = await getCaptchaChallenge();
        setCaptchaChallenge(challenge);
        setIsCaptchaLoading(false);
    }

    const handleFinalSignup = async () => {
        if (!formRef.current) return;
        
        setIsLoading(true);
        const formData = new FormData(formRef.current);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;
        const phone = formData.get('phone') as string;
        const mpin = formData.get('mpin') as string;

        if (email && password && fullName && phone && mpin) {
            const signupResult = await handleSignup({ email, password, fullName, phone, mpin });
            if (signupResult.success && signupResult.user) {
                
                if (registerBiometrics) {
                    try {
                        const challengeResponse = await getRegistrationChallenge(email, fullName);
                        
                        const publicKeyCredentialCreationOptions = {
                           ...challengeResponse,
                           challenge: base64UrlToUint8Array(challengeResponse.challenge),
                           user: {
                               ...challengeResponse.user,
                               id: base64UrlToUint8Array(challengeResponse.user.id)
                           }
                        };
                        
                        const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions as any }) as any;

                        const credentialForServer = {
                          id: credential.id,
                          rawId: arrayBufferToBase64Url(credential.rawId),
                          response: {
                            clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
                            attestationObject: arrayBufferToBase64Url(credential.response.attestationObject),
                          },
                          type: credential.type,
                        };

                        const verificationResult = await verifyRegistration(email, credentialForServer);
                        if (verificationResult.success) {
                            toast({
                                title: "Biometrics Registered!",
                                description: "You can now sign in using your device's security features.",
                            });
                        } else {
                           throw new Error("Biometric verification failed.");
                        }

                    } catch (err: any) {
                        console.error("Biometric registration failed", err);
                        toast({
                            title: "Biometric Registration Failed",
                            description: err.name === 'NotAllowedError' ? 'Registration was cancelled.' : 'Could not register biometrics.',
                            variant: "destructive",
                        });
                    }
                }

                toast({
                    title: "Account Created!",
                    description: "Your VeriSafe account has been successfully created. Please sign in to continue.",
                });
                router.push("/signin");

            } else {
                toast({
                    title: "Sign Up Failed",
                    description: signupResult.message,
                    variant: "destructive",
                });
            }
        }
        setIsLoading(false);
        setIsCaptchaOpen(false);
    }

  return (
    <>
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Logo className="justify-center mb-2" />
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                        Enter your information to create a new VeriSafe account.
                        </p>
                    </div>
                    <form ref={formRef} onSubmit={handleInitiateSignup} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full name</Label>
                            <Input id="full-name" name="fullName" placeholder="Suresh Kumar" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
                        </div>
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
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mpin">6-Digit MPIN</Label>
                            <Input id="mpin" name="mpin" type="password" inputMode="numeric" maxLength={6} placeholder="******" required />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="biometrics" onCheckedChange={(checked) => setRegisterBiometrics(Boolean(checked))} />
                            <label
                                htmlFor="biometrics"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                                <Fingerprint className="h-4 w-4" /> Register Biometrics on this device
                            </label>
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                            {isLoading ? <LoaderCircle className="animate-spin mr-2" /> : 'Create account'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/signin" className="underline">
                            Sign in
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
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
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
                        onClick={handleFinalSignup}
                        disabled={isLoading || isCaptchaLoading || !captchaChallenge || captchaInput.toLowerCase() !== captchaChallenge?.correctText.toLowerCase()}
                    >
                        {isLoading ? <LoaderCircle className="animate-spin" /> : 'Create Account'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}
