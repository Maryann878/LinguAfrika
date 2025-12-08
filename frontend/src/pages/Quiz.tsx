import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileQuestion, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"

export default function Quiz() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz</h1>
        <p className="text-gray-600">Test your knowledge and track your progress</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-12 sm:p-16 text-center">
          <FileQuestion className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto mb-6" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            No quizzes available
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Quizzes will appear here once you start learning a language course. Complete lessons to unlock quizzes and test your knowledge!
          </CardDescription>
          <Link to="/languages">
            <Button size="lg" className="!rounded-full px-8">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Languages
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}


