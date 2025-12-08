import { useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { signupUser } from "@/services/auth"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"
import { cn } from "@/lib/utils"
import { countryCodes, defaultCountryCode, CountryCode } from "@/lib/data/countryCodes"
import { Select } from "@/components/ui/select"

interface PasswordRequirements {
  minLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export default function SignUp() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountryCode)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  })

  // Real-time password validation
  const passwordRequirements: PasswordRequirements = useMemo(() => {
    const password = formData.password
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }
  }, [formData.password])

  const passwordStrength = useMemo(() => {
    const requirements = Object.values(passwordRequirements)
    const metCount = requirements.filter(Boolean).length

    if (metCount === 0) return { level: 'none', label: '', percentage: 0 }
    if (metCount <= 2) return { level: 'weak', label: 'Weak', percentage: 40, color: 'bg-red-500' }
    if (metCount <= 3) return { level: 'medium', label: 'Medium', percentage: 60, color: 'bg-yellow-500' }
    if (metCount <= 4) return { level: 'good', label: 'Good', percentage: 80, color: 'bg-blue-500' }
    return { level: 'strong', label: 'Strong', percentage: 100, color: 'bg-green-500' }
  }, [passwordRequirements])

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordRequirements).every(Boolean)
  }, [passwordRequirements])

  const passwordsMatch = useMemo(() => {
    return formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  }, [formData.password, formData.confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      toast({
        title: "Weak password",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Combine country code with mobile number
      const fullMobileNumber = `${selectedCountry.dialCode}${formData.mobile.replace(/^\+?\d+/, '')}`
      
      const response = await signupUser({
        username: formData.username,
        email: formData.email,
        mobile: fullMobileNumber,
        password: formData.password,
        profileComplete: false,
      })

      if (response?.success) {
        // Store email for verification page
        sessionStorage.setItem('verificationEmail', formData.email)
        toast({
          title: "Account created!",
          description: "Please verify your email to continue",
        })

        setTimeout(() => {
          navigate("/verify")
        }, 1500)
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-5 lg:space-y-4 py-4 sm:py-0">
          {/* Logo Header */}
          <div className="mb-5 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-5 lg:mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold mb-2 text-gray-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Sign up to start learning
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-6 sm:gap-8 justify-center items-center mb-5 lg:mb-4">
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Sign up with Facebook"
            >
              <span className="text-[#1877F2] font-bold text-lg">f</span>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Sign up with Twitter"
            >
              <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Sign up with Google"
            >
              <span className="text-[#4285F4] font-bold text-lg">G</span>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Sign up with Instagram"
            >
              <svg className="w-5 h-5" fill="url(#instagram-gradient-signup)" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="instagram-gradient-signup" x1="0%" y1="0%" x2="100%" y2="100%">
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-11 pr-4 h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 pr-4 h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Mobile Field */}
            <div className="space-y-2">
              <label 
                htmlFor="mobile" 
                className="text-sm font-semibold text-gray-700 block"
              >
                Mobile Number
              </label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <Select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = countryCodes.find(c => c.code === e.target.value)
                    if (country) {
                      setSelectedCountry(country)
                    }
                  }}
                  className="w-[160px] h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.dialCode}
                    </option>
                  ))}
                </Select>

                {/* Phone Number Input */}
                <div className="relative group flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="123 456 7890"
                    value={formData.mobile}
                    onChange={(e) => {
                      // Only allow numbers
                      let value = e.target.value.replace(/\D/g, '')
                      
                      // Format as user types (e.g., 123 456 7890)
                      if (value.length > 3 && value.length <= 6) {
                        value = value.slice(0, 3) + ' ' + value.slice(3)
                      } else if (value.length > 6) {
                        value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10)
                      }
                      
                      setFormData({ ...formData, mobile: value })
                    }}
                    className="pl-11 pr-4 h-11 text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400"
                    autoComplete="tel"
                    required
                    disabled={loading}
                    maxLength={14} // 3 + space + 3 + space + 4 = 14 chars
                  />
                </div>
              </div>
              {/* Display full number preview */}
              {formData.mobile && (
                <p className="text-xs text-gray-500">
                  {selectedCountry.dialCode} {formData.mobile}
                </p>
              )}
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
                  className={cn(
                    "pl-11 pr-11 h-11 text-sm border-gray-300 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400",
                    formData.password && !isPasswordValid && "border-red-300 focus:border-red-500",
                    formData.password && isPasswordValid && "border-green-300 focus:border-green-500"
                  )}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2 pt-1">
                  {/* Strength Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300 rounded-full",
                          passwordStrength.color,
                          passwordStrength.percentage === 0 && "bg-gray-300"
                        )}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                    {passwordStrength.label && (
                      <span className={cn(
                        "text-xs font-semibold",
                        passwordStrength.level === 'weak' && "text-red-600",
                        passwordStrength.level === 'medium' && "text-yellow-600",
                        passwordStrength.level === 'good' && "text-blue-600",
                        passwordStrength.level === 'strong' && "text-green-600"
                      )}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>

                  {/* Requirements Checklist */}
                  <div className="space-y-1.5 text-xs">
                    <div className={cn(
                      "flex items-center gap-2",
                      passwordRequirements.minLength ? "text-green-600" : "text-gray-500"
                    )}>
                      {passwordRequirements.minLength ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      passwordRequirements.hasUpperCase ? "text-green-600" : "text-gray-500"
                    )}>
                      {passwordRequirements.hasUpperCase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span>One uppercase letter</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      passwordRequirements.hasLowerCase ? "text-green-600" : "text-gray-500"
                    )}>
                      {passwordRequirements.hasLowerCase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span>One lowercase letter</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      passwordRequirements.hasNumber ? "text-green-600" : "text-gray-500"
                    )}>
                      {passwordRequirements.hasNumber ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span>One number</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2",
                      passwordRequirements.hasSpecialChar ? "text-green-600" : "text-gray-500"
                    )}>
                      {passwordRequirements.hasSpecialChar ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              )}
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
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={cn(
                    "pl-11 pr-11 h-11 text-sm border-gray-300 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-gray-400",
                    formData.confirmPassword && !passwordsMatch && "border-red-300 focus:border-red-500",
                    formData.confirmPassword && passwordsMatch && "border-green-300 focus:border-green-500"
                  )}
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
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 text-xs pt-1">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-green-600 font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                      <span className="text-red-600 font-medium">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-11 !rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading || !isPasswordValid || !passwordsMatch}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image with Circular Cutout */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#E37400' }}>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white h-full">
          <div className="flex flex-col items-center -mt-24">
          {/* Circular Image Frame */}
          <div className="flex-shrink-0 relative mb-6 transform transition-transform duration-300 hover:scale-105">
            <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
              <img 
                src="/Profile_img.png" 
                alt="Profile Illustration" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="text-center max-w-lg">
            <h3 className="text-3xl font-bold mb-5 tracking-tight">Start Your Language Journey</h3>
            <p className="text-base text-white/95 leading-relaxed font-medium">
              Join thousands of learners mastering African languages. Experience interactive lessons, AI-powered practice, and a supportive community that helps you grow.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
