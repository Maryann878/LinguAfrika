import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Search,
  FileText,
  Award,
  Users
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAllCourses, getAllUserProgress } from "@/services/courseService"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { CourseGridSkeleton } from "@/components/SkeletonLoader"

interface Course {
  _id: string
  name: string
  language: string
  level: string
  image: string
  description?: string
  totalLessons: number
  totalAssessments: number
  estimatedHours: number
  students: number
  flag?: string
}

interface UserProgress {
  _id: string
  courseId: Course
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  currentLesson: number
  totalLessons: number
  level?: string
}

export default function Languages() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [coursesResponse, progressResponse] = await Promise.all([
          getAllCourses(),
          getAllUserProgress().catch(() => ({ success: true, data: [] })),
        ])

        if (coursesResponse?.success) {
          setCourses(coursesResponse.data || [])
        }

        if (progressResponse?.success) {
          setUserProgress(progressResponse.data || [])
        }
      } catch (error: any) {
        toast({
          title: "Error loading languages",
          description: error.message || "Failed to load language courses",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    let filtered = courses

    // Apply search filter (using debounced value)
    if (debouncedSearchQuery.trim() !== "") {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          course.language.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    }

    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter)
    }

  }, [debouncedSearchQuery, levelFilter, courses])

  const getProgressForCourse = (courseId: string) => {
    return userProgress.find((p) => p.courseId?._id === courseId)
  }

  const handleCourseClick = (e: React.MouseEvent, course: Course) => {
    e.preventDefault()
    const progress = getProgressForCourse(course._id)
    const courseNameSlug = course.name.toLowerCase().replace(/\s+/g, '-')
    
    // If user has progress with a level, go directly to course dashboard
    if (progress && progress.status !== 'not-started' && (progress as any).level) {
      const level = (progress as any).level.toLowerCase()
      navigate(`/course-dashboard/${courseNameSlug}/${level}`)
    } else {
      // No progress or no level selected - show levels page for enrollment
      navigate(`/course/${courseNameSlug}`)
    }
  }

  // Separate enrolled courses from available courses
  const enrolledCourses = courses.filter((course) => {
    const progress = getProgressForCourse(course._id)
    return progress && progress.status !== 'not-started' && (progress as any).level
  })

  const availableCourses = courses.filter((course) => {
    const progress = getProgressForCourse(course._id)
    return !progress || progress.status === 'not-started' || !(progress as any).level
  })

  // Apply filters to available courses
  const filteredEnrolledCourses = enrolledCourses.filter((course) => {
    if (debouncedSearchQuery.trim() !== "") {
      const matchesSearch = 
        course.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        course.language.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      if (!matchesSearch) return false
    }
    if (levelFilter !== "all") {
      return course.level === levelFilter
    }
    return true
  })

  const filteredAvailableCourses = availableCourses.filter((course) => {
    if (debouncedSearchQuery.trim() !== "") {
      const matchesSearch = 
        course.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        course.language.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      if (!matchesSearch) return false
    }
    if (levelFilter !== "all") {
      return course.level === levelFilter
    }
    return true
  })

  const levels = ["all", "Beginner", "Intermediate", "Advanced"]

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <CourseGridSkeleton count={6} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Languages
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Continue your enrolled courses or explore new languages to learn
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Level Filter */}
          <div className="flex gap-2 flex-wrap">
            {levels.map((level) => (
              <Button
                key={level}
                variant={levelFilter === level ? "default" : "outline"}
                onClick={() => setLevelFilter(level)}
                className={cn(
                  "!rounded-full",
                  levelFilter === level && "bg-primary hover:bg-primary/90"
                )}
              >
                {level === "all" ? "All Levels" : level}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredEnrolledCourses.length + filteredAvailableCourses.length} {filteredEnrolledCourses.length + filteredAvailableCourses.length === 1 ? "course" : "courses"} found
          </p>
        </div>
      </div>

      {/* My Courses Section - Enrolled Courses */}
      {enrolledCourses.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">My Courses</h2>
            <p className="text-slate-600 text-sm">
              Continue learning where you left off
            </p>
          </div>
          {filteredEnrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600">No enrolled courses match your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrolledCourses.map((course) => {
                const progress = getProgressForCourse(course._id)
                const isInProgress = progress?.status === 'in-progress'
                const isCompleted = progress?.status === 'completed'
                const progressPercent = progress?.progress || 0

                return (
                  <Card
                    key={course._id}
                    className={cn(
                      "hover:shadow-xl transition-all cursor-pointer overflow-hidden group",
                      isInProgress && "ring-2 ring-primary",
                      isCompleted && "ring-2 ring-green-500"
                    )}
                  >
                    <div onClick={(e) => handleCourseClick(e, course)}>
                      <CardContent className="p-0">
                        {/* Course Image/Header */}
                        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                          {course.image ? (
                            <img
                              src={course.image}
                              alt={course.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                  parent.className = "relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                                  parent.innerHTML = `<div class="text-6xl">${course.flag || '🇳🇬'}</div>`
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-6xl">{course.flag || '🇳🇬'}</span>
                            </div>
                          )}
                          
                          {/* Status Badges */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            {isCompleted && (
                              <Badge className="bg-green-500 text-white border-0">
                                <Award className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {isInProgress && !isCompleted && (
                              <Badge className="bg-primary text-white border-0">
                                In Progress
                              </Badge>
                            )}
                            <Badge 
                              variant="secondary" 
                              className="bg-white/90 text-gray-700 border-0"
                            >
                              {course.level}
                            </Badge>
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                              {course.name}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-2">
                              {course.description || `Learn ${course.name} with interactive lessons and assessments`}
                            </p>
                          </div>

                          {/* Progress Bar (if in progress) */}
                          {isInProgress && progressPercent > 0 && (
                            <div className="space-y-2 pt-2 border-t border-gray-200">
                              <div className="flex justify-between text-xs text-slate-600">
                                <span>Progress</span>
                                <span className="font-semibold">{Math.round(progressPercent)}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-500">
                                Lesson {progress.currentLesson} of {progress.totalLessons || course.totalLessons}
                              </p>
                            </div>
                          )}

                          {/* Course Stats */}
                          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-200">
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
                              <span>{course.estimatedHours || 0} hrs</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button
                            className={cn(
                              "w-full !rounded-full font-semibold h-11",
                              isCompleted && "bg-green-500 hover:bg-green-600"
                            )}
                            variant={isCompleted ? "default" : "default"}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCourseClick(e, course)
                            }}
                          >
                            {isCompleted ? (
                              <>
                                Review Course
                                <Award className="ml-2 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Continue Learning
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Browse All Courses Section - Available for Enrollment */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {enrolledCourses.length > 0 ? "Browse All Courses" : "Available Courses"}
          </h2>
          <p className="text-slate-600 text-sm">
            {enrolledCourses.length > 0 
              ? "Explore new languages and enroll to start learning"
              : "Select a language and level to begin your learning journey"}
          </p>
        </div>
        
        {filteredAvailableCourses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Try adjusting your search or filter criteria to find courses to enroll in.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setLevelFilter("all")
                }}
                className="!rounded-full"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableCourses.map((course) => {
            const progress = getProgressForCourse(course._id)
            const isInProgress = progress?.status === 'in-progress'
            const isCompleted = progress?.status === 'completed'

            return (
              <Card
                key={course._id}
                className={cn(
                  "hover:shadow-xl transition-all cursor-pointer overflow-hidden group",
                  isInProgress && "ring-2 ring-primary",
                  isCompleted && "ring-2 ring-green-500"
                )}
              >
                <div onClick={(e) => handleCourseClick(e, course)}>
                  <CardContent className="p-0">
                    {/* Course Image/Header */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.className = "relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                              parent.innerHTML = `<div class="text-6xl">${course.flag || '🇳🇬'}</div>`
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">{course.flag || '🇳🇬'}</span>
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-white/90 text-gray-700 border-0"
                        >
                          {course.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {course.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.description || `Learn ${course.name} with interactive lessons and assessments`}
                        </p>
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span>{course.totalLessons || 0} lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>{course.totalAssessments || 0} assessments</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{course.estimatedHours || 0} hrs</span>
                        </div>
                      </div>

                      {/* Students Count */}
                      {course.students > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>
                            {course.students > 1000 
                              ? `${(course.students / 1000).toFixed(1)}k` 
                              : course.students} students
                          </span>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        className={cn(
                          "w-full !rounded-full font-semibold h-11",
                          isCompleted && "bg-green-500 hover:bg-green-600"
                        )}
                        variant={isCompleted ? "default" : "default"}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCourseClick(e, course)
                        }}
                      >
                        <>
                          Enroll Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}
