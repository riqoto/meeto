"use client"

import { cn } from "@/lib/utils"

interface BreathingDotProps {
  className?: string
  color?: string
}

export function BreathingDot({ className, color = "bg-green-500" }: BreathingDotProps) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("w-2 h-2 rounded-full", color, "animate-pulse")} />
      <div className={cn("absolute inset-0 w-2 h-2 rounded-full opacity-75 animate-ping", color)} />
    </div>
  )
}
