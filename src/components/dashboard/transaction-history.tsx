
"use client"

import * as React from "react"
import { MoreHorizontal, ListFilter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "../ui/input"
import type { Transaction } from "@/lib/mock-data"

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export function TransactionHistory({ transactions: allTransactions }: TransactionHistoryProps) {
    const [filteredTransactions, setFilteredTransactions] = React.useState(allTransactions);
    const [currentPage, setCurrentPage] = React.useState(1);
    const transactionsPerPage = 10;

    React.useEffect(() => {
        setFilteredTransactions(allTransactions);
    }, [allTransactions]);

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentPage < Math.ceil(filteredTransactions.length / transactionsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const startIndex = (currentPage - 1) * transactionsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all" onClick={() => setFilteredTransactions(allTransactions)}>All</TabsTrigger>
                    <TabsTrigger value="sent" onClick={() => setFilteredTransactions(allTransactions.filter(t => t.type === 'Debit'))}>Sent</TabsTrigger>
                    <TabsTrigger value="received" onClick={() => setFilteredTransactions(allTransactions.filter(t => t.type === 'Credit'))}>Received</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 gap-1">
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>Completed</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="mt-4">
                <Input placeholder="Search by description..." className="max-w-sm" />
            </div>
            <TabsContent value="all">
                <TransactionTable transactions={paginatedTransactions} />
            </TabsContent>
            <TabsContent value="sent">
                <TransactionTable transactions={paginatedTransactions} />
            </TabsContent>
            <TabsContent value="received">
                 <TransactionTable transactions={paginatedTransactions} />
            </TabsContent>
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions.
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage >= Math.ceil(filteredTransactions.length / transactionsPerPage)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Tabs>
    )
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(tx => (
          <TableRow key={tx.id}>
             <TableCell className="hidden sm:table-cell">{tx.date}</TableCell>
            <TableCell>
              <div className="font-medium">{tx.description}</div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{tx.type}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge 
                className="text-xs" 
                variant={tx.status === 'Completed' ? 'default' : tx.status === 'Pending' ? 'secondary' : 'destructive'}>
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
                  <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                  <DropdownMenuItem>Report Issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
