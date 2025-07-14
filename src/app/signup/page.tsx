
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react"
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

export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const emailRef = useRef<HTMLInputElement>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        const email = emailRef.current?.value;
        if (email) {
            await handleSignupAction(email);
            toast({
                title: "Account Created!",
                description: "Your VeriSafe account has been successfully created. Please sign in to continue.",
            })
            router.push("/")
        }
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <Logo className="mb-2" />
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create a new VeriSafe account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input id="full-name" placeholder="Suresh Kumar" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              ref={emailRef}
              type="email"
              placeholder="suresh@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full font-semibold">
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
