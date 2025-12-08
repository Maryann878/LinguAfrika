import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { updateOnboarding } from "@/services/userService"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"
import { cn } from "@/lib/utils"

const ageRanges = ["13-17", "18-24", "25-34", "35-44", "45+"]

const goals = [
  "Travel and communication",
  "Cultural understanding",
  "Academic purposes",
  "Business and work",
  "Personal interest",
]

const countries = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Ethiopia", "Tanzania", "Uganda",
  "Algeria", "Sudan", "Morocco", "Angola", "Mozambique", "Madagascar", "Cameroon", "Ivory Coast",
  "Niger", "Burkina Faso", "Mali", "Malawi", "Zambia", "Senegal", "Chad", "Somalia",
  "Zimbabwe", "Guinea", "Rwanda", "Benin", "Burundi", "Tunisia", "South Sudan", "Togo",
  "Sierra Leone", "Libya", "Congo", "Liberia", "Central African Republic", "Mauritania",
  "Eritrea", "Namibia", "Gambia", "Botswana", "Gabon", "Lesotho", "Guinea-Bissau", "Equatorial Guinea",
  "Mauritius", "Eswatini", "Djibouti", "Comoros", "Cape Verde", "Sao Tome and Principe",
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Poland",
  "Portugal", "Greece", "Ireland", "Austria", "Czech Republic", "Romania", "Hungary", "Brazil",
  "Mexico", "Argentina", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "India", "China",
  "Japan", "South Korea", "Indonesia", "Philippines", "Thailand", "Vietnam", "Malaysia", "Singapore",
  "United Arab Emirates", "Saudi Arabia", "Israel", "Turkey", "Russia", "Ukraine", "Other"
]

// City mapping by country
const citiesByCountry: Record<string, string[]> = {
  "Nigeria": [
    "Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Maiduguri",
    "Zaria", "Aba", "Jos", "Ilorin", "Oyo", "Enugu", "Abeokuta", "Onitsha", "Warri", "Calabar",
    "Uyo", "Akure", "Osogbo", "Bauchi", "Gombe", "Katsina", "Sokoto", "Yola", "Makurdi", "Minna",
    "Lokoja", "Asaba", "Awka", "Owerri", "Umuahia", "Yenagoa", "Damaturu", "Dutse", "Birnin Kebbi",
    "Jalingo", "Ado-Ekiti", "Ikeja", "Surulere", "Victoria Island", "Ikoyi", "Lekki", "Ajah", "Other"
  ],
  "Ghana": ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Sunyani", "Cape Coast", "Obuasi", "Teshie", "Tema", "Other"],
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Kitale", "Garissa", "Other"],
  "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Polokwane", "Other"],
  "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El-Kheima", "Port Said", "Suez", "Luxor", "Aswan", "Other"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Other"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Glasgow", "Edinburgh", "Belfast", "Other"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City", "Other"],
  "Other": ["Other"]
}

const stepTitles = [
  "Welcome!",
  "Tell us about yourself",
  "Where are you from?",
  "What are your goals?",
]

