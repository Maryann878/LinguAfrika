import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

const features = [
  "Interactive language lessons",
  "AI-powered practice sessions",
  "Community support and discussions",
  "Progress tracking and achievements",
  "Multiple African languages",
]

export default function WelcomeOB() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl">Welcome Onboard!</CardTitle>
          <CardDescription className="text-lg">
            You're all set to start your language learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" className="w-full">
              <Link to="/onboarding">Complete Profile Setup</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


