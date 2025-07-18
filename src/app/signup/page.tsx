
"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { handleSignup, getCaptchaChallenge } from "@/app/actions"
import type { CaptchaOutput } from "@/app/actions";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle, ShieldCheck, RefreshCw, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { logFirebaseEvent } from "@/services/firebase"
import { Logo } from "@/components/logo";


export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
    const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaOutput | null>(null);
    const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
    const [captchaInput, setCaptchaInput] = useState("");

    const validateForm = (formData: FormData): boolean => {
        const fullName = formData.get('fullName') as string;
        const phone = formData.get('phone') as string;
        const mpin = formData.get('mpin') as string;

        if (password !== confirmPassword) {
            toast({ title: "Passwords Do Not Match", description: "Please ensure both password fields are identical.", variant: "destructive" });
            return false;
        }

        // Full Name: Only characters and spaces
        if (!/^[a-zA-Z\s]+$/.test(fullName)) {
            toast({ title: "Invalid Name", description: "Full name can only contain letters and spaces.", variant: "destructive" });
            return false;
        }

        // Phone Number: Exactly 10 digits
        if (!/^\d{10}$/.test(phone)) {
            toast({ title: "Invalid Phone Number", description: "Phone number must be exactly 10 digits.", variant: "destructive" });
            return false;
        }

        // Password: Strong password validation
        const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/.test(password);
        if (!isStrongPassword) {
            toast({
                title: "Weak Password",
                description: "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character (#, @, _, etc.).",
                variant: "destructive",
            });
            return false;
        }
        
        // MPIN: Exactly 6 digits
        if (!/^\d{6}$/.test(mpin)) {
            toast({ title: "Invalid MPIN", description: "MPIN must be exactly 6 digits.", variant: "destructive" });
            return false;
        }

        return true;
    }

    const handleInitiateSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(formRef.current!);
        if (!validateForm(formData)) {
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
        logFirebaseEvent("sign_up");
        const formData = new FormData(formRef.current);
        const email = formData.get('email') as string;
        const fullName = formData.get('fullName') as string;
        const phone = formData.get('phone') as string;
        const mpin = formData.get('mpin') as string;

        if (email && password && fullName && phone && mpin) {
            const signupResult = await handleSignup({ email, password, fullName, phone, mpin });
            
            if (signupResult.success && signupResult.user) {
                logFirebaseEvent("registration_complete", { method: "email" });

                toast({
                    title: "Account Created!",
                    description: "Next, we'll capture your behavioral baseline for security.",
                });
                // Redirect to the behavior capture page
                router.push(`/signup/capture?email=${encodeURIComponent(email)}`);

            } else {
                logFirebaseEvent("registration_failed", { reason: signupResult.message });
                toast({
                    title: "Sign Up Failed",
                    description: signupResult.message,
                    variant: "destructive",
                });
                setIsLoading(false);
                setIsCaptchaOpen(false);
            }
        } else {
             setIsLoading(false);
             setIsCaptchaOpen(false);
        }
    }

  return (
    <>
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen" suppressHydrationWarning>
        <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <div className="flex justify-center items-center gap-2 mb-2">
                          <Logo className="h-8 w-8 text-primary" />
                          <span className="text-xl font-semibold tracking-tight">Canara Bank</span>
                        </div>
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                        Enter your information to create a new Canara Bank account.
                        </p>
                    </div>
                    <form ref={formRef} onSubmit={handleInitiateSignup} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full name</Label>
                            <Input id="full-name" name="fullName" placeholder="Enter your Name" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" required maxLength={10} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your registered mail ID"
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Enter Password</Label>
                            <div className="relative">
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter Password" 
                                    required 
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-full -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                             <div className="relative">
                                <Input 
                                    id="confirm-password" 
                                    name="confirmPassword" 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirm Password" 
                                    required 
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-full -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mpin">6-Digit MPIN</Label>
                            <Input id="mpin" name="mpin" type="password" inputMode="numeric" maxLength={6} placeholder="Enter MPIN" required />
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
                        {isLoading ? <LoaderCircle className="animate-spin" /> : 'Proceed'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}
