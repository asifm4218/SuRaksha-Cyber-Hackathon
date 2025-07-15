
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AccountSummary } from "@/components/dashboard/account-summary";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { BehaviorMonitor } from "@/components/dashboard/behavior-monitor";
import { getTransactions } from "@/app/actions";

export default async function DashboardPage() {
  const initialTransactions = await getTransactions();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Welcome Back!</h1>
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 lg:[grid-template-areas:'summary_summary_security''transactions_transactions_monitor']">
        <div className="lg:[grid-area:summary]">
            <AccountSummary />
        </div>
        <div className="lg:[grid-area:summary]">
            <QuickActions />
        </div>
        <div className="lg:[grid-area:transactions] lg:col-span-2">
           <RecentTransactions initialTransactions={initialTransactions} />
        </div>
        <div className="lg:[grid-area:security]">
            <SecurityOverview />
        </div>
        <div className="lg:[grid-area:monitor]">
            <BehaviorMonitor />
        </div>
      </div>
    </>
  );
}
