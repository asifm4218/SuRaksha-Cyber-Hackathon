
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint } from "lucide-react";

export function BehaviorMonitor() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Behavioral Biometrics
        </CardTitle>
        <CardDescription>
          Continuous authentication based on your unique interaction patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            To enhance your security, Canara Bank continuously analyzes how you
            interact with the app. Metrics like{" "}
            <span className="font-semibold text-foreground">typing speed</span>,{" "}
            <span className="font-semibold text-foreground">
              mouse movements
            </span>
            , and{" "}
            <span className="font-semibold text-foreground">
              click patterns
            </span>{" "}
            create a unique behavioral profile.
          </p>
          <p>
            If a significant deviation is detected, we may trigger a 2FA challenge to ensure it's really you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
