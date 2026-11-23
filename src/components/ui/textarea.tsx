import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({
  className,
  error = false,
  ref,
  ...props
}: TextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return (
    <textarea
      ref={ref}
      aria-invalid={error ? "true" : "false"}
      className={cn(
        "flex min-h-[90px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-base md:text-sm text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow] duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
          : "border-slate-300 hover:border-slate-400 focus:border-[#6B1222] focus:ring-2 focus:ring-[#6B1222]/15",
        className
      )}
      {...props}
    />
  );
}
