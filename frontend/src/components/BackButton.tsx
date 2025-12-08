import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  to?: string
  onClick?: () => void
  label?: string
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export function BackButton({ 
  to, 
  onClick, 
  label = "Back", 
  className,
  variant = "ghost"
}: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (to) {
      navigate(to)
    } else {
      navigate(-1) // Go back in browser history
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 min-h-[44px]",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}


