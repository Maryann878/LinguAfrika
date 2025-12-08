import { Loader2 } from "lucide-react"
import LinguAfrikaBrand from "./LinguAfrikaBrand"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = "Loading...", fullScreen = true }: LoadingScreenProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F8F8F8] to-[#E8E8E8]"
    : "flex items-center justify-center min-h-[400px]";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Logo */}
        <div className="animate-pulse">
          <LinguAfrikaBrand size="lg" />
        </div>
        
        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
          </div>
          <Loader2 className="h-8 w-8 text-primary animate-spin relative z-10" />
        </div>
        
        {/* Loading Message */}
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}

