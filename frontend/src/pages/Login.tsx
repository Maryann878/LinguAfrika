import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { loginUser } from "@/services/auth"
import { setAuthToken } from "@/utils/security"
import { getErrorMessage, getErrorVariant } from "@/utils/errorHandler"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"
import { LoadingScreen } from "@/components/LoadingScreen"

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await loginUser(formData)
      if (response?.token) {
        // Use secure token storage
        setAuthToken(response.token)
        
        // Show loading screen while redirecting
        setTimeout(() => {
          navigate(response.profileComplete ? "/dashboard" : "/onboarding")
        }, 500) // Reduced delay for faster redirect
      }
    } catch (error: any) {
      setLoading(false)
      toast({
        title: "Login failed",
        description: getErrorMessage(error),
        variant: getErrorVariant(error),
      })
    }
  }

  // Show loading screen during login
  if (loading) {
    return <LoadingScreen message="Welcome back! Logging you in..." />
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto mx-auto max-w-full pt-16 sm:pt-6 lg:pt-8" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-5 lg:space-y-4 py-4 sm:py-0">
          {/* Logo Header */}
          <div className="mb-5 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-5 lg:mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold mb-2 text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Login to your account
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-6 sm:gap-8 justify-center items-center mb-5 lg:mb-4">
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Login with Facebook"
            >
              <span className="text-[#1877F2] font-bold text-lg">f</span>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Login with Twitter"
            >
              <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Login with Google"
            >
              <span className="text-[#4285F4] font-bold text-lg">G</span>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Login with Instagram"
            >
              <svg className="w-5 h-5" fill="url(#instagram-gradient)" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#833AB4" />
                    <stop offset="50%" stopColor="#FD1D1D" />
                    <stop offset="100%" stopColor="#FCB045" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>

          {/* OR Separator */}
          <div className="relative mb-5 lg:mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 font-semibold" style={{ backgroundColor: '#F8F8F8' }}>OR</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label 
                htmlFor="identifier" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="pl-11 pr-4 h-11 text-base sm:text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-11 h-11 text-base sm:text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1 transition-all duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end pt-1">
              <Link
                to="/reset-email"
                className="text-sm text-gray-600 hover:text-primary font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Forgot Password? <span className="text-primary font-semibold">Reset</span>
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-11 !rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600 pt-2">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-primary hover:underline font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image with Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#E37400' }}>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white h-full">
          {/* Image */}
          <div className="mb-10 flex-shrink-0 transform transition-transform duration-300 hover:scale-105">
            <img 
              src="/Group 42.svg" 
              alt="Learning Illustration" 
              className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Text Content */}
          <div className="text-center max-w-lg">
            <h3 className="text-3xl font-bold mb-5 tracking-tight">Welcome to LinguAfrika</h3>
            <p className="text-base text-white/95 leading-relaxed font-medium">
              Discover the beauty of African languages. Learn Yoruba, Hausa, Igbo, and Efik through interactive lessons and connect with a vibrant community of learners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
