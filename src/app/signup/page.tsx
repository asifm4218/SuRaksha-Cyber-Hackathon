
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { handleSignup as handleSignupAction } from "@/app/actions"

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
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formRef.current) return;
        
        setIsLoading(true);
        const formData = new FormData(formRef.current);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (email && password) {
            const result = await handleSignupAction({ email, password });
            if (result.success) {
                toast({
                    title: "Account Created!",
                    description: "Your VeriSafe account has been successfully created. Please sign in to continue.",
                })
                router.push("/")
            } else {
                toast({
                    title: "Sign Up Failed",
                    description: result.message,
                    variant: "destructive",
                });
            }
        }
        setIsLoading(false);
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <Logo className="mb-4" />
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create a new VeriSafe account.
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
          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin mr-2" />}
            Create account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
