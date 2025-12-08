import { Link, useLocation } from "react-router-dom"
import { Home, Calendar, Users, User, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Main navigation items for mobile bottom bar - matches sidebar main menu
const mainMenu = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/languages", label: "Learn", icon: Calendar },
  { path: "/learning-progress", label: "Progress", icon: TrendingUp },
  { path: "/community", label: "Community", icon: Users, badge: 2 },
  { path: "/profile-page", label: "Profile", icon: User },
]

export function BottomBar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/"
    }
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden shadow-lg">
      <nav className="flex items-center justify-around px-1 py-1.5 safe-area-bottom">
        {mainMenu.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-1.5 min-w-[60px] rounded-lg transition-all relative active:scale-95",
                active
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 active:text-primary"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-primary" : "text-gray-600"
                )} />
                {item.badge && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-semibold bg-primary text-white border-0 min-w-[16px]">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium text-center leading-tight max-w-[60px] truncate",
                active ? "text-primary" : "text-gray-600"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

