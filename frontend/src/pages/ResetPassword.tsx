import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { resetPassword } from "@/services/auth"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  // Get token from URL query params or sessionStorage
  const urlToken = searchParams.get("token")
  const sessionToken = sessionStorage.getItem("resetToken")
  const token = urlToken || sessionToken

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid reset session",
        description: "Please start the password reset process again",
        variant: "destructive",
      })
      setTimeout(() => navigate("/reset-email"), 2000)
    }
  }, [token, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast({
        title: "Invalid reset link",
        description: "Please request a new password reset link",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await resetPassword(token, formData.password, formData.confirmPassword)
      if (response?.success) {
        // Clear session data
        sessionStorage.removeItem("resetToken")
        sessionStorage.removeItem("resetEmail")
        toast({
          title: "Password reset successful!",
          description: "Redirecting to login...",
        })
        setTimeout(() => navigate("/login"), 1500)
      }
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Reset Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:p-8 overflow-y-auto safe-area-inset" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-5 sm:space-y-6 lg:space-y-4">
          {/* Mobile Back Button - Top Left */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors font-medium"
              aria-label="Back to login"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>

          {/* Logo Header */}
          <div className="mb-6 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6 lg:mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold mb-2 text-gray-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Enter your new password
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-semibold text-gray-700 block"
              >
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-11 h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400 bg-white"
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-11 pr-11 h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400 bg-white"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1 transition-all duration-200"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <Button
              type="submit"
              className="w-full h-11 !rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !token}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="relative z-10 flex items-center justify-center p-12 h-full">
          {/* Frame with blue border */}
          <div className="relative border-2 border-blue-600 rounded-lg overflow-hidden shadow-xl bg-white max-w-lg w-full">
            <img 
              src="/frame_36909" 
              alt="Password Reset Illustration" 
              className="w-full h-auto object-contain"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-96 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center"><p class="text-gray-500">Illustration</p></div>';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

