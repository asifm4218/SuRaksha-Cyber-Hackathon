
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountSummary() {
    return (
        <Card className="sm:col-span-2 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Your Accounts</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                A quick overview of your funds.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Primary Account</span>
                    <span className="text-2xl font-bold">₹1,25,430.50</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-sm text-muted-foreground">Savings</span>
                    <span className="text-lg font-semibold">₹5,80,000.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
    )
}
