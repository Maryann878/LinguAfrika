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
    sm: "w-14 h-14",
    md: "w-16 h-16",
    lg: "w-18 h-18",
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
              className={`absolute -top-6 left-6 -translate-x-1/2 ${iconSizes[size]} object-contain`}
            />
          </span>
        </span>
      </h1>
    </div>
  )
}

