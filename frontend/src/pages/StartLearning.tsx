import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Play, Award } from "lucide-react"
import { CourseCard } from "@/components/CourseCard"

const recommendedCourses = [
  {
    name: "Yoruba",
    flag: "🇳🇬",
    description: "Start with Yoruba basics",
    level: "Beginner",
    students: 1250,
    lessons: 45,
  },
  {
    name: "Hausa",
    flag: "🇳🇬",
    description: "Learn Hausa fundamentals",
    level: "Beginner",
    students: 980,
    lessons: 42,
  },
]

export default function StartLearning() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Start Your Learning Journey</h1>
        <p className="text-muted-foreground text-lg">
          Choose a language to begin your adventure
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {recommendedCourses.map((course) => (
          <CourseCard key={course.name} {...course} />
        ))}
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Why Learn with LinguAfrika?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Interactive Lessons</h3>
              <p className="text-sm text-muted-foreground">
                Engaging content designed for effective learning
              </p>
            </div>
            <div className="text-center p-4">
              <Play className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Practice Anytime</h3>
              <p className="text-sm text-muted-foreground">
                Learn at your own pace, anywhere
              </p>
            </div>
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

