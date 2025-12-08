import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, Award } from "lucide-react"
import { Link } from "react-router-dom"

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-4xl">Welcome to LinguAfrika!</CardTitle>
          <CardDescription className="text-lg">
            Your journey to mastering African languages starts here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Interactive Lessons</h3>
              <p className="text-sm text-muted-foreground">Learn at your own pace</p>
            </div>
            <div className="text-center p-4">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Community Support</h3>
              <p className="text-sm text-muted-foreground">Connect with learners</p>
            </div>
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Monitor your growth</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/onboarding">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


