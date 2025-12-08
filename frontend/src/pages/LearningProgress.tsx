import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Award, BookOpen, Loader2, Clock } from "lucide-react"
import { getAllUserProgress } from "@/services/courseService"
import { useToast } from "@/components/ui/use-toast"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface UserProgress {
  _id: string
  courseId: {
    _id: string
    name: string
    language: string
    level: string
    totalLessons: number
  }
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  currentLesson: number
  totalLessons: number
}

export default function LearningProgress() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true)
      try {
        const response = await getAllUserProgress()
        if (response?.success) {
          setUserProgress(response.data || [])
        }
      } catch (error: any) {
        toast({
          title: "Error loading progress",
          description: error.message || "Failed to load your learning progress",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [toast])

  // Calculate statistics
  const stats = {
    totalLessons: userProgress.reduce((sum, p) => sum + (p.currentLesson || 0), 0),
    languages: new Set(userProgress.map(p => p.courseId?.language)).size,
    completed: userProgress.filter(p => p.status === 'completed').length,
    inProgress: userProgress.filter(p => p.status === 'in-progress').length,
  }

  // Get achievements based on progress
  const achievements = []
  if (stats.totalLessons > 0) {
    achievements.push({ title: "First Lesson", description: "Started your learning journey", icon: Award })
  }
  if (stats.completed > 0) {
    achievements.push({ title: "Course Master", description: `${stats.completed} course${stats.completed !== 1 ? 's' : ''} completed`, icon: Award })
  }
  if (stats.inProgress > 0) {
    achievements.push({ title: "Active Learner", description: `${stats.inProgress} course${stats.inProgress !== 1 ? 's' : ''} in progress`, icon: Award })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Learning Progress</h1>
        <p className="text-gray-600 text-base sm:text-lg">Track your learning journey and achievements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Total Lessons</p>
                <p className="text-3xl sm:text-4xl font-bold">{stats.totalLessons}</p>
              </div>
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Languages</p>
                <p className="text-3xl sm:text-4xl font-bold">{stats.languages}</p>
              </div>
              <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">Completed</p>
                <p className="text-3xl sm:text-4xl font-bold">{stats.completed}</p>
              </div>
              <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider mb-2">In Progress</p>
                <p className="text-3xl sm:text-4xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">Course Progress</CardTitle>
          <CardDescription>Your progress across all languages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userProgress.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No progress yet</h3>
              <p className="text-gray-600 mb-6">Start learning to see your progress here!</p>
              <Link to="/languages">
                <Button className="!rounded-full">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            userProgress.map((progress) => {
              const course = progress.courseId
              const progressPercent = progress.progress || 0
              const currentLesson = progress.currentLesson || 0
              const totalLessons = progress.totalLessons || course.totalLessons || 1

              return (
                <Link
                  key={progress._id}
                  to={`/course/${course.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block"
                >
                  <div className={cn(
                    "p-5 rounded-lg border-2 transition-all hover:shadow-md",
                    progress.status === 'completed' 
                      ? "border-green-200 bg-green-50/50" 
                      : progress.status === 'in-progress'
                      ? "border-primary/30 bg-primary/5"
                      : "border-gray-200 bg-gray-50"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{course.name}</h3>
                          <Badge 
                            variant={progress.status === 'completed' ? 'default' : 'secondary'}
                            className={cn(
                              progress.status === 'completed' && "bg-green-500 text-white"
                            )}
                          >
                            {course.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            Lesson {currentLesson} / {totalLessons}
                          </span>
                          {progress.status === 'completed' && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Award className="h-4 w-4" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">{Math.round(progressPercent)}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-3.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          progress.status === 'completed' 
                            ? "bg-green-500" 
                            : "bg-primary"
                        )}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">Achievements</CardTitle>
          <CardDescription>Your learning milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements yet</h3>
              <p className="text-gray-600">Start learning to unlock achievements!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-lg hover:border-primary/50 hover:shadow-md transition-all bg-white"
                  >
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

