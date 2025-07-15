
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
import { format } from 'date-fns'
import { Skeleton } from "../ui/skeleton"

interface TransactionHistoryProps {
    initialTransactions: Transaction[];
}

export function TransactionHistory({ initialTransactions }: TransactionHistoryProps) {
    const [filteredTransactions, setFilteredTransactions] = React.useState(initialTransactions);
    const [activeTab, setActiveTab] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isClient, setIsClient] = React.useState(false);
    const transactionsPerPage = 10;
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    React.useEffect(() => {
        let transactions = initialTransactions;

        if (activeTab === 'sent') {
            transactions = initialTransactions.filter(t => t.type === 'Debit');
        } else if (activeTab === 'received') {
            transactions = initialTransactions.filter(t => t.type === 'Credit');
        }

        if (searchTerm) {
            transactions = transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredTransactions(transactions);
        setCurrentPage(1); // Reset to first page on filter change
    }, [initialTransactions, activeTab, searchTerm]);

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentPage < Math.ceil(filteredTransactions.length / transactionsPerPage)) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const startIndex = (currentPage - 1) * transactionsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    return (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="received">Received</TabsTrigger>
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
                <Input 
                    placeholder="Search by description..." 
                    className="max-w-sm" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <TabsContent value="all">
                <TransactionTable transactions={paginatedTransactions} isClient={isClient} />
            </TabsContent>
            <TabsContent value="sent">
                <TransactionTable transactions={paginatedTransactions} isClient={isClient} />
            </TabsContent>
            <TabsContent value="received">
                 <TransactionTable transactions={paginatedTransactions} isClient={isClient} />
            </TabsContent>
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages > 0 ? totalPages : 1}
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
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Tabs>
    )
}

function TransactionTable({ transactions, isClient }: { transactions: Transaction[], isClient: boolean }) {
  if (!isClient) {
    return (
      <div className="space-y-2 mt-4">
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md border">
                <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-20" />
            </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
        <div className="flex items-center justify-center h-48 border rounded-md">
            <p className="text-muted-foreground">No transactions found.</p>
        </div>
    )
  }
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
             <TableCell className="hidden sm:table-cell">{format(new Date(tx.date), 'PP')}</TableCell>
            <TableCell>
              <div className="font-medium">{tx.description}</div>
               <div className="text-sm text-muted-foreground sm:hidden">
                    {format(new Date(tx.date), 'PP')}
                </div>
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
