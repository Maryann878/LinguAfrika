interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = "Loading...", fullScreen = true }: LoadingScreenProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    : "flex items-center justify-center min-h-[400px]";

  return (
    <div className={containerClass}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/10 animate-gradient-shift" />
      
      {/* Floating Orbs for Visual Interest */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slower" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-6">
        {/* Logo Container with Glow Effect */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-primary/20 blur-2xl animate-pulse-slow" />
          </div>
          
          {/* Middle Glow Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-primary/30 blur-xl animate-pulse-slower" />
          </div>
          
          {/* Logo Image with Smooth Scale Animation */}
          <div className="relative z-10 animate-logo-float">
            <img 
              src="/logo.png" 
              alt="LinguAfrika Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              onError={(e) => {
                // Fallback to logo2 if logo.png fails
                e.currentTarget.src = "/logo2.png";
              }}
            />
          </div>
        </div>
        
        {/* Modern Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute w-16 h-16 border-4 border-primary/10 rounded-full" />
          
          {/* Middle Ring */}
          <div className="absolute w-12 h-12 border-4 border-primary/20 rounded-full animate-spin-slow" />
          
          {/* Inner Spinning Ring */}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin" />
          </div>
        </div>
        
        {/* Loading Message with Typing Effect */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-base sm:text-lg font-semibold text-slate-700 tracking-wide">
            {message}
          </p>
          {/* Animated Dots */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

