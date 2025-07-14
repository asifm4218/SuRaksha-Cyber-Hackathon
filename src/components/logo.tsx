import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image 
        src="https://firebasestudio.ai/api/files/verisafe/uploads/images/canara-bank-logo-300x72.png" 
        alt="Canara Bank Logo"
        width={150}
        height={36}
        priority
      />
    </div>
  );
}
