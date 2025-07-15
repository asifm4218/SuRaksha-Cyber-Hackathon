
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint, BarChart, MousePointerClick } from "lucide-react";

export function BehaviorMonitor() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-primary" />
          Behavioral Biometrics
        </CardTitle>
        <CardDescription>
          Continuous authentication based on your unique interaction patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          To protect your account after you log in, VeriSafe continuously and non-intrusively analyzes how you interact with the app. This creates a unique "behavioral fingerprint" that is difficult for fraudsters to replicate.
        </p>
        <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
                <BarChart className="h-5 w-5 mt-1 text-accent" />
                <div>
                    <h4 className="font-semibold">Typing & Navigation Cadence</h4>
                    <p className="text-muted-foreground text-xs">The rhythm and speed of your typing and how you navigate between pages.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <MousePointerClick className="h-5 w-5 mt-1 text-accent" />
                <div>
                    <h4 className="font-semibold">Interaction Patterns</h4>
                    <p className="text-muted-foreground text-xs">The pressure, duration, and angle of your taps, clicks, and swipes.</p>
                </div>
            </div>
        </div>
        <p className="text-xs text-center text-muted-foreground pt-2">
          This analysis is privacy-preserving and does not store any personal data.
        </p>
      </CardContent>
    </Card>
  );
}
