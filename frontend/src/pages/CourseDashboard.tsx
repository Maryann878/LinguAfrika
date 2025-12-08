import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Loader2,
  Award,
  PlayCircle,
  Hash,
  BookMarked,
  Languages,
  FileText,
  Sparkles
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getCourseByName, getUserProgress } from "@/services/courseService"
import { getLessonsByCourse } from "@/services/lessonService"
import { cn } from "@/lib/utils"

interface Lesson {
  _id: string
  title: string
  description: string
  duration: number
  order: number
  level: string
}

interface Course {
  _id: string
  name: string
  language: string
  level: string
  image: string
  description: string
}

export default function CourseDashboard() {
  const { courseName, levelName } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [, setUserProgress] = useState<any>(null) // Reserved for future use
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!courseName || !levelName) {
        toast({
          title: "Invalid route",
          description: "Course or level not specified",
          variant: "destructive",
        })
        navigate("/languages")
        return
      }

      setLoading(true)
      try {
        // Fetch course by name
        const normalizedCourseName = courseName.replace(/-/g, ' ')
        const courseResponse = await getCourseByName(normalizedCourseName)
        
        if (!courseResponse?.success || !courseResponse.data) {
          throw new Error("Course not found")
        }

        const courseData = courseResponse.data
        setCourse(courseData)

        // Capitalize level name for API
        const capitalizedLevel = levelName.charAt(0).toUpperCase() + levelName.slice(1)

        // Fetch lessons for this course and level
        const lessonsResponse = await getLessonsByCourse(courseData._id, capitalizedLevel)
        const lessonsData = lessonsResponse?.data || []
        
        // Sort lessons by order
        const sortedLessons = lessonsData.sort((a: Lesson, b: Lesson) => a.order - b.order)
        setLessons(sortedLessons)

        // Fetch user progress
        try {
          const progressResponse = await getUserProgress(courseData._id)
          if (progressResponse?.success && progressResponse.data) {
            const progress = progressResponse.data
            
            // Check if progress is for this level
            if (progress.level === capitalizedLevel) {
              setUserProgress(progress)
              // Extract completed lesson IDs
              const completed = progress.completedLessons?.map((id: any) => 
                typeof id === 'string' ? id : id._id || id.toString()
              ) || []
              setCompletedLessonIds(completed)
            }
          }
        } catch (error) {
          // No progress yet, that's okay
        }
      } catch (error: any) {
        toast({
          title: "Error loading course",
          description: error.message || "Failed to load course dashboard",
          variant: "destructive",
        })
        navigate("/languages")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseName, levelName, navigate, toast])

  const isLessonCompleted = (lessonId: string) => {
    return completedLessonIds.includes(lessonId)
  }

  const completedCount = lessons.filter(lesson => isLessonCompleted(lesson._id)).length
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  const getLessonIcon = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('vocabulary') || lowerTitle.includes('vocab')) {
      return <BookMarked className="h-5 w-5" />
    } else if (lowerTitle.includes('number') || lowerTitle.includes('numeral')) {
      return <Hash className="h-5 w-5" />
    } else if (lowerTitle.includes('greeting') || lowerTitle.includes('greet')) {
      return <Languages className="h-5 w-5" />
    } else if (lowerTitle.includes('introduction') || lowerTitle.includes('intro')) {
      return <Sparkles className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  const getLessonTypeColor = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('vocabulary') || lowerTitle.includes('vocab')) {
      return "bg-purple-100 text-purple-700 border-purple-200"
    } else if (lowerTitle.includes('number') || lowerTitle.includes('numeral')) {
      return "bg-blue-100 text-blue-700 border-blue-200"
    } else if (lowerTitle.includes('greeting') || lowerTitle.includes('greet')) {
      return "bg-green-100 text-green-700 border-green-200"
    } else if (lowerTitle.includes('introduction') || lowerTitle.includes('intro')) {
      return "bg-orange-100 text-orange-700 border-orange-200"
    }
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading course dashboard...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  const capitalizedLevel = levelName ? levelName.charAt(0).toUpperCase() + levelName.slice(1) : ""

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/course/${courseName}`)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Levels
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {course.image && (
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="text-sm">
                {capitalizedLevel}
              </Badge>
              <span className="text-gray-400">•</span>
              <span className="text-slate-600 capitalize">{course.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {course.name} - {capitalizedLevel} Level
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              {course.description || `Complete lessons to progress in ${course.name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-3xl font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-4 overflow-hidden">
              <div
                className={cn(
                  "h-4 rounded-full transition-all duration-500",
                  progress === 100 ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-slate-900">{completedCount}</span> of{" "}
                <span className="font-semibold text-slate-900">{lessons.length}</span> lessons completed
              </p>
              {progress === 100 && (
                <Badge className="bg-green-500 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Level Complete!
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Lessons
          </CardTitle>
          <CardDescription>
            Work through each lesson in order to complete the {capitalizedLevel} level
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No lessons available</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Lessons for this level are coming soon!
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(`/course/${courseName}`)}
                className="!rounded-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Levels
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson._id)
                const isNextLesson = index === completedCount && !isCompleted
                // Calculate lesson progress (100% if completed, 0% if not started)
                const lessonProgress = isCompleted ? 100 : 0

                return (
                  <Card
                    key={lesson._id}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer border-2",
                      isCompleted && "bg-gradient-to-br from-green-50 to-green-100/50 border-green-300",
                      isNextLesson && "ring-2 ring-primary border-primary shadow-xl",
                      !isCompleted && !isNextLesson && "bg-white hover:border-primary/50"
                    )}
                  >
                    <Link to={`/lesson/${lesson._id}`} className="block">
                      {/* Lesson Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
                        <img
                          src="/Talkingdrum.png"
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        {/* Overlay Gradient */}
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
                          isCompleted && "from-green-900/60 via-green-900/20",
                          isNextLesson && "from-primary/60 via-primary/20"
                        )} />
                        
                        {/* Status Badges on Image */}
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                          {isNextLesson && (
                            <Badge className="bg-primary text-white border-0 shadow-lg">
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Next
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge className="bg-green-500 text-white border-0 shadow-lg">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>

                        {/* Lesson Number Badge on Image */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge 
                            className={cn(
                              "text-sm font-bold shadow-lg border-0",
                              isCompleted && "bg-green-500 text-white",
                              isNextLesson && "bg-primary text-white",
                              !isCompleted && !isNextLesson && "bg-white/90 text-gray-900"
                            )}
                          >
                            Lesson {index + 1}
                          </Badge>
                        </div>

                        {/* Icon Container on Image */}
                        <div className="absolute bottom-4 left-4 z-10">
                          <div className={cn(
                            "p-3 rounded-xl border-2 shadow-lg backdrop-blur-sm",
                            isCompleted 
                              ? "bg-green-500/90 border-green-400 text-white" 
                              : isNextLesson
                              ? "bg-primary/90 border-primary text-white"
                              : "bg-white/90 border-white/50 " + getLessonTypeColor(lesson.title).split(' ')[0]
                          )}>
                            {isCompleted ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <div className={cn(
                                isNextLesson ? "text-white" : getLessonTypeColor(lesson.title).split(' ')[1]
                              )}>
                                {getLessonIcon(lesson.title)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Title */}
                        <h3 className={cn(
                          "font-semibold text-base sm:text-lg mb-2 line-clamp-2 transition-colors",
                          isCompleted && "text-green-800",
                          isNextLesson && "text-primary",
                          !isCompleted && !isNextLesson && "text-slate-900 group-hover:text-primary"
                        )}>
                          {lesson.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                          {lesson.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={cn(
                              "font-semibold",
                              isCompleted && "text-green-700",
                              isNextLesson && "text-primary",
                              !isCompleted && !isNextLesson && "text-gray-600"
                            )}>
                              Progress
                            </span>
                            <span className={cn(
                              "font-bold",
                              isCompleted && "text-green-700",
                              isNextLesson && "text-primary",
                              !isCompleted && !isNextLesson && "text-gray-600"
                            )}>
                              {lessonProgress}%
                            </span>
                          </div>
                          <div className={cn(
                            "w-full rounded-full h-2.5 overflow-hidden",
                            isCompleted ? "bg-green-200" : "bg-gray-200"
                          )}>
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                isCompleted 
                                  ? "bg-green-500" 
                                  : isNextLesson
                                  ? "bg-primary"
                                  : "bg-primary/50"
                              )}
                              style={{ width: `${lessonProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer with Duration and Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-medium">{formatDuration(lesson.duration)}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1.5 text-xs font-semibold transition-colors",
                            isCompleted && "text-green-600",
                            isNextLesson && "text-primary",
                            !isCompleted && !isNextLesson && "text-slate-500 group-hover:text-primary"
                          )}>
                            {isCompleted ? (
                              <>
                                <Award className="h-4 w-4" />
                                <span>Review</span>
                              </>
                            ) : (
                              <>
                                <ArrowRight className="h-4 w-4" />
                                <span>{isNextLesson ? "Start" : "View"}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
