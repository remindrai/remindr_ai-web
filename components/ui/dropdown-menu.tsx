"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const DropdownMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("relative", className)} {...props} ref={ref} />,
)
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:translate-x-[-100%] data-[side=right]:translate-x-[100%] data-[side=top]:translate-y-[-100%] focus:outline-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof React.forwardRef>,
  React.ComponentPropsWithoutRef<typeof React.forwardRef>
>(({ className, ...props }, ref) => <div className={cn("", className)} {...props} ref={ref} />)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold text-muted-foreground", className)} ref={ref} {...props} />
  ),
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("-mx-1 my-1 h-px bg-border", className)} ref={ref} {...props} />,
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
