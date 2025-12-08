import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { CourseCard } from "@/components/CourseCard"

const availableCourses = [
  {
    name: "Yoruba",
    flag: "🇳🇬",
    description: "Learn the language of the Yoruba people",
    level: "Beginner",
    students: 1250,
    lessons: 45,
  },
  {
    name: "Hausa",
    flag: "🇳🇬",
    description: "Master one of Africa's major languages",
    level: "Beginner",
    students: 980,
    lessons: 42,
  },
  {
    name: "Igbo",
    flag: "🇳🇬",
    description: "Explore the rich Igbo culture",
    level: "Intermediate",
    students: 750,
    lessons: 38,
  },
  {
    name: "Efik",
    flag: "🇳🇬",
    description: "Discover the Efik language",
    level: "Beginner",
    students: 320,
    lessons: 28,
  },
]

export default function CourseReg() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Register for a Course</h1>
        <p className="text-muted-foreground">Choose a language course to begin your learning journey</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCourses.map((course) => (
          <CourseCard key={course.name} {...course} />
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Why Register?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside">
            <li>Access to all course materials</li>
            <li>Track your learning progress</li>
            <li>Join the community discussions</li>
            <li>Get personalized recommendations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

