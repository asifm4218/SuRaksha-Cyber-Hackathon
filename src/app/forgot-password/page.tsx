
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { handleForgotPassword } from "@/app/actions"
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
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"


export default function ForgotPasswordPage() {
    const router = useRouter()
    const { toast } = useToast()
    const emailRef = useRef<HTMLInputElement>(null);

    const handleSendResetLink = (e: React.FormEvent) => {
        e.preventDefault()
        const email = emailRef.current?.value;
        if (email) {
            handleForgotPassword(email);
            toast({
                title: "Reset Link Sent",
                description: "If an account with that email exists, a password reset link has been sent.",
            })
            router.push("/signin")
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card text-card-foreground">
        <CardHeader className="items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold tracking-tight">Canara Bank</span>
            </div>
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <CardDescription>
                No problem. Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSendResetLink} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                ref={emailRef}
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <Button type="submit" className="w-full font-semibold">
                Send Reset Link
            </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                <Link href="/signin" className="underline">
                    Back to Sign In
                </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
