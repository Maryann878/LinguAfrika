import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Heart, Globe } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To make African languages accessible to everyone through innovative learning methods.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "We believe in cultural preservation, accessibility, and community-driven learning.",
  },
  {
    icon: Globe,
    title: "Our Vision",
    description: "A world where African languages are celebrated and easily learned by all.",
  },
  {
    icon: Users,
    title: "Our Community",
    description: "Join thousands of learners connecting through language and culture.",
  },
]

export default function AboutUs() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">About LinguAfrika</h1>
        <p className="text-lg text-muted-foreground">
          We're on a mission to preserve and promote African languages through modern technology
          and innovative learning methods.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {values.map((value, index) => (
          <Card key={index}>
            <CardHeader>
              <value.icon className="h-10 w-10 text-primary mb-4" />
              <CardTitle>{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            LinguAfrika was born from a passion for African languages and a desire to make them
            accessible to everyone. We recognized that many African languages were at risk of being
            lost and that traditional learning methods weren't engaging enough for modern learners.
          </p>
          <p>
            Today, we're proud to offer interactive lessons, AI-powered practice, and a vibrant
            community that supports learners at every step of their journey. Our platform supports
            multiple African languages including Yoruba, Hausa, Igbo, and Efik, with more
            languages being added regularly.
          </p>
          <p>
            Sponsored by Tecvinson, we continue to innovate and expand our offerings to serve
            learners worldwide.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

