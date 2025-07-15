
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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


export function QuickActions() {
    const { toast } = useToast();
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isPayBillOpen, setIsPayBillOpen] = useState(false);
    const [isMpinDialogOpen, setIsMpinDialogOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [mpin, setMpin] = useState("");
    const [isVerifyingMpin, setIsVerifyingMpin] = useState(false);

    const transferFormRef = useRef<HTMLFormElement>(null);
    const billPayFormRef = useRef<HTMLFormElement>(null);

    const handleInitiateAction = (e: React.FormEvent, type: 'transfer' | 'bill') => {
        e.preventDefault();
        const formData = new FormData(type === 'transfer' ? transferFormRef.current! : billPayFormRef.current!);
        const data = Object.fromEntries(formData.entries());
        
        setPendingAction({ type, data });
        setIsTransferOpen(false);
        setIsPayBillOpen(false);
        setIsMpinDialogOpen(true);
    };

    const handleMpinVerification = () => {
        setIsVerifyingMpin(true);

        // Simulate network delay
        setTimeout(() => {
            if (mpin === "180805") {
                if (pendingAction?.type === 'transfer') {
                    toast({
                        title: "Transfer Successful",
                        description: `Sent ₹${pendingAction.data.amount} to ${pendingAction.data.recipient}.`,
                    });
                } else if (pendingAction?.type === 'bill') {
                    toast({
                        title: "Bill Paid",
                        description: `Paid ₹${pendingAction.data['bill-amount']} for ${pendingAction.data.biller}.`,
                    });
                }
                // Here you would typically add the transaction to a list
                // For now, we just show the toast.
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
        }, 1000);
    };


    return (
        <>
            <Card className="sm:col-span-2 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Your most-used actions, one click away.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <ArrowUpRight className="mr-2 h-4 w-4" /> Transfer Funds
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
                                <Button variant="secondary">
                                    <Receipt className="mr-2 h-4 w-4" /> Pay Bills
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
                                                    <SelectItem value="electricity">Electricity Board</SelectItem>
                                                    <SelectItem value="water">Water Supply</SelectItem>
                                                    <SelectItem value="internet">Broadband/Internet</SelectItem>
                                                    <SelectItem value="gas">Gas Cylinder</SelectItem>
                                                    <SelectItem value="mobile">Mobile Recharge</SelectItem>
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
                    </div>
                </CardContent>
            </Card>

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
    )
}
