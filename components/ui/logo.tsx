import { BellRing, Calendar, Clock, Brain } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon"
  type?: "bell" | "calendar" | "clock" | "brain"
}

export function Logo({ size = "md", variant = "full", type = "bell" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  }

  const renderIcon = () => {
    switch (type) {
      case "bell":
        return <BellRing className={sizeClasses[size]} />
      case "calendar":
        return <Calendar className={sizeClasses[size]} />
      case "clock":
        return <Clock className={sizeClasses[size]} />
      case "brain":
        return <Brain className={sizeClasses[size]} />
      default:
        return <BellRing className={sizeClasses[size]} />
    }
  }

  if (variant === "icon") {
    return renderIcon()
  }

  return (
    <div className="flex items-center gap-2.5">
      {renderIcon()}
      <span
        className={`font-bold tracking-tight ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"}`}
      >
        Remindr AI
      </span>
    </div>
  )
}
