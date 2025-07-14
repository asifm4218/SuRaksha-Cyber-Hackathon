"use client";

import { useState } from "react";
import { getAnomalySummary } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

export function SecurityOverview() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [is2faDialogOpen, setIs2faDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setSummary("");
    setError("");
    const result = await getAnomalySummary();
    if (result.success && result.summary) {
      setSummary(result.summary);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };

  const handle2faVerification = () => {
    // Simulate verification
    setIs2faDialogOpen(false);
    toast({
        title: "Identity Verified",
        description: "Your identity has been successfully verified.",
        variant: "default",
    })
  }

  return (
    <>
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>AI Security Center</CardTitle>
        <CardDescription>
          Our AI constantly monitors your account for suspicious activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {summary && (
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border">
                <p>{summary}</p>
            </div>
        )}
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Analyzing..." : "Run Security Analysis"}
        </Button>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => setIs2faDialogOpen(true)}>
          Simulate 2FA Challenge
        </Button>
      </CardFooter>
    </Card>
    
    <Dialog open={is2faDialogOpen} onOpenChange={setIs2faDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Verify Your Identity</DialogTitle>
                <DialogDescription>
                    An unusual activity was detected. Please enter the 6-digit code sent to your registered mobile number.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                        Code
                    </Label>
                    <Input id="code" defaultValue="123456" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handle2faVerification}>Verify Identity</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
