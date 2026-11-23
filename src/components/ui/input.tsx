import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({
  className,
  type = "text",
  error = false,
  ref,
  ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <input
      type={type}
      ref={ref}
      aria-invalid={error ? "true" : "false"}
      className={cn(
        "flex w-full rounded-xl border bg-white px-3.5 py-2.5 text-base md:text-sm text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow] duration-150 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 min-h-11 md:min-h-10",
        error
          ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
          : "border-slate-300 hover:border-slate-400 focus:border-[#6B1222] focus:ring-2 focus:ring-[#6B1222]/15",
        className
      )}
      {...props}
    />
  );
}
