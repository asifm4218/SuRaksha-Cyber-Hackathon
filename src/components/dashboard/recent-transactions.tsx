
"use client";

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
import type { Transaction } from "@/lib/mock-data";
import { Skeleton } from "../ui/skeleton";
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface RecentTransactionsProps {
  initialTransactions: Transaction[];
  isClient: boolean;
}

export function RecentTransactions({ initialTransactions, isClient }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
      setTransactions(initialTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [initialTransactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="xl:col-span-2 shadow-sm flex flex-col flex-1">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your account.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href={`/dashboard/transactions?email=${email}`}>
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
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
            {!isClient ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                     <Skeleton className="h-5 w-32" />
                     <Skeleton className="h-4 w-24 mt-1" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : recentTransactions.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No recent transactions.
                    </TableCell>
                </TableRow>
            ) : (
                recentTransactions.map(tx => (
                    <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-medium">{tx.description}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {format(new Date(tx.date), 'PPpp')}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant={tx.status === 'Completed' ? 'default' : 'outline'}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${tx.type === 'Credit' ? 'text-green-600' : ''}`}>
                       {tx.type === 'Credit' ? `+ ₹${tx.amount.toFixed(2)}` : `- ₹${tx.amount.toFixed(2)}`}
                    </TableCell>
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
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
