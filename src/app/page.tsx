
"use client";

import { Banknote, BookOpen, Building, ChevronDown, Clock, Globe, LandPlot, Mail, MapPin, Milestone, Moon, Phone, PlayCircle, Search, ShieldCheck, Sun, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push("/dashboard"); 
    }

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <header className="w-full">
        {/* Top bar */}
        <div className="bg-[#0f2851] text-white text-xs">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <a href="#" className="flex items-center gap-1.5 hover:text-yellow-400">
                    <Phone className="w-3 h-3" />
                    1800-425-0018
                </a>
                <a href="#" className="flex items-center gap-1.5 hover:text-yellow-400">
                    <Mail className="w-3 h-3" />
                    customercare@canarabank.com
                </a>
                <a href="#" className="flex items-center gap-1.5 hover:text-yellow-400">
                    <MapPin className="w-3 h-3" />
                    Find Branch/ATM
                </a>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-gray-400">Available in:</span>
                <Button variant="outline" size="sm" className="bg-transparent border-yellow-400 text-yellow-400 h-6 px-2 text-xs">Hindi</Button>
                <a href="#" className="flex items-center gap-1.5 hover:text-yellow-400">
                    <Globe className="w-3 h-3" />
                    English <ChevronDown className="w-3 h-3" />
                </a>
                <Sun className="w-4 h-4 cursor-pointer hover:text-yellow-400" />
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-6 px-2">Close</Button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-[#003366] text-white sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center h-20">
                <div className="flex items-center gap-3">
                    <Building className="w-10 h-10" />
                    <div>
                        <h1 className="text-2xl font-bold">Canara Bank</h1>
                        <p className="text-xs text-gray-300">Together We Can</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-white/10 p-2 rounded-full cursor-pointer">
                        <Search className="w-5 h-5" />
                    </div>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <a href="#" className="flex items-center gap-1 hover:text-yellow-400">Personal Banking <ChevronDown className="w-4 h-4" /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-yellow-400">Corporate Banking <ChevronDown className="w-4 h-4" /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-yellow-400">Digital Banking <ChevronDown className="w-4 h-4" /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-yellow-400">Investments <ChevronDown className="w-4 h-4" /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-yellow-400">NRI Services <ChevronDown className="w-4 h-4" /></a>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/10" onClick={handleLoginClick}>
                        <User className="mr-2 h-4 w-4" /> Login
                    </Button>
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500">
                        <UserPlus className="mr-2 h-4 w-4" /> Apply Now
                    </Button>
                </div>
            </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('https://placehold.co/1920x1080/0f2851/334d6e.png?text=.')", backgroundBlendMode: 'overlay', backgroundColor: 'rgba(15, 40, 81, 0.8)' }} data-ai-hint="desk money">
           <div className="container mx-auto px-4 py-32 flex flex-col justify-center items-start">
              <h2 className="text-6xl font-extrabold max-w-2xl leading-tight">Digital Banking Made Simple</h2>
              <p className="text-lg mt-4 max-w-xl text-gray-300">Experience seamless banking with our advanced digital solutions</p>
              <p className="mt-2 max-w-xl text-gray-300">
                Access your accounts, transfer money, pay bills, and manage investments - all from your smartphone or computer.
              </p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-200 font-bold text-base">
                  Explore Digital Banking <Milestone className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white font-bold text-base">
                  <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
                </Button>
              </div>
            </div>
        </div>
      </main>

      {/* Stats Footer */}
      <footer className="bg-[#003366] text-white">
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <User className="w-8 h-8 text-yellow-400" />
                    <p className="text-3xl font-bold">10M+</p>
                    <p className="text-sm text-gray-300">Happy Customers</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-yellow-400" />
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-sm text-gray-300">Secure Banking</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 text-yellow-400" />
                    <p className="text-3xl font-bold">85+</p>
                    <p className="text-sm text-gray-300">Years of Trust</p>
                </div>
            </div>
        </div>
      </footer>

    </div>
  );
}
