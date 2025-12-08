import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

const lessonContent = {
  1: {
    title: "Introduction to Yoruba",
    description: "Learn the basics of the Yoruba language",
    content: "Yoruba is a language spoken in West Africa, primarily in Nigeria and neighboring countries. It's one of the most widely spoken African languages.",
    exercises: [
      { type: "vocabulary", question: "What is 'hello' in Yoruba?", answer: "Bawo" },
      { type: "translation", question: "Translate: Good morning", answer: "E kaaro" },
    ],
  },
}

export default function Lesson() {
  const { topicId } = useParams()
  // Convert topicId string to number, or default to 1
  const lessonKey = topicId ? (parseInt(topicId, 10) as keyof typeof lessonContent) : 1
  const lesson = lessonContent[lessonKey] || lessonContent[1]

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/course-dashboard/yoruba/beginner">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        <Badge>Lesson {topicId}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{lesson.title}</CardTitle>
          <CardDescription>{lesson.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{lesson.content}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Exercises</h3>
            {lesson.exercises.map((exercise, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Exercise {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{exercise.question}</p>
                  <div className="p-4 bg-muted rounded-lg">
                    <strong>Answer:</strong> {exercise.answer}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </Button>
            <Button>
              Mark as Complete
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
            <Button>
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

