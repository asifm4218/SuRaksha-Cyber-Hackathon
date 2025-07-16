
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AccountSummary } from "@/components/dashboard/account-summary";
import { SecurityOverview } from "@/components/dashboard/security-overview";
import { BehaviorMonitor } from "@/components/dashboard/behavior-monitor";
import { getTransactions, addTransaction, verifyMpin } from "@/app/actions";
import type { Transaction } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, Receipt, LoaderCircle } from "lucide-react";

type PendingAction = {
    type: 'transfer' | 'bill';
    data: any;
} | null;

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(125430.50);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isPayBillOpen, setIsPayBillOpen] = useState(false);
  const [isMpinDialogOpen, setIsMpinDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [mpin, setMpin] = useState("");
  const [isVerifyingMpin, setIsVerifyingMpin] = useState(false);

  const transferFormRef = useRef<HTMLFormElement>(null);
  const billPayFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function loadTransactions() {
      setIsLoading(true);
      const initialTransactions = await getTransactions();
      setTransactions(initialTransactions);
      setIsLoading(false);
    }
    loadTransactions();
  }, []);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    if (newTransaction.type === 'Debit') {
        setBalance(prev => prev - newTransaction.amount);
    }
  };

  const handleTransactionSuccess = (type: 'transfer' | 'bill', data: any, newTransaction: Transaction) => {
      if (type === 'transfer') {
            toast({
              title: "Transfer Successful",
              description: `Sent ₹${data.amount} to ${data.recipient}.`,
          });
      } else {
            toast({
              title: "Bill Paid",
              description: `Paid ₹${data['bill-amount']} for ${data.biller}.`,
          });
      }
      handleTransactionAdded(newTransaction);
  };

  const handleInitiateAction = (e: React.FormEvent, type: 'transfer' | 'bill') => {
      e.preventDefault();
      const formData = new FormData(type === 'transfer' ? transferFormRef.current! : billPayFormRef.current!);
      const data = Object.fromEntries(formData.entries());

      const amount = parseFloat((type === 'transfer' ? data.amount : data['bill-amount']) as string);
      if (amount > balance) {
          toast({
              title: "Insufficient Funds",
              description: `Your balance is too low to complete this transaction.`,
              variant: "destructive",
          });
          return;
      }
      
      setPendingAction({ type, data });
      setIsTransferOpen(false);
      setIsPayBillOpen(false);
      setIsMpinDialogOpen(true);
  };

  const handleMpinVerification = async () => {
      if (!email) {
          toast({ title: "Error", description: "User session not found. Please log in again.", variant: "destructive" });
          return;
      }
      setIsVerifyingMpin(true);

      const isMpinValid = await verifyMpin(email, mpin);

      if (isMpinValid) {
          if (pendingAction?.type === 'transfer') {
              const amount = parseFloat(pendingAction.data.amount as string);
              const result = await addTransaction({
                  description: `Transfer to ${pendingAction.data.recipient}`,
                  amount: amount,
                  type: 'Debit',
              });
              if (result.success && result.newTransaction) {
                  handleTransactionSuccess('transfer', pendingAction.data, result.newTransaction);
              }
          } else if (pendingAction?.type === 'bill') {
              const amount = parseFloat(pendingAction.data['bill-amount'] as string);
                const result = await addTransaction({
                  description: `Bill payment - ${pendingAction.data.biller}`,
                  amount: amount,
                  type: 'Debit',
              });
              if (result.success && result.newTransaction) {
                  handleTransactionSuccess('bill', pendingAction.data, result.newTransaction);
              }
          }
      } else {
          toast({
              title: "Incorrect MPIN",
              description: "The MPIN you entered is incorrect. Please try again.",
              variant: "destructive",
          });
      }
      
      setIsVerifyingMpin(false);
      setIsMpinDialogOpen(false);
      setMpin("");
      setPendingAction(null);
      if (transferFormRef.current) transferFormRef.current.reset();
      if (billPayFormRef.current) billPayFormRef.current.reset();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">Welcome Back!</h1>
      </div>
      <div className="flex flex-col gap-4 md:gap-8">
        {isLoading ? <Skeleton className="h-48 w-full" /> : <AccountSummary balance={balance} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full flex items-center justify-center text-base py-6">
                        <ArrowUpRight className="mr-2 h-5 w-5" /> Transfer Funds
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Funds</DialogTitle>
                        <DialogDescription>
                            Send money to another account. Please double-check the details before sending.
                        </DialogDescription>
                    </DialogHeader>
                    <form ref={transferFormRef} onSubmit={(e) => handleInitiateAction(e, 'transfer')}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="recipient">Recipient Account</Label>
                                <Input id="recipient" name="recipient" placeholder="Enter account number or UPI ID" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount (₹)</Label>
                                <Input id="amount" name="amount" type="number" placeholder="0.00" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="remarks">Remarks (Optional)</Label>
                                <Input id="remarks" name="remarks" placeholder="e.g., Dinner last night" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Proceed to Pay</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isPayBillOpen} onOpenChange={setIsPayBillOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full flex items-center justify-center text-base py-6">
                        <Receipt className="mr-2 h-5 w-5" /> Pay Bills
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pay a Bill</DialogTitle>
                        <DialogDescription>
                            Select a biller and enter the amount to pay.
                        </DialogDescription>
                    </DialogHeader>
                    <form ref={billPayFormRef} onSubmit={(e) => handleInitiateAction(e, 'bill')}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="biller">Select Biller</Label>
                                <Select name="biller" required>
                                    <SelectTrigger id="biller">
                                        <SelectValue placeholder="Choose a biller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electricity Board">Electricity Board</SelectItem>
                                        <SelectItem value="Water Supply">Water Supply</SelectItem>
                                        <SelectItem value="Broadband/Internet">Broadband/Internet</SelectItem>
                                        <SelectItem value="Gas Cylinder">Gas Cylinder</SelectItem>
                                        <SelectItem value="Mobile Recharge">Mobile Recharge</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bill-amount">Amount (₹)</Label>
                                <Input id="bill-amount" name="bill-amount" type="number" placeholder="0.00" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Proceed to Pay</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

             <div className="md:col-span-2 lg:col-span-1">
                <BehaviorMonitor />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-3">
                <RecentTransactions initialTransactions={transactions} isClient={!isLoading} />
            </div>
        </div>
      </div>

      <Dialog open={isMpinDialogOpen} onOpenChange={(open) => { if (!open) setMpin(""); setIsMpinDialogOpen(open); }}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Enter MPIN to Authorize</DialogTitle>
                  <DialogDescription>
                      For your security, please enter your 6-digit MPIN to complete this transaction.
                  </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                  <Label htmlFor="mpin">MPIN</Label>
                  <Input 
                      id="mpin"
                      type="password"
                      maxLength={6}
                      value={mpin}
                      onChange={(e) => setMpin(e.target.value)}
                      placeholder="******"
                      className="text-center tracking-[0.5em]"
                  />
              </div>
              <DialogFooter>
                  <Button 
                      onClick={handleMpinVerification} 
                      disabled={mpin.length !== 6 || isVerifyingMpin}
                  >
                      {isVerifyingMpin && <LoaderCircle className="animate-spin mr-2" />}
                      Confirm Transaction
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
