import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<React.ElementRef<typeof React.forwardRef>, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
        <div className="overflow-y-auto scrollbar-hide relative">{children}</div>
      </div>
    )
  },
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
