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
            <path
                d="M 54,20 L 92,85 L 16,85 Z"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                strokeLinejoin="round"
            />
            <path
                d="M 84,60 L 46,60 L 27,95 L 65,95 Z"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="12"
                strokeLinejoin="round"
            />
        </g>
    </svg>
  );
}
