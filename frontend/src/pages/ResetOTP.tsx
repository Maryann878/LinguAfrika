import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { verifyPasswordResetOTP, resendPasswordResetOTP } from "@/services/auth"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"

export default function ResetOTP() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Get email from sessionStorage
    const resetEmail = sessionStorage.getItem('resetEmail')
    if (!resetEmail) {
      toast({
        title: "Session expired",
        description: "Please start the password reset process again",
        variant: "destructive",
      })
      setTimeout(() => navigate("/reset-email"), 2000)
    } else {
      setEmail(resetEmail)
    }
  }, [navigate, toast])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('')
      setCode(newCode)
      // Focus the last input
      const lastInput = document.getElementById(`code-5`)
      lastInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join("")
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Incomplete code",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      })
      return
    }

    if (!email) {
      toast({
        title: "Session expired",
        description: "Please start the password reset process again",
        variant: "destructive",
      })
      navigate("/reset-email")
      return
    }

    setLoading(true)

    try {
      const response = await verifyPasswordResetOTP(email, verificationCode)
      if (response?.success && response?.token) {
        // Store token for password reset
        sessionStorage.setItem('resetToken', response.token)
        toast({
          title: "Code verified!",
          description: "Redirecting to set new password...",
        })
        setTimeout(() => {
          navigate("/reset-password")
        }, 1500)
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again",
        variant: "destructive",
      })
      // Clear code on error
      setCode(["", "", "", "", "", ""])
      document.getElementById('code-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Session expired",
        description: "Please start the password reset process again",
        variant: "destructive",
      })
      navigate("/reset-email")
      return
    }

    setResending(true)
    try {
      const response = await resendPasswordResetOTP(email)
      if (response?.success) {
        toast({
          title: "Code resent!",
          description: "Please check your email for the new code",
        })
        // Clear current code
        setCode(["", "", "", "", "", ""])
        document.getElementById('code-0')?.focus()
      }
    } catch (error: any) {
      toast({
        title: "Resend failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - OTP Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:p-8 overflow-y-auto safe-area-inset" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-5 sm:space-y-6 lg:space-y-4">
          {/* Mobile Back Button - Top Left */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => navigate("/reset-email")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors font-medium"
              aria-label="Back to email"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Email
            </button>
          </div>

          {/* Logo Header */}
          <div className="mb-6 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6 lg:mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold mb-2 text-gray-900 tracking-tight">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              We've sent a 6-digit code to <span className="font-semibold">{email || 'your email'}</span>
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Input Fields */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white"
                    required
                    disabled={loading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full h-11 !rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || code.some(d => !d)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center text-sm text-gray-600 pt-2">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-primary hover:underline font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend"}
              </button>
            </div>

            {/* Back Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/reset-email")}
                className="text-sm text-gray-600 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to email
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
              alt="OTP Verification Illustration" 
              className="w-full h-auto object-contain"
              onError={(e) => {
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

