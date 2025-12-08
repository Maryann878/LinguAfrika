import iconV from "/IconV.png"

interface LinguAfrikaBrandProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LinguAfrikaBrand({ size = "md", className = "" }: LinguAfrikaBrandProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  }

  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const iconPositions = {
    sm: "absolute -top-3 left-4 -translate-x-1/2",
    md: "absolute -top-5 left-5 -translate-x-1/2",
    lg: "absolute -top-6 left-6 -translate-x-1/2",
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <h1 className={`${sizeClasses[size]} font-bold`}>
        <span className="text-blue-600">Lingu</span>
        <span className="relative inline-block text-primary">
          Afrik
          <span className="relative inline-block">
            a
            <img 
              src={iconV} 
              alt="Icon" 
              className={`${iconPositions[size]} ${iconSizes[size]} object-contain`}
            />
          </span>
        </span>
      </h1>
    </div>
  )
}

