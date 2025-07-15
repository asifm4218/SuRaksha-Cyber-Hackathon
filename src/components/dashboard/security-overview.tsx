
"use client";

import { useState, useEffect } from "react";
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
import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";

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
      if (result.summary.includes("unusual")) {
        // Automatically trigger 2FA if an anomaly is detected
        setTimeout(() => setIs2faDialogOpen(true), 1000);
      }
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Run analysis on component mount
    handleAnalyze();
  }, [])


  const handle2faVerification = () => {
    // Simulate verification
    setIs2faDialogOpen(false);
    toast({
        title: "Identity Verified",
        description: "Your identity has been successfully verified. You can continue your session.",
    })
  }

  return (
    <>
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>AI Security Center</CardTitle>
        <CardDescription>
          Our AI continuously analyzes your session for behavioral anomalies.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading && !summary && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {summary && (
             <div className={`text-sm p-4 rounded-lg border flex items-start gap-3 ${summary.includes("unusual") ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-muted/50'}`}>
                {summary.includes("unusual") ? <AlertTriangle className="h-5 w-5 flex-shrink-0"/> : <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-500" />}
                <p className="flex-grow">{summary}</p>
            </div>
        )}
        
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Analyzing..." : "Re-run Security Analysis"}
        </Button>
         <Button variant="outline" className="w-full" onClick={() => setIs2faDialogOpen(true)}>
          Manually Trigger 2FA Challenge
        </Button>
      </CardFooter>
    </Card>
    
    <Dialog open={is2faDialogOpen} onOpenChange={setIs2faDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Verify Your Identity</DialogTitle>
                <DialogDescription>
                    As a security precaution, we need to verify it's really you. Please enter the code sent to your registered mobile number to continue.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                        Code
                    </Label>
                    <Input id="code" defaultValue="4629" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handle2faVerification}>Confirm Identity</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
