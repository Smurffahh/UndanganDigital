import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1222]/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none active:not-disabled:scale-[0.96] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#6B1222] text-white hover:bg-[#520D1A] shadow-xs active:bg-[#430A14]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-xs active:bg-red-800",
        outline:
          "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        link: "text-[#6B1222] underline-offset-4 hover:underline p-0 h-auto active:scale-100",
      },
      size: {
        default: "min-h-11 md:min-h-10 px-4 py-2.5",
        sm: "min-h-9 px-3 py-1.5 text-xs rounded-lg",
        lg: "min-h-12 px-6 py-3 text-base rounded-2xl",
        icon: "h-11 w-11 md:h-10 md:w-10 p-0 rounded-xl",
        "icon-sm": "h-9 w-9 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  isLoading = false,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

export { buttonVariants };
