import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, CheckCircle, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const courseData: Record<string, any> = {
  yoruba: {
    name: "Yoruba",
    description: "Learn the beautiful Yoruba language, spoken by over 20 million people across Africa and beyond.",
    level: "Beginner",
    duration: "8 weeks",
    students: 1250,
    lessons: 45,
    topics: [
      "Basic Greetings",
      "Numbers and Counting",
      "Family and Relationships",
      "Food and Dining",
      "Travel and Directions",
      "Shopping and Markets",
    ],
  },
  hausa: {
    name: "Hausa",
    description: "Master Hausa, one of Africa's most widely spoken languages.",
    level: "Beginner",
    duration: "8 weeks",
    students: 980,
    lessons: 42,
    topics: [
      "Introduction to Hausa",
      "Common Phrases",
      "Grammar Basics",
      "Conversational Skills",
      "Cultural Context",
    ],
  },
}

export default function CourseOverview() {
  const { courseName } = useParams()
  const course = courseData[courseName || ""] || courseData.yoruba

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">{course.name} Course</h1>
          <p className="text-muted-foreground text-lg">{course.description}</p>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-2">
          {course.level}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.duration}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.lessons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.students.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>What you'll learn in this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {course.topics.map((topic: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to={`/course/${courseName}/beginner`}>
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          Preview Course
        </Button>
      </div>
    </div>
  )
}


