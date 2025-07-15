
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, Receipt } from "lucide-react";

export function QuickActions() {
    const { toast } = useToast();
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isPayBillOpen, setIsPayBillOpen] = useState(false);

    const handleTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle form data and API calls here.
        toast({
            title: "Transfer Successful",
            description: "The funds have been sent successfully.",
        });
        setIsTransferOpen(false);
    };

    const handlePayBill = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Bill Paid",
            description: "The bill has been paid successfully.",
        });
        setIsPayBillOpen(false);
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
                                <form onSubmit={handleTransfer}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="recipient">Recipient Account</Label>
                                            <Input id="recipient" placeholder="Enter account number or UPI ID" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="amount">Amount (₹)</Label>
                                            <Input id="amount" type="number" placeholder="0.00" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="remarks">Remarks (Optional)</Label>
                                            <Input id="remarks" placeholder="e.g., Dinner last night" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Confirm Transfer</Button>
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
                                <form onSubmit={handlePayBill}>
                                     <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="biller">Select Biller</Label>
                                             <Select required>
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
                                            <Input id="bill-amount" type="number" placeholder="0.00" required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Confirm Payment</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
