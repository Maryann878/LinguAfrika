import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser } from "@/services/auth"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from "@/services/notificationService"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { getProfileImageUrl } from "@/utils/imageUtils"

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Only show greeting on dashboard
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/"

  const getGreeting = () => {
    return "Hello"
  }

  const getUserName = () => {
    if (!user) return "there"
    if (user.firstName) return user.firstName
    if (user.name) return user.name.split(" ")[0]
    if (user.username) return user.username
    return "there"
  }

  const getUserDisplayName = () => {
    if (!user) return "User"
    if (user.name) return user.name
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
    if (user.firstName) return user.firstName
    if (user.username) return user.username
    return "User"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    // Return first letter of username, or first letter of name if username not available
    if (user.username) return user.username[0].toUpperCase()
    if (user.firstName) return user.firstName[0].toUpperCase()
    if (user.name) return user.name[0].toUpperCase()
    return "U"
  }

  const updateUserFromStorage = () => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e)
      }
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get from localStorage first
        const userStr = localStorage.getItem("user")
        if (userStr) {
          try {
            const userData = JSON.parse(userStr)
            setUser(userData)
            setLoading(false)
            // Also fetch fresh data from backend
            try {
              const userResponse = await getCurrentUser()
              if (userResponse?.data) {
                setUser(userResponse.data)
                localStorage.setItem("user", JSON.stringify(userResponse.data))
              }
            } catch (e) {
              // If API fails, use localStorage data
            }
            return
          } catch (e) {
            // Invalid JSON, fetch from API
          }
        }

        // Fetch from API
        const userResponse = await getCurrentUser()
        if (userResponse?.data) {
          setUser(userResponse.data)
          localStorage.setItem("user", JSON.stringify(userResponse.data))
        }
      } catch (error: any) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Listen for storage changes (when profile image is uploaded)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        updateUserFromStorage()
      }
    }

    // Listen for custom event (for same-tab updates)
    const handleUserUpdate = () => {
      updateUserFromStorage()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userUpdated", handleUserUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications(10, false)
        if (response?.success) {
          setNotifications(response.data || [])
          setUnreadCount(response.unreadCount || 0)
        }
      } catch (error: any) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden h-9 w-9 flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {isDashboard ? (
            <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Loading...
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium hidden sm:block leading-relaxed">
                What language are you learning today?
              </p>
            </div>
          ) : (
            <div className="min-w-0 flex-1" />
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
        {isDashboard ? (
          <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              <span className="block sm:inline">{getGreeting()},</span>{" "}
              <span className="text-primary">{getUserName()}!</span>{" "}
              <span className="inline-block animate-wave ml-1">👋</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium hidden sm:block leading-relaxed">
              What language are you learning today?
            </p>
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}
      </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs bg-primary text-white border-0">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 max-h-[400px] overflow-y-auto">
            <div className="p-2 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={async () => {
                      try {
                        await markAllNotificationsAsRead()
                        setUnreadCount(0)
                        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: "Failed to mark all as read",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No notifications</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification._id}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 cursor-pointer",
                      !notification.isRead && "bg-primary/5"
                    )}
                    onClick={async () => {
                      if (!notification.isRead) {
                        try {
                          await markNotificationAsRead(notification._id)
                          setNotifications(prev =>
                            prev.map(n =>
                              n._id === notification._id ? { ...n, isRead: true } : n
                            )
                          )
                          setUnreadCount(prev => Math.max(0, prev - 1))
                        } catch (error) {
                          console.error("Failed to mark notification as read:", error)
                        }
                      }
                      if (notification.link) {
                        window.location.href = notification.link
                      }
                    }}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-semibold",
                          !notification.isRead && "text-gray-900"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2 h-auto py-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {(() => {
                  const imageUrl = getProfileImageUrl(user?.profileImage || user?.avatar)
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={getUserDisplayName()}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-primary font-semibold text-xs sm:text-sm">${getUserInitials()}</span>`
                        }
                      }}
                    />
                  ) : (
                    <span className="text-primary font-semibold text-xs sm:text-sm">{getUserInitials()}</span>
                  )
                })()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-xs sm:text-sm truncate max-w-[100px] lg:max-w-none">{getUserDisplayName()}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">{user?.role || "Student"}</div>
              </div>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link to="/profile-page">View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/edit-profile">Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.clear()
                window.location.href = "/login"
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

