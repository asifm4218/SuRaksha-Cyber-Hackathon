
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  Building
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
import { handleSessionTimeout } from "@/app/actions";
import { useIsMobile } from "@/hooks/use-mobile";


function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Building className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold tracking-tight">Canara Bank</span>
    </div>
  );
}


const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/accounts", icon: Wallet, label: "Accounts" },
  { href: "/dashboard/transactions", icon: ArrowRightLeft, label: "Transactions" },
  { href: "/dashboard/cards", icon: CreditCard, label: "My Cards" },
];

const secondaryNavItems = [
  { href: "/dashboard/profile", icon: UserCircle, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleIdle = () => {
    handleSessionTimeout();
    setIsIdleDialogOpen(true);
  };

  useIdle({ onIdle: handleIdle, idleTime: 60 });

  const handleLogout = () => {
    setIsIdleDialogOpen(false);
    router.push('/');
  }

  return (
    <>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/">
              <Logo />
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
                    pathname === item.href && "bg-muted text-primary"
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
                        pathname === item.href && "bg-muted text-primary"
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
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                    <Logo />
                </Link>
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                            pathname === item.href && "bg-muted text-foreground"
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
                            pathname === item.href && "bg-muted text-foreground"
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
            <Logo />
          </div>
          <div className="w-full flex-1 hidden md:block">
            {/* Can add search bar here */}
          </div>
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
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-[#0f2851] pb-24 md:pb-6">
          {children}
        </main>
        {isMobile && <MobileNav navItems={navItems} />}
      </div>
    </div>

    <Dialog open={isIdleDialogOpen} onOpenChange={setIsIdleDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <div className="flex flex-col items-center text-center">
                    <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                    <DialogTitle className="text-2xl">Session Timeout</DialogTitle>
                </div>
                <DialogDescription className="text-center py-4">
                    For your security, your session has been ended due to inactivity. Our AI model detected a period of no interaction, which could indicate a security risk.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={handleLogout} className="w-full">
                    Return to Home
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
