"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export function SheetOverlay({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof SheetPrimitive.Overlay>>;
}) {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white p-6 shadow-xl transition ease-out duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-slate-200 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t border-slate-200 rounded-t-2xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-slate-200 sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l border-slate-200 sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

export function SheetContent({
  side = "right",
  className,
  children,
  ref,
  ...props
}: SheetContentProps & {
  ref?: React.Ref<React.ComponentRef<typeof SheetPrimitive.Content>>;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B1222]/30 cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Tutup</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-left", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof SheetPrimitive.Title>>;
}) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-base font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof SheetPrimitive.Description>>;
}) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("text-xs text-slate-500 leading-relaxed", className)}
      {...props}
    />
  );
}
