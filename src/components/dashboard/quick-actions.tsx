
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Landmark, Receipt } from "lucide-react";

export function QuickActions() {
    return (
        <Card className="sm:col-span-2 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                    Your most-used actions, one click away.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <Button>
                        <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer Funds
                    </Button>
                    <Button variant="secondary">
                        <Receipt className="mr-2 h-4 w-4" /> Pay Bills
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
