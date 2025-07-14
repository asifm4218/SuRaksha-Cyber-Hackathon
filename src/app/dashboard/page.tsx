import { AccountSummary } from "@/components/dashboard/account-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { BehaviorMonitor } from "@/components/dashboard/behavior-monitor";

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Welcome Back!</h1>
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <AccountSummary />
            <QuickActions />
          </div>
          <RecentTransactions />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <SecurityOverview />
            <BehaviorMonitor />
        </div>
      </div>
    </>
  );
}
