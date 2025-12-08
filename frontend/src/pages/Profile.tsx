import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Mail, Phone, MapPin, Calendar, Award } from "lucide-react"
import { Link } from "react-router-dom"
import { getCurrentUser } from "@/services/auth"
import { getAllUserProgress } from "@/services/courseService"
import { useToast } from "@/components/ui/use-toast"
import { getProfileImageUrl } from "@/utils/imageUtils"
import { LoadingScreen } from "@/components/LoadingScreen"

interface User {
  _id: string
  username: string
  email: string
  mobile: string
  firstName?: string
  lastName?: string
  profileImage?: string
  country?: string
  location?: string
  bio?: string
  gender?: string
  ageRange?: string
  goals?: string[]
  createdAt: string
  role?: string
}

interface UserProgress {
  _id: string
  courseId: {
    _id: string
    name: string
    language: string
    level: string
  }
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
}

export default function Profile() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [learningLanguages, setLearningLanguages] = useState<string[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      try {
        // Fetch user data and progress in parallel for faster loading
        const [userResponse, progressResponse] = await Promise.all([
          getCurrentUser(),
          getAllUserProgress().catch(() => ({ success: true, data: [] })), // Handle if no progress yet
        ])

        if (userResponse?.success && userResponse?.data) {
          setUser(userResponse.data)
          // Update localStorage
          localStorage.setItem('user', JSON.stringify(userResponse.data))
        }

        if (progressResponse?.success && progressResponse?.data) {
          const progress: UserProgress[] = progressResponse.data
          
          // Extract unique languages from courses
          const languages = new Set<string>()
          let inProgressCount = 0
          let completedCount = 0
          
          progress.forEach((p) => {
            if (p.courseId?.language) {
              languages.add(p.courseId.language)
            }
            if (p.status === 'in-progress') inProgressCount++
            if (p.status === 'completed') completedCount++
          })
          
          setLearningLanguages(Array.from(languages))
          setStats({
            totalCourses: progress.length,
            inProgress: inProgressCount,
            completed: completedCount,
          })
        }
      } catch (error: any) {
        console.error('Failed to fetch profile data:', error)
        toast({
          title: "Error loading profile",
          description: error.message || "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [toast])

  const getUserName = () => {
    if (!user) return "User"
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
    if (user.firstName) return user.firstName
    if (user.username) return user.username
    return "User"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    const name = getUserName()
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getJoinDate = () => {
    if (!user?.createdAt) return "Recently"
    const date = new Date(user.createdAt)
    
    // Get day of week
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Get full date
    const fullDate = date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    // Get time
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    
    return `${dayOfWeek}, ${fullDate} at ${time}`
  }

  const getLocation = () => {
    if (!user) return "Not set"
    if (user.location && user.country) return `${user.location}, ${user.country}`
    if (user.location) return user.location
    if (user.country) return user.country
    return "Not set"
  }

  if (loading) {
    return <LoadingScreen message="Loading your profile..." />
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 mb-4">Failed to load profile data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your profile information</p>
        </div>
        <Button asChild className="!rounded-full">
          <Link to="/edit-profile">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative overflow-hidden">
              {(() => {
                const imageUrl = getProfileImageUrl(user.profileImage)
                return imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={getUserName()} 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-4xl text-primary font-bold">${getUserInitials()}</span>`
                      }
                    }}
                  />
                ) : (
                  <span className="text-4xl text-primary font-bold">{getUserInitials()}</span>
                )
              })()}
            </div>
            <CardTitle className="text-2xl">{getUserName()}</CardTitle>
            <CardDescription>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Language Learner"}</CardDescription>
            {user.bio && (
              <p className="text-sm text-gray-600 mt-2">{user.bio}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{user.mobile || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{getLocation()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Joined {getJoinDate()}</span>
            </div>
            {user.gender && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="text-sm font-medium">{user.gender}</p>
              </div>
            )}
            {user.ageRange && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Age Range</p>
                <p className="text-sm font-medium">{user.ageRange}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Statistics & Languages */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
            <CardDescription>Your learning progress overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.totalCourses}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Courses</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground mt-1">In Progress</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </div>
            </div>

            {/* Learning Languages */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Learning Languages</h3>
              {learningLanguages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {learningLanguages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-base px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20">
                      {lang}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No languages being learned yet. Start a course to see your languages here!</p>
              )}
            </div>

            {/* Learning Goals */}
            {user.goals && user.goals.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Learning Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {user.goals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your learning milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {stats.completed > 0 && (
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-primary/5 transition-colors">
                  <Award className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Course Master</p>
                    <p className="text-sm text-muted-foreground">{stats.completed} course{stats.completed !== 1 ? 's' : ''} completed</p>
                  </div>
                </div>
              )}
              {stats.inProgress > 0 && (
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-primary/5 transition-colors">
                  <Award className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Active Learner</p>
                    <p className="text-sm text-muted-foreground">{stats.inProgress} course{stats.inProgress !== 1 ? 's' : ''} in progress</p>
                  </div>
                </div>
              )}
              {learningLanguages.length > 0 && (
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-primary/5 transition-colors">
                  <Award className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Polyglot</p>
                    <p className="text-sm text-muted-foreground">Learning {learningLanguages.length} language{learningLanguages.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
              {stats.totalCourses === 0 && stats.inProgress === 0 && stats.completed === 0 && (
                <div className="col-span-3 text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No achievements yet. Start learning to unlock achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

