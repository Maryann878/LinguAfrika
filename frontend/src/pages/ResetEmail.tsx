import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Loader2 } from "lucide-react"
import { forgotPassword } from "@/services/auth"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"

export default function ResetEmail() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await forgotPassword(email)
      if (response?.success) {
        // Store email in sessionStorage for the next step
        sessionStorage.setItem('resetEmail', email)
        toast({
          title: "OTP sent!",
          description: "Please check your email for the verification code",
        })
        setTimeout(() => {
          navigate("/reset-otp")
        }, 1500)
      }
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message || "Please check if the email is correct and try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Reset Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:p-8 safe-area-inset" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-5 sm:space-y-6 lg:space-y-4">
          {/* Logo Header */}
          <div className="mb-6 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6 lg:mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold mb-2 text-gray-900 tracking-tight">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Enter your email address to reset your password
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 pr-4 h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400 bg-white"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Next Button */}
            <Button
              type="submit"
              className="w-full h-11 !rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
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

