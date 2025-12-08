import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const languages = [
  { name: "Yoruba", flag: "🇳🇬", description: "Learn the language of the Yoruba people", level: "Beginner" },
  { name: "Hausa", flag: "🇳🇬", description: "Master one of Africa's major languages", level: "Beginner" },
  { name: "Igbo", flag: "🇳🇬", description: "Explore the rich Igbo culture", level: "Intermediate" },
  { name: "Efik", flag: "🇳🇬", description: "Discover the Efik language", level: "Beginner" },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Learn <span className="text-primary">African Languages</span> with Ease
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Master Yoruba, Hausa, Igbo, and more through interactive lessons, AI-powered practice, and a vibrant community.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/languages">Start Learning</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/community">Join Community</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose LinguAfrika?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Interactive Lessons</CardTitle>
              <CardDescription>
                Learn through engaging, interactive lessons designed for all skill levels
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Community Support</CardTitle>
              <CardDescription>
                Connect with fellow learners and native speakers in our vibrant community
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Award className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed progress tracking and achievements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Languages Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Available Languages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {languages.map((language) => (
            <Card key={language.name} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={`/course/${language.name.toLowerCase()}`}>
                <CardHeader>
                  <div className="text-4xl mb-2">{language.flag}</div>
                  <CardTitle>{language.name}</CardTitle>
                  <CardDescription>{language.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{language.level}</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Start Learning?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Join thousands of learners mastering African languages today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" variant="secondary">
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


