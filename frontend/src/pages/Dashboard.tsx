import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  FileText, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Award,
  PlayCircle,
  Languages,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAllCourses, getAllUserProgress } from "@/services/courseService"
import { getCurrentUser } from "@/services/auth"
import { cn } from "@/lib/utils"
import { DashboardStatsSkeleton, CourseGridSkeleton } from "@/components/SkeletonLoader"
import { useDebounce } from "@/hooks/useDebounce"

interface Course {
  _id: string
  name: string
  language: string
  level: string
  image: string
  totalLessons: number
  totalAssessments: number
  estimatedHours: number
}

interface UserProgress {
  _id: string
  courseId: Course
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  currentLesson: number
  totalLessons: number
  lastAccessed: string
}

export default function Dashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Get user data (for future use if needed)
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          const userResponse = await getCurrentUser()
          if (userResponse?.data) {
            localStorage.setItem('user', JSON.stringify(userResponse.data))
          }
        }

        // Fetch courses and progress in parallel
        const [coursesResponse, progressResponse] = await Promise.all([
          getAllCourses(),
          getAllUserProgress().catch(() => ({ success: true, data: [] })), // Handle if no progress yet
        ])

        if (coursesResponse?.success) {
          setCourses(coursesResponse.data || [])
          setFilteredCourses(coursesResponse.data || [])
        }

        if (progressResponse?.success) {
          setUserProgress(progressResponse.data || [])
        }
      } catch (error: any) {
        toast({
          title: "Error loading dashboard",
          description: error.message || "Failed to load your dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const filtered = courses.filter(
        (course) =>
          course.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          course.language.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
      setFilteredCourses(filtered)
    }
  }, [debouncedSearchQuery, courses])

  // Get courses in progress (status: 'in-progress')
  const inProgressCourses = userProgress
    .filter((p) => p.status === 'in-progress' && p.courseId)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 2)

  // Calculate statistics
  // Get unique languages (not just courses)
  const uniqueLanguages = new Set(courses.map(c => c.language || c.name))
  const stats = {
    totalLanguages: uniqueLanguages.size,
    languagesInProgress: userProgress.filter((p) => p.status === 'in-progress').length,
    languagesCompleted: userProgress.filter((p) => p.status === 'completed').length,
    totalHours: userProgress.reduce((sum, p) => {
      const hours = p.courseId?.estimatedHours || 0
      return sum + (hours * (p.progress / 100))
    }, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto">
          <DashboardStatsSkeleton />
          <div className="space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <CourseGridSkeleton count={10} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 lg:space-y-12 max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Languages Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-4 sm:p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1.5">Total Languages</p>
                  <p className="text-2xl sm:text-3xl font-bold leading-tight mb-1">{stats.totalLanguages}</p>
                  <p className="text-white/75 text-[10px] sm:text-xs">Available</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0 ml-3">
                  <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages In Progress Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-4 sm:p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1.5">In Progress</p>
                  <p className="text-2xl sm:text-3xl font-bold leading-tight mb-1">{stats.languagesInProgress}</p>
                  <p className="text-white/75 text-[10px] sm:text-xs">Active</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0 ml-3">
                  <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages Completed Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-4 sm:p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1.5">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold leading-tight mb-1">{stats.languagesCompleted}</p>
                  <p className="text-white/75 text-[10px] sm:text-xs">Finished</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0 ml-3">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours Learned Card */}
          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-4 sm:p-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-1.5">Hours Learned</p>
                  <p className="text-2xl sm:text-3xl font-bold leading-tight mb-1">{Math.round(stats.totalHours)}</p>
                  <p className="text-white/75 text-[10px] sm:text-xs">Time spent</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0 ml-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Continue Your Learning Section */}
      {inProgressCourses.length > 0 && (
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-1">Continue your learning</h2>
              <p className="text-slate-600 text-sm">Pick up where you left off</p>
            </div>
            <Link 
              to="/languages" 
              className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors text-sm sm:text-base group"
            >
              View All 
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {inProgressCourses.map((progress) => {
              const course = progress.courseId
              const progressPercent = progress.progress || 0
              const currentLesson = progress.currentLesson || 1
              const totalLessons = progress.totalLessons || course.totalLessons || 1

              return (
                <Card 
                  key={progress._id} 
                  className="group bg-gradient-to-br from-primary via-primary/95 to-primary/90 border-0 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-6 sm:p-8 lg:p-10 space-y-5 sm:space-y-6 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2.5 leading-tight line-clamp-2">
                          {course.name}
                        </h3>
                        <Badge className="bg-white/25 text-white border-white/40 text-xs sm:text-sm font-semibold px-2.5 py-1">
                          {course.level}
                        </Badge>
                      </div>
                      {course.image && (
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-lg flex-shrink-0 shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm sm:text-base text-white/95 font-medium">
                        <span>Progress</span>
                        <span>Lesson {currentLesson}/{totalLessons}</span>
                      </div>
                      <div className="w-full bg-white/25 rounded-full h-3 sm:h-3.5 shadow-inner">
                        <div
                          className="bg-white h-3 sm:h-3.5 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-white/90 text-sm sm:text-base font-semibold">
                        {Math.round(progressPercent)}% complete
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-white text-primary border-white hover:bg-white/95 font-bold h-12 sm:h-14 !rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                      asChild
                    >
                      <Link to={`/course/${course.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Continue Learning
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State for Continue Learning */}
      {inProgressCourses.length === 0 && (
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-10 sm:p-12 lg:p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-2xl mb-6">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">Start Your Learning Journey</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
              You haven't started any courses yet. Browse our language courses below to begin your journey!
            </p>
            <Button asChild className="!rounded-full text-base sm:text-lg h-12 sm:h-14 px-8 sm:px-10 font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              <Link to="/languages" className="flex items-center gap-2">
                Browse Courses
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search Section */}
      <div className="space-y-5 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-2">Discover Languages</h2>
          <p className="text-slate-600 text-sm">Search and explore African languages</p>
        </div>
        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for an African language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 sm:h-14 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-lg shadow-sm bg-white"
            />
          </div>
          <Button 
            size="icon" 
            className="h-12 w-12 sm:h-14 sm:w-14 !rounded-full bg-primary hover:bg-primary/90 flex-shrink-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            disabled={!searchQuery.trim()}
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      </div>

      {/* Language Cards Grid */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-1">
              {searchQuery ? `Search Results` : "All Languages"}
            </h2>
            {searchQuery && (
              <p className="text-slate-600 text-sm">{filteredCourses.length} {filteredCourses.length === 1 ? 'language' : 'languages'} found</p>
            )}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-10 sm:p-14 lg:p-16 text-center">
              <Search className="h-14 w-14 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-5 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">No languages found</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto">
                Try adjusting your search terms or browse all languages.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="!rounded-full text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 font-semibold"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {filteredCourses.map((course) => {
              const progress = userProgress.find((p) => p.courseId?._id === course._id)
              const isInProgress = progress?.status === 'in-progress'

              return (
                <Card
                  key={course._id}
                  className={cn(
                    "bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200 hover:border-primary/50 hover:-translate-y-1",
                    isInProgress && "ring-2 ring-primary ring-offset-2 shadow-md"
                  )}
                >
                  <Link to={`/course/${course.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="p-0">
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = `/${course.language.toLowerCase()}.png`
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-primary/50" />
                          </div>
                        )}
                        {isInProgress && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary text-white">
                              In Progress
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5">
                        <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-slate-900 line-clamp-2 leading-tight">{course.name}</h3>
                        <div className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{course.totalAssessments || 0} Assessments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                            <span>{course.estimatedHours || 0} hrs</span>
                          </div>
                        </div>
                        {progress && progress.progress > 0 && (
                          <div className="pt-3 border-t border-slate-200">
                            <div className="flex justify-between text-xs text-slate-700 mb-2 font-medium">
                              <span>Progress</span>
                              <span>{Math.round(progress.progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                              <div
                                className="bg-primary h-2 sm:h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
