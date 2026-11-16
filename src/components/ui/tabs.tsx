"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex flex-col gap-4",
        orientation === "vertical" && "flex-row",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center text-muted-foreground transition-all",
  {
    variants: {
      variant: {
        // Modern Segmented Capsule Track
        default: "p-1 rounded-xl bg-muted/40 border border-border/60 gap-1",
        pills: "p-1 rounded-xl bg-muted/40 border border-border/60 gap-1.5",
        // Sleek Linear / Vercel Underline
        underline: "w-full justify-start border-b border-border/50 bg-transparent rounded-none p-0 gap-6",
        // Full-width Grid
        grid: "w-full grid p-1 rounded-xl bg-muted/40 border border-border/60 gap-1",
      },
      size: {
        default: "h-11",
        sm: "h-9 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function TabsList({
  className,
  variant = "default",
  size = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // Base Layout & Typography
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer outline-none select-none",
        "text-muted-foreground hover:text-foreground hover:bg-muted/20",

        // Active State - Pill Variant (Works with BOTH data-active AND aria-selected="true")
        "data-active:bg-background data-active:text-foreground data-active:font-semibold data-active:shadow-sm data-active:border data-active:border-border/60",
        "aria-selected:bg-background aria-selected:text-foreground aria-selected:font-semibold aria-selected:shadow-sm aria-selected:border aria-selected:border-border/60",

        // Active State - Underline Variant
        "group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:border-b-2 group-data-[variant=underline]/tabs-list:border-transparent group-data-[variant=underline]/tabs-list:px-2 group-data-[variant=underline]/tabs-list:pb-2.5",
        "group-data-[variant=underline]/tabs-list:data-active:border-primary group-data-[variant=underline]/tabs-list:data-active:bg-transparent group-data-[variant=underline]/tabs-list:data-active:shadow-none group-data-[variant=underline]/tabs-list:data-active:border-t-0 group-data-[variant=underline]/tabs-list:data-active:border-x-0",
        "group-data-[variant=underline]/tabs-list:aria-selected:border-primary group-data-[variant=underline]/tabs-list:aria-selected:bg-transparent group-data-[variant=underline]/tabs-list:aria-selected:shadow-none group-data-[variant=underline]/tabs-list:aria-selected:border-t-0 group-data-[variant=underline]/tabs-list:aria-selected:border-x-0",

        // Focus and disabled
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none focus-visible:ring-0", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
