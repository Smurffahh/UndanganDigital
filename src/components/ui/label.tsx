import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  ref,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { ref?: React.Ref<HTMLLabelElement> }) {
  return (
    <label
      ref={ref}
      className={cn(
        "text-xs font-semibold text-slate-700 tracking-wide select-none block mb-1.5",
        className
      )}
      {...props}
    />
  );
}
