"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>;
}) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-600 gap-1",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Trigger>>;
}) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ring-offset-white transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1222]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-xs active:not-disabled:scale-[0.98] cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Content>>;
}) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-3 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B1222]/30 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
