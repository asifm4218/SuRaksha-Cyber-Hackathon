
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn(className)}
      {...props}
    >
      <rect width="100" height="100" fill="#29B6F6" />
      <g strokeWidth="8" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M 50,15 L 85,75 L 15,75 Z"
          fill="none"
          stroke="white"
        />
        <path
          d="M 50,85 L 15,25 L 85,25 Z"
          fill="none"
          stroke="#FFCA28"
        />
      </g>
    </svg>
  );
}
