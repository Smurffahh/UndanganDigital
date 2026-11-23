"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export function AlertDialogOverlay({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Overlay>>;
}) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

export function AlertDialogContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Content>>;
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200/90 bg-white p-6 shadow-xl duration-150 rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({
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

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-2", className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Title>>;
}) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn("text-base font-semibold text-slate-900", className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Description>>;
}) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-xs text-slate-500 leading-relaxed", className)}
      {...props}
    />
  );
}

export function AlertDialogAction({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Action>>;
}) {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants({ variant: "destructive", size: "sm" }), className)}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Cancel>>;
}) {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), className)}
      {...props}
    />
  );
}
