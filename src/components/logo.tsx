import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }: { className?: string, iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ShieldCheck className="h-7 w-7 text-primary" />
      {!iconOnly && <span className="text-xl font-bold tracking-tighter text-foreground">Canara Bank</span>}
    </div>
  );
}
