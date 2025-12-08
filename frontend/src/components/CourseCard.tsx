import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  name: string
  flag: string
  description: string
  level: string
  students?: number
  lessons?: number
  progress?: number
  className?: string
}

export function CourseCard({ 
  name, 
  flag, 
  description, 
  level, 
  students, 
  lessons, 
  progress,
  className 
}: CourseCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <Link to={`/course/${name.toLowerCase()}`}>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="text-5xl">{flag}</div>
            <Badge variant="secondary">{level}</Badge>
          </div>
          <CardTitle className="text-2xl">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(students || lessons) && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {students && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{students.toLocaleString()}</span>
                </div>
              )}
              {lessons && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{lessons} lessons</span>
                </div>
              )}
            </div>
          )}
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          <Button className="w-full">
            {progress !== undefined ? "Continue Learning" : "Start Learning"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}


