import { Link, useLocation } from "react-router-dom"
import { Home, Calendar, Sparkles, Users, TrendingUp, HelpCircle, User, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"

// Main Navigation - Primary actions users take most often
const mainMenu = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/languages", label: "Learn", icon: Calendar, description: "Browse Languages" },
  { path: "/learning-progress", label: "Progress", icon: TrendingUp, description: "Track Learning" },
  { path: "/community", label: "Community", icon: Users, badge: 2 },
  { path: "/profile-page", label: "Profile", icon: User },
]

// Tools & Features - Supporting features
const toolsMenu: Array<{ path: string; label: string; icon: any; badge?: number; description?: string }> = [
  { path: "/ai-chat", label: "AI Chat", icon: Sparkles, badge: 2 },
  { path: "/quiz", label: "Quiz", icon: HelpCircle },
]

// Settings & Support
const settingsMenu: Array<{ path: string; label: string; icon: any; badge?: number; description?: string }> = [
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/help-support", label: "Help & Support", icon: HelpCircle },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar(_props: SidebarProps = {}) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/"
    }
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  return (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-center">
        <Link to="/dashboard" className="flex items-center gap-3 justify-center flex-1">
          <img
            src="/logo.png"
            alt="LinguAfrika Logo"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = "/logo2.png";
            }}
          />
          <LinguAfrikaBrand size="sm" />
        </Link>
      </div>

      {/* Main Menu */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          Main Menu
        </h3>
        <nav className="space-y-1" aria-label="Main navigation">
          {mainMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 py-3 min-h-[44px] rounded-lg transition-all duration-200 group relative",
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                )}
                aria-current={active ? "page" : undefined}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-white" : "text-gray-500")} />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium block">{item.label}</span>
                    {item.description && (
                      <span className={cn("text-xs block truncate mt-0.5", active ? "text-white/80" : "text-gray-500")}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <Badge
                    className={cn(
                      "h-5 min-w-5 px-1.5 flex items-center justify-center text-xs font-semibold flex-shrink-0 ml-2",
                      active
                        ? "bg-white text-primary"
                        : "bg-primary text-white"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tools & Features */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          Tools & Features
        </h3>
        <nav className="space-y-1" aria-label="Tools navigation">
          {toolsMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 py-3 min-h-[44px] rounded-lg transition-all duration-200 group relative",
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                )}
                aria-current={active ? "page" : undefined}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-white" : "text-gray-500")} />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium block">{item.label}</span>
                    {item.description && (
                      <span className={cn("text-xs block truncate mt-0.5", active ? "text-white/80" : "text-gray-500")}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <Badge
                    className={cn(
                      "h-5 min-w-5 px-1.5 flex items-center justify-center text-xs font-semibold flex-shrink-0 ml-2",
                      active
                        ? "bg-white text-primary"
                        : "bg-primary text-white"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Settings & Support */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          Settings & Support
        </h3>
        <nav className="space-y-1" aria-label="Settings navigation">
          {settingsMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg transition-all duration-200",
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-white" : "text-gray-500")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

