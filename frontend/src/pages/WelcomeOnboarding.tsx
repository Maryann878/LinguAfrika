import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"
import { cn } from "@/lib/utils"

const steps = [
  {
    title: "Speak Home, Feel Home",
    description: "Discover the beauty of African languages, one word at a time.",
    image: "/LandingP1b.png",
  },
  {
    title: "Learn at Your Pace",
    description: "Fun lessons and quick assessments to help you grow step by step.",
    image: "/LandingP2.png",
  },
  {
    title: "Learn with AI",
    description: "Chat with our AI and sharpen your skills beyond the classroom.",
    image: "/LandingP3.png",
  },
  {
    title: "Ready to Begin?",
    description: "Connect with learners across Africa and grow together.",
    image: "/LandingP4.png",
  },
]

export default function WelcomeOnboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (currentStep < steps.length - 1) {
          setIsTransitioning(true)
          setImageLoaded(false)
          setTimeout(() => {
            setCurrentStep(currentStep + 1)
            setIsTransitioning(false)
          }, 200)
        } else {
          navigate("/login")
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 0) {
          setIsTransitioning(true)
          setImageLoaded(false)
          setTimeout(() => {
            setCurrentStep(currentStep - 1)
            setIsTransitioning(false)
          }, 200)
        }
      } else if (e.key === "Escape") {
        navigate("/login")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, navigate])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true)
      setImageLoaded(false)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsTransitioning(false)
      }, 200)
    } else {
      navigate("/login")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
      setImageLoaded(false)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleSkip = () => {
    navigate("/login")
  }

  const isLastStep = currentStep === steps.length - 1
  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-8" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full max-w-md mx-auto space-y-5 lg:space-y-4">
          {/* Logo Header */}
          <div className="mb-5 lg:mb-4 text-center">
            <LinguAfrikaBrand size="md" />
          </div>

          {/* Step Content */}
          <div 
            className={cn(
              "text-center mb-5 lg:mb-4 space-y-3 transition-all duration-300",
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              {currentStepData.title}
            </h2>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 ease-out",
                  index === currentStep
                    ? "w-8 bg-primary shadow-md"
                    : index < currentStep
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-gray-300"
                )}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="!rounded-full h-11 px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="!rounded-full h-11 px-6 text-gray-600 hover:text-gray-900"
              >
                Skip
              </Button>
            )}

            <Button
              onClick={handleNext}
              className="!rounded-full h-11 px-8 bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {isLastStep ? (
                <>
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>

          {/* Login Link (only on last step) */}
          {isLastStep && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#E37400' }}>
        <div className="relative z-10 w-full h-full flex items-center justify-center p-6 xl:p-12">
          <div className="relative w-full h-full flex items-center justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <div className="w-full h-full max-w-2xl max-h-[85vh] flex items-center justify-center">
              <img
                src={currentStepData.image}
                alt={currentStepData.title}
                className={cn(
                  "w-auto h-auto max-w-full max-h-full object-contain transition-all duration-500",
                  imageLoaded 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-95"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  setImageLoaded(true)
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><div class="w-full h-96 bg-white/10 rounded-lg flex items-center justify-center"><p class="text-white text-lg">Illustration</p></div></div>'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
