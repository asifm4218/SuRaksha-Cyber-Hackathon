
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { handleSignup as handleSignupAction, getRegistrationChallenge, verifyRegistration } from "@/app/actions"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Building, Fingerprint, LoaderCircle } from "lucide-react"
import { cn, arrayBufferToBase64Url, base64UrlToUint8Array } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Building className="h-8 w-8 text-primary" />
      <span className="text-xl font-semibold tracking-tight">Canara Bank</span>
    </div>
  );
}

export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [registerBiometrics, setRegisterBiometrics] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formRef.current) return;
        
        setIsLoading(true);
        const formData = new FormData(formRef.current);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        if (email && password && fullName) {
            const signupResult = await handleSignupAction({ email, password, fullName });
            if (signupResult.success && signupResult.user) {
                
                // If user wants to register biometrics, do it now
                if (registerBiometrics) {
                    try {
                        const challengeResponse = await getRegistrationChallenge(email, fullName);
                        
                        // Remap challenge and user.id from Base64URL to ArrayBuffer
                        const publicKeyCredentialCreationOptions = {
                           ...challengeResponse,
                           challenge: base64UrlToUint8Array(challengeResponse.challenge),
                           user: {
                               ...challengeResponse.user,
                               id: base64UrlToUint8Array(challengeResponse.user.id)
                           }
                        };
                        
                        const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions as any }) as any;

                        // Convert ArrayBuffers to Base64URL for server
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
                                description: "You can now sign in using your fingerprint.",
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
                        // Continue to login even if biometrics fail
                    }
                }

                toast({
                    title: "Account Created!",
                    description: "Your Canara Bank account has been successfully created. Please sign in to continue.",
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
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f2851] p-4">
    <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground">
      <CardHeader className="items-center text-center">
        <Logo className="mb-4" />
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create a new Canara Bank account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" name="fullName" placeholder="Suresh Kumar" required />
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
            {isLoading && <LoaderCircle className="animate-spin mr-2" />}
            Create account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
