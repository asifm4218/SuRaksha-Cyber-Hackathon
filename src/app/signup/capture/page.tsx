
"use client";

import { Suspense } from 'react';
import { BehaviorCapture } from '@/components/auth/behavior-capture';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Keyboard, MousePointer, Timer } from 'lucide-react';

function CapturePageContent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Create Your Behavioral Profile</CardTitle>
                    <CardDescription className="text-balance">
                        To secure your account, we need to learn your unique interaction patterns. 
                        Please type the following text naturally.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6 border-b pb-4">
                        <div className="flex flex-col items-center gap-1">
                            <Keyboard className="h-6 w-6 text-primary" />
                            <h3 className="font-semibold">Typing Speed</h3>
                            <p className="text-xs text-muted-foreground">How fast you type.</p>
                        </div>
                         <div className="flex flex-col items-center gap-1">
                            <Timer className="h-6 w-6 text-primary" />
                            <h3 className="font-semibold">Key Pressure</h3>
                            <p className="text-xs text-muted-foreground">How long you hold keys.</p>
                        </div>
                         <div className="flex flex-col items-center gap-1">
                            <MousePointer className="h-6 w-6 text-primary" />
                            <h3 className="font-semibold">Mouse Movement</h3>
                            <p className="text-xs text-muted-foreground">How you move your cursor.</p>
                        </div>
                    </div>
                    <BehaviorCapture />
                </CardContent>
            </Card>
        </div>
    );
}


export default function BehaviorCapturePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CapturePageContent />
        </Suspense>
    );
}

    