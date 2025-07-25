
"use client";

import { BookOpen, ChevronDown, Clock, Globe, Mail, MapPin, Milestone, Moon, Phone, PlayCircle, Search, ShieldCheck, Sun, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default function LandingPage() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push("/signin"); 
    }

    const handleApplyNowClick = () => {
        router.push("/signup");
    }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="w-full">
        {/* Top bar */}
        <div className="bg-muted/50 text-muted-foreground text-xs border-b">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <a href="#" className="flex items-center gap-1.5 hover:text-primary">
                    <Phone className="w-3 h-3" />
                    1800-425-0018
                </a>
                <a href="#" className="flex items-center gap-1.5 hover:text-primary">
                    <Mail className="w-3 h-3" />
                    support@canarabank.co
                </a>
                <a href="#" className="flex items-center gap-1.5 hover:text-primary">
                    <MapPin className="w-3 h-3" />
                    Find Branch/ATM
                </a>
            </div>
            <div className="flex items-center gap-4">
                <a href="#" className="flex items-center gap-1.5 hover:text-primary">
                    <Globe className="w-3 h-3" />
                    English <ChevronDown className="w-3 h-3" />
                </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-background/80 backdrop-blur-sm text-foreground sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center h-20">
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Canara Bank</h1>
                        <p className="text-xs text-muted-foreground">Secure Banking, Simplified</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#" className="text-foreground hover:text-primary">Personal</a>
                    <a href="#" className="text-foreground hover:text-primary">Business</a>
                    <a href="#" className="text-foreground hover:text-primary">Security</a>
                    <a href="#" className="text-foreground hover:text-primary">About Us</a>
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button variant="outline" onClick={handleLoginClick}>
                        <User className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleApplyNowClick}>
                        <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                    </Button>
                </div>
            </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative bg-cover bg-center text-foreground" style={{ backgroundImage: "url('https://placehold.co/1920x1080/E8EAF6/3F51B5.png?text=.')" }} data-ai-hint="modern office security">
           <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />
           <div className="relative container mx-auto px-4 py-32 flex flex-col justify-center items-start">
              <h2 className="text-6xl font-extrabold max-w-2xl leading-tight text-foreground">Smarter, Safer Banking.</h2>
              <p className="text-lg mt-4 max-w-xl text-muted-foreground">
                Canara Bank uses advanced behavioral AI to continuously protect your account, ensuring only you have access.
              </p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base" onClick={handleApplyNowClick}>
                  Open a Secure Account <Milestone className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="font-bold text-base">
                  <PlayCircle className="mr-2 h-5 w-5" /> How It Works
                </Button>
              </div>
            </div>
        </div>
      </main>

      {/* Stats Footer */}
      <footer className="bg-background text-foreground border-t">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <User className="w-8 h-8 text-accent" />
                    <p className="text-3xl font-bold">10M+</p>
                    <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-accent" />
                    <p className="text-3xl font-bold">99.9%</p>
                    <p className="text-sm text-muted-foreground">Fraud Prevention Rate</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 text-accent" />
                    <p className="text-3xl font-bold">24/7</p>
                    <p className="text-sm text-muted-foreground">Continuous Monitoring</p>
                </div>
            </div>
        </div>
      </footer>

    </div>
  );
}