const stepDescriptions = [
  "Let's set up your profile to personalize your learning experience",
  "Select your gender to help us customize content",
  "Share your location to connect with learners nearby",
  "Choose your learning goals to get personalized recommendations",
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    gender: "",
    ageRange: "",
    country: "",
    location: "",
    goals: [] as string[],
  })
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token") || localStorage.getItem("authToken")
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        variant: "destructive",
      })
      navigate("/login")
    }
  }, [navigate, toast])

  // Update available cities when country changes
  useEffect(() => {
    if (formData.country && citiesByCountry[formData.country]) {
      setAvailableCities(citiesByCountry[formData.country])
      // Reset location if country changes
      if (formData.location && !citiesByCountry[formData.country].includes(formData.location)) {
        setFormData(prev => ({ ...prev, location: "" }))
      }
    } else {
      setAvailableCities([])
      setFormData(prev => ({ ...prev, location: "" }))
    }
  }, [formData.country])

  // Keyboard navigation - only for arrow keys, Enter is handled by form/button
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLButtonElement) {
        return // Don't interfere with form inputs
      }
      
      if (e.key === "ArrowRight") {
        // Validate and move to next step
        if (step === 1 && !formData.gender) return
        if (step === 2 && !formData.ageRange) return
        if (step === 3 && (!formData.country || !formData.location)) return
        if (step === 4 && formData.goals.length === 0) return
        
        if (step < 4) {
          setIsTransitioning(true)
          setTimeout(() => {
            setStep(step + 1)
            setIsTransitioning(false)
          }, 200)
        }
      } else if (e.key === "ArrowLeft") {
        if (step > 1) {
          setIsTransitioning(true)
          setTimeout(() => {
            setStep(step - 1)
            setIsTransitioning(false)
          }, 200)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step, formData])

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  const handleNext = () => {
    if (step === 1 && !formData.gender) {
      toast({
        title: "Selection required",
        description: "Please select your gender to continue",
        variant: "destructive",
      })
      return
    }
    if (step === 2 && !formData.ageRange) {
      toast({
        title: "Selection required",
        description: "Please select your age range to continue",
        variant: "destructive",
      })
      return
    }
    if (step === 3 && (!formData.country || !formData.location)) {
      toast({
        title: "Fields required",
        description: "Please fill in both country and location",
        variant: "destructive",
      })
      return
    }
    if (step === 4 && formData.goals.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one learning goal",
        variant: "destructive",
      })
      return
    }
    if (step < 4) {
      setIsTransitioning(true)
      setTimeout(() => {
        setStep(step + 1)
        setIsTransitioning(false)
      }, 200)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await updateOnboarding({
        gender: formData.gender,
        ageRange: formData.ageRange,
        country: formData.country,
        location: formData.location,
        goals: formData.goals,
      })

      if (response?.success) {
        // Update user in localStorage
        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            user.gender = formData.gender
            user.ageRange = formData.ageRange
            user.country = formData.country
            user.location = formData.location
            user.goals = formData.goals
            user.profileComplete = true
            localStorage.setItem('user', JSON.stringify(user))
          } catch (e) {
            // If parsing fails, use the response data
            if (response.data) {
              localStorage.setItem('user', JSON.stringify(response.data))
            }
          }
        } else if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }

        toast({
          title: "Profile setup complete!",
          description: "Your profile has been saved successfully",
        })

        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      }
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to save your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-8" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-md mx-auto space-y-5 lg:space-y-4">
          {/* Logo Header */}
          <div className="mb-5 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Progress Bar */}
          <div className="mb-5 lg:mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Step {step} of 4
              </span>
              <span className="text-xs font-medium text-gray-600">
                {Math.round((step / 4) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Title and Description */}
          <div 
            className={cn(
              "text-center mb-5 lg:mb-4 space-y-2 transition-all duration-300",
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              {stepTitles[step - 1]}
            </h2>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {stepDescriptions[step - 1]}
            </p>
          </div>

          {/* Step 1: Gender */}
          {step === 1 && (
            <div 
              className={cn(
                "space-y-4 transition-all duration-300",
                isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={cn(
                      "h-16 rounded-xl border-2 transition-all duration-200 font-semibold text-sm active:scale-95",
                      formData.gender === gender
                        ? "bg-primary text-white border-primary shadow-lg scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                    )}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Age Range */}
          {step === 2 && (
            <div 
              className={cn(
                "space-y-4 transition-all duration-300",
                isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              )}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ageRanges.map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setFormData({ ...formData, ageRange: age })}
                    className={cn(
                      "h-14 rounded-xl border-2 transition-all duration-200 font-semibold text-sm active:scale-95",
                      formData.ageRange === age
                        ? "bg-primary text-white border-primary shadow-lg scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                    )}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div 
              className={cn(
                "space-y-4 transition-all duration-300",
                isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              )}
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                    Country
                  </Label>
                  <Select
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, location: "" })}
                    placeholder="Select your country"
                    className="h-11 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                    City/Location
                  </Label>
                  <Select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={formData.country ? "Select your city or location" : "Select country first"}
                    disabled={!formData.country || availableCities.length === 0}
                    className="h-11 text-sm focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                  {!formData.country && (
                    <p className="text-xs text-gray-500 mt-1">Please select a country first</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div 
              className={cn(
                "space-y-4 transition-all duration-300",
                isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              )}
            >
              <div className="space-y-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={cn(
                      "w-full h-14 rounded-xl border-2 transition-all duration-200 text-left px-4 font-medium text-sm flex items-center justify-between active:scale-98",
                      formData.goals.includes(goal)
                        ? "bg-primary text-white border-primary shadow-lg"
                        : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                    )}
                  >
                    <span>{goal}</span>
                    {formData.goals.includes(goal) && (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 animate-in fade-in zoom-in duration-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (step > 1) {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setStep(step - 1)
                    setIsTransitioning(false)
                  }, 200)
                }
              }}
              disabled={step === 1 || loading}
              className="h-11 px-6 !rounded-full active:scale-95"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="h-11 px-8 !rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : step === 4 ? (
                <>
                  Complete
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  stepNum <= step
                    ? "w-8 bg-primary"
                    : "w-2 bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col" style={{ backgroundColor: '#E37400' }}>
        <div className="relative z-10 w-full flex-1 flex items-center justify-center p-6 xl:p-12">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full h-full max-w-2xl max-h-[75vh] flex items-center justify-center">
              <img
                src="/Africa_banner-removebg.png"
                alt="Africa Banner"
                className="w-auto h-auto max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><div class="w-full h-96 bg-white/10 rounded-lg flex items-center justify-center"><p class="text-white text-lg">Illustration</p></div></div>'
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Setup Later Button */}
        <div className="pb-6 xl:pb-8 px-6 xl:px-12 flex justify-center flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="!rounded-full h-11 px-6 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-200"
          >
            Setup Later
          </Button>
        </div>
      </div>
    </div>
  )
}
