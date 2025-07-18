
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BehaviorTracker, type BehaviorMetrics } from '@/services/behavior-tracking-service';
import { storeBehavioralBaseline } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoaderCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const sampleText = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Please type it as you normally would, without trying to be perfect. Your natural rhythm is what helps us protect your account from unauthorized access. We analyze patterns like your typing speed and the pauses you make between keystrokes to create a unique behavioral signature. This process is secure and does not store the content you type, only the patterns of your interaction.";

export function BehaviorCapture() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const email = searchParams.get('email');
    const [typedText, setTypedText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const trackerRef = useRef<BehaviorTracker | null>(null);

    useEffect(() => {
        if (!email) {
            toast({
                title: 'Error',
                description: 'User email not found. Please start the sign-up process again.',
                variant: 'destructive',
            });
            router.push('/signup');
            return;
        }

        trackerRef.current = new BehaviorTracker(email);
        trackerRef.current.start();

        return () => {
            trackerRef.current?.stop();
        };
    }, [email, router, toast]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTypedText(e.target.value);
        if (e.target.value.length >= sampleText.length) {
            setIsComplete(true);
        }
    };

    const handleSaveBaseline = async () => {
        if (!trackerRef.current || !email) return;

        setIsSaving(true);
        trackerRef.current.stop();
        const metrics = trackerRef.current.getMetrics();
        
        // We only want to store the baseline averages, not the raw data
        const baselineData = {
            typingSpeedWPM: metrics.typingSpeedWPM,
            backspaceCount: metrics.backspaceCount,
            avgKeyHoldDuration: metrics.avgKeyHoldDuration
        };

        const result = await storeBehavioralBaseline(email, baselineData);
        setIsSaving(false);

        if (result.success) {
            toast({
                title: 'Behavioral Profile Saved!',
                description: 'Your account is now protected. Redirecting to sign in...',
            });
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        } else {
            toast({
                title: 'Error Saving Profile',
                description: 'There was an issue saving your behavioral profile. Please try again.',
                variant: 'destructive',
            });
            trackerRef.current.start(); // Restart tracking
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="w-full p-4 border rounded-md bg-muted/50 text-muted-foreground text-sm">
                <p>{sampleText}</p>
            </div>
            <Textarea
                value={typedText}
                onChange={handleTextChange}
                placeholder="Start typing here..."
                rows={8}
                className="w-full text-base"
                aria-label="Type the sample text here"
            />
            <div className="w-full flex justify-end">
                 <Button onClick={handleSaveBaseline} disabled={!isComplete || isSaving} className="min-w-[150px]">
                    {isSaving ? (
                        <LoaderCircle className="animate-spin" />
                    ) : isComplete ? (
                        <>
                            <CheckCircle className="mr-2" /> Complete Registration
                        </>
                    ) : (
                        'Complete the text above'
                    )}
                </Button>
            </div>
        </div>
    );
}

    