import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Lock, 
  // CheckCircle, // Reserved for future use 
  ArrowRight, 
  BookOpen,
  Clock,
  FileText,
  Users,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getCourseByName, getUserProgress } from "@/services/courseService"
import { getLevelsByCourse, getLessonsByCourse } from "@/services/lessonService"
import { cn } from "@/lib/utils"

interface Course {
  _id: string
  name: string
  language: string
  level: string
  image: string
  description: string
  totalLessons: number
  totalAssessments: number
  estimatedHours: number
  students: number
  flag?: string
}

interface LevelInfo {
  name: string
  description: string
  unlocked: boolean
  progress: number
  lessonCount: number
  completedLessons: number
}

const levelDescriptions: Record<string, string> = {
  Beginner: "Start learning the fundamentals of Yoruba, including basic greetings and expressions.",
  Intermediate: "Dive deeper into Yoruba, mastering sentence structures and conversational fluency.",
  Advanced: "Achieve advanced proficiency in Yoruba, mastering complex grammar and real-world conversations.",
}

const levelColors: Record<string, { circle: string; border: string; button: string }> = {
  Beginner: {
    circle: "bg-green-500",
    border: "border-green-500",
    button: "bg-green-500 hover:bg-green-600",
  },
  Intermediate: {
    circle: "bg-yellow-500",
    border: "border-transparent",
    button: "bg-primary hover:bg-primary/90",
  },
  Advanced: {
    circle: "bg-red-500",
    border: "border-transparent",
    button: "bg-primary hover:bg-primary/90",
  },
}

const allLevels = ["Beginner", "Intermediate", "Advanced"]

export default function Levels() {
  const { courseName } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [levels, setLevels] = useState<LevelInfo[]>([])
  const [, setUserProgress] = useState<any>(null) // Reserved for future use

  useEffect(() => {
    const fetchData = async () => {
      if (!courseName) {
        toast({
          title: "Course not found",
          description: "Please select a course from the languages page",
          variant: "destructive",
        })
        navigate("/languages")
        return
      }

      setLoading(true)
      try {
        // Fetch course by name
        const courseResponse = await getCourseByName(courseName.replace(/-/g, ' '))
        
        if (!courseResponse?.success || !courseResponse.data) {
          throw new Error("Course not found")
        }

        const courseData = courseResponse.data
        setCourse(courseData)

        // Fetch available levels for this course
        const levelsResponse = await getLevelsByCourse(courseData._id)
        const availableLevels = levelsResponse?.data || []

        // Fetch user progress for this course
        let progressData = null
        try {
          const progressResponse = await getUserProgress(courseData._id)
          if (progressResponse?.success && progressResponse.data) {
            progressData = progressResponse.data
            setUserProgress(progressData)
            
            // If user has progress with a level, redirect to course dashboard
            if (progressData.level && progressData.status !== 'not-started') {
              const normalizedCourseName = courseName.replace(/\s+/g, '-').toLowerCase()
              navigate(`/course-dashboard/${normalizedCourseName}/${progressData.level.toLowerCase()}`, { replace: true })
              return
            }
          }
        } catch (error) {
          // No progress yet, that's okay - show levels page for enrollment
        }

        // Build level info with progress (first pass)
        const levelsInfo: LevelInfo[] = await Promise.all(
          allLevels.map(async (levelName) => {
            const isAvailable = availableLevels.includes(levelName)
            
            // Fetch lesson count for this level
            let lessonCount = 0
            let completedLessons = 0
            let progress = 0

            if (isAvailable) {
              try {
                const lessonsResponse = await getLessonsByCourse(courseData._id, levelName)
                lessonCount = lessonsResponse?.count || 0

                // Calculate progress if user has progress for this level
                if (progressData && progressData.level === levelName) {
                  completedLessons = progressData.completedLessons?.length || 0
                  progress = lessonCount > 0 
                    ? Math.round((completedLessons / lessonCount) * 100)
                    : 0
                }
              } catch (error) {
                // Level exists but no lessons yet
              }
            }

            return {
              name: levelName,
              description: levelDescriptions[levelName].replace('Yoruba', courseData.name),
              unlocked: false, // Will be calculated in second pass
              progress,
              lessonCount,
              completedLessons,
            }
          })
        )

        // Calculate unlock status (second pass)
        const levelsWithUnlocks = levelsInfo.map((level) => {
          const isAvailable = availableLevels.includes(level.name)
          let unlocked = false

          if (level.name === "Beginner") {
            unlocked = isAvailable
          } else if (level.name === "Intermediate") {
            const beginnerLevel = levelsInfo.find(l => l.name === "Beginner")
            unlocked = isAvailable && (beginnerLevel?.progress === 100 || !beginnerLevel)
          } else if (level.name === "Advanced") {
            const intermediateLevel = levelsInfo.find(l => l.name === "Intermediate")
            unlocked = isAvailable && (intermediateLevel?.progress === 100 || !intermediateLevel)
          }

          return {
            ...level,
            unlocked,
          }
        })

        setLevels(levelsWithUnlocks)
      } catch (error: any) {
        toast({
          title: "Error loading course",
          description: error.message || "Failed to load course levels",
          variant: "destructive",
        })
        navigate("/languages")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseName, navigate, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-slate-600">Loading course levels...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="p-6 space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/languages")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {course.image && (
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl">${course.flag || '🇳🇬'}</div>`
                  }
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Enroll in {course.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mb-4">
            {course.description || `Select a level to enroll and start learning ${course.name}`}
          </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                <span>{course.totalLessons || 0} lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                <span>{course.totalAssessments || 0} assessments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                <span>{course.estimatedHours || 0} hours</span>
              </div>
              {course.students > 0 && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                  <span>
                    {course.students > 1000 
                      ? `${(course.students / 1000).toFixed(1)}k` 
                      : course.students} students
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {levels.map((level) => {
          const colors = levelColors[level.name] || levelColors.Beginner
          const hasProgress = level.progress > 0
          const isBeginner = level.name === "Beginner"
          const isRecommended = isBeginner && level.unlocked

          return (
            <Card
              key={level.name}
              className={cn(
                "relative transition-all hover:shadow-xl border-2",
                level.unlocked && "hover:scale-[1.02]",
                isRecommended ? colors.border : "border-transparent",
                !level.unlocked && "opacity-60"
              )}
            >
              {!level.unlocked && (
                <div className="absolute top-4 right-4 z-10">
                  <Lock className="h-6 w-6 text-gray-400" />
                </div>
              )}

              <CardContent className="p-6 space-y-4">
                {/* Colored Circle */}
                <div className={cn(
                  "w-16 h-16 rounded-full mx-auto mb-4",
                  colors.circle
                )} />

                {/* Level Title */}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                    {level.name} {course.name}
                    {isRecommended && (
                      <Badge className="ml-2 bg-green-100 text-green-700 border-green-300">
                        (Recommended)
                      </Badge>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {level.description}
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    Multiple Lessons
                  </p>
                </div>

                {/* Action Button */}
                {level.unlocked ? (
                  <Button
                    asChild
                    className={cn(
                      "w-full !rounded-full font-semibold h-11 mt-6",
                      hasProgress ? colors.button : colors.button
                    )}
                  >
                    <Link to={`/course-dashboard/${courseName}/${level.name.toLowerCase()}`}>
                      {hasProgress ? (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Enroll
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full !rounded-full font-semibold h-11 mt-6 bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Locked
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
