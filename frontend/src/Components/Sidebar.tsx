import { Link, useLocation } from "react-router-dom"
import { Home, Calendar, Sparkles, Users, TrendingUp, HelpCircle, User, X, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import LinguAfrikaBrand from "@/components/LinguAfrikaBrand"
import { Button } from "@/components/ui/button"
import logo from "/logo.png"

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

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/"
    }
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const handleLinkClick = () => {
    // Close mobile menu when link is clicked
    if (onClose && window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay - Only show when sidebar is open on mobile */}
      {onClose && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
      )}

      {/* Sidebar - Hidden on mobile, shown on desktop or when opened via hamburger */}
      <div
        className={cn(
          "w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-300 ease-in-out",
          onClose
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0",
          "lg:translate-x-0 lg:block" // Always visible on desktop, slide-in on mobile when open
        )}
      >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 flex-1" onClick={handleLinkClick}>
          <img 
            src={logo} 
            alt="LinguAfrika Logo" 
            className="h-8 w-auto object-contain"
          />
          <LinguAfrikaBrand size="sm" />
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main Menu */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
          Main Menu
        </h3>
        <nav className="space-y-1">
          {mainMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group relative",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
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
        <nav className="space-y-1">
          {toolsMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group relative",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
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
        <nav className="space-y-1">
          {settingsMenu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-white" : "text-gray-500")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      </div>
    </>
  )
}

