import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn(className)}
      {...props}
    >
      <g>
        <path d="M20 80 L50 20 L80 80 L70 80 L50 40 L30 80 Z" fill="hsl(var(--primary))" />
        <path d="M35 80 L50 50 L65 80 L55 80 L50 70 L45 80 Z" fill="hsl(var(--accent))" />
      </g>
    </svg>
  );
}
