
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
    { name: "Reliance Digital", email: "payment@reliancedigital.in", amount: "- ₹4,999.00", status: "Success" },
    { name: "Swiggy", email: "order@swiggy.in", amount: "- ₹350.00", status: "Success" },
    { name: "Salary Credit", email: "payroll@company.com", amount: "+ ₹85,000.00", status: "Success" },
    { name: "Jio Mobile Recharge", email: "recharge@jio.com", amount: "- ₹749.00", status: "Success" },
    { name: "ATM Withdrawal", email: "atm-txn@canara.in", amount: "- ₹10,000.00", status: "Pending" },
]

export function RecentTransactions() {
  return (
    <Card className="xl:col-span-2 shadow-sm">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your account.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <a href="#">
            View All
          </a>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(tx => (
                <TableRow key={tx.name}>
                <TableCell>
                  <div className="font-medium">{tx.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {tx.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant={tx.status === 'Success' ? 'default' : 'outline'}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right ${tx.amount.startsWith('+') ? 'text-green-600' : ''}`}>{tx.amount}</TableCell>
                 <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Report Issue</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
