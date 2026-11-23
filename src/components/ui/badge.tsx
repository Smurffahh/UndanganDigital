import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none font-mono tabular-nums",
  {
    variants: {
      variant: {
        default:
          "border border-slate-200 bg-slate-100 text-slate-800",
        primary:
          "border border-[#6B1222]/20 bg-[#6B1222]/10 text-[#6B1222]",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-800",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-800",
        destructive:
          "border border-rose-200 bg-rose-50 text-rose-800",
        outline:
          "border border-slate-300 text-slate-700 bg-transparent",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[11px] px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ref, ...props }: BadgeProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { badgeVariants };
