"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  id,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  // Generate a unique ID if none is provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  const indicatorId = `indicator-${checkboxId}`;
  const iconId = `icon-${checkboxId}`;

  return (
    <CheckboxPrimitive.Root
      id={checkboxId}
      data-slot="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        id={indicatorId}
        className={cn("flex items-center justify-center text-current")}
      >
        <CheckIcon id={iconId} className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
