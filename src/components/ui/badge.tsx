import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }) {
  const variants = {
    default: "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
    destructive: "border-transparent bg-red-100 text-red-800",
    success: "border-transparent bg-green-100 text-green-800",
    warning: "border-transparent bg-yellow-100 text-yellow-800",
    outline: "text-gray-950",
  }

  return (
    <div className={cn("inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold max-w-fit transition-colors", variants[variant], className)} {...props} />
  )
}

export { Badge }
