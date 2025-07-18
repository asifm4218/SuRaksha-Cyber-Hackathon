
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowRightLeft,
  Bell,
  CreditCard,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  ShieldAlert,
  UserCircle,
  Wallet,
  Timer
} from "lucide-react";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIdle } from "@/hooks/use-idle";
import { handleSessionTimeout, analyzeBehavioralMetrics } from "@/app/actions";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { BehaviorTracker } from "@/services/behavior-tracking-service";
import { sessionManager } from "@/services/session-service";
import { logFirebaseEvent } from "@/services/firebase";
import { Logo } from "@/components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);
  const [isBehaviorAlertDialogOpen, setIsBehaviorAlertDialogOpen] = useState(false);
  const [behaviorAlertReason, setBehaviorAlertReason] = useState("");
  const isMobile = useIsMobile();
  
  // Initialize and run the behavioral analysis
  useEffect(() => {
    if (!email) return;

    let analysisInterval: NodeJS.Timeout;

    const tracker = new BehaviorTracker(email);
    tracker.start();

    // This listener will react to changes in the session status
    const handleSessionStatusChange = (status: 'active' | 'expired', reason?: string) => {
        if (status === 'expired') {
            setBehaviorAlertReason(reason || "Our security system detected interaction patterns that do not match your profile.");
            setIsBehaviorAlertDialogOpen(true);
            logFirebaseEvent("security_alert", { reason: "behavioral_anomaly" });
            tracker.stop();
            if(analysisInterval) clearInterval(analysisInterval);
        }
    };
    
    // Subscribe with the current email
    sessionManager.subscribe(email, handleSessionStatusChange);

    // Periodically send data to the "backend" for analysis
    analysisInterval = setInterval(async () => {
        const metrics = tracker.getMetrics();
        
        if (metrics.keyHoldDurations.length > 5) { // Only analyze after some interaction
            const result = await analyzeBehavioralMetrics(email, metrics);
            if (result.status === 'anomaly') {
                sessionManager.expireSession(email, result.reason);
            }
        }
    }, 3000); // Analyze every 3 seconds

    return () => {
      tracker.stop();
      sessionManager.unsubscribe(email, handleSessionStatusChange);
      if (analysisInterval) clearInterval(analysisInterval);
    };
  }, [email]);


  const navItems = [
    { href: `/dashboard?email=${email}`, icon: LayoutGrid, label: "Dashboard" },
    { href: `/dashboard/accounts?email=${email}`, icon: Wallet, label: "Accounts" },
    { href: `/dashboard/transactions?email=${email}`, icon: ArrowRightLeft, label: "Transactions" },
    { href: `/dashboard/cards?email=${email}`, icon: CreditCard, label: "My Cards" },
  ];
  
  const secondaryNavItems = [
    { href: `/dashboard/profile?email=${email}`, icon: UserCircle, label: "Profile" },
    { href: `/dashboard/settings?email=${email}`, icon: Settings, label: "Settings" },
  ];

  const handleSignOut = () => {
    setIsIdleDialogOpen(false);
    setIsBehaviorAlertDialogOpen(false); // Also close the behavior dialog if open
    router.push('/signin');
  };

  const handleIdle = () => {
    setIsIdleDialogOpen(true);
    handleSessionTimeout(); // Log server-side event if any
  };

  const { reset: resetIdleTimer } = useIdle({ onIdle: handleIdle, idleTime: 60 });

  const handleContinueSession = () => {
    setIsIdleDialogOpen(false);
    resetIdleTimer();
  }
  
  const handleIdleDialogChange = (open: boolean) => {
    // If the dialog is being closed by any means other than the "Continue Session" button,
    // (e.g., 'X' button, Escape key), we force a sign-out.
    if (!open) {
      handleSignOut();
    }
  }


  return (
    <>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href={`/?email=${email}`} className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold">Canara Bank</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href.split('?')[0] && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
               <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mb-4">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href.split('?')[0] && "bg-muted text-primary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
              </nav>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/')}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                    href={`/dashboard?email=${email}`}
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                    <Logo className="h-6 w-6" />
                    <span>Canara Bank</span>
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                            pathname === item.href.split('?')[0] && "bg-muted text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <nav className="grid gap-2 text-lg font-medium">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                            pathname === item.href.split('?')[0] && "bg-muted text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                </nav>
                <Button variant="ghost" className="w-full justify-start mt-4" onClick={() => router.push('/')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 md:hidden">
             <div className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold">Canara Bank</span>
            </div>
          </div>
          <div className="w-full flex-1 hidden md:block">
            {/* Can add search bar here */}
          </div>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/dashboard/settings?email=${email}`)}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
        {isMobile && <MobileNav navItems={navItems} />}
      </div>
    </div>

    {/* Idle Session Timeout Dialog */}
    <Dialog open={isIdleDialogOpen} onOpenChange={handleIdleDialogChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <div className="flex flex-col items-center text-center">
                    <Timer className="h-16 w-16 text-primary mb-4" />
                    <DialogTitle className="text-2xl">Are you still there?</DialogTitle>
                </div>
                <DialogDescription className="text-center py-4">
                    For your security, your session will time out soon due to inactivity.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-4">
                <Button onClick={handleSignOut} variant="outline" className="w-full">
                    Sign Out
                </Button>
                <Button onClick={handleContinueSession} className="w-full">
                    Continue Session
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* Behavioral Anomaly Dialog */}
    <Dialog open={isBehaviorAlertDialogOpen} onOpenChange={(open) => !open && handleSignOut()}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
                 <div className="flex flex-col items-center text-center">
                    <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                    <DialogTitle className="text-2xl">Session Expired Due to Unusual Behavior</DialogTitle>
                </div>
                <DialogDescription className="text-center py-4">
                   {behaviorAlertReason} For your protection, your session has been terminated. Please sign in again.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={handleSignOut} className="w-full">
                    Return to Sign In
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
