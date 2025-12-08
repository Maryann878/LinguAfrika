import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Calendar, Users, User, TrendingUp, MoreHorizontal, Sparkles, HelpCircle, Settings, X } from "lucide-react"
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

// Additional menu items from sidebar that appear in "More" menu
const moreMenuItems = [
  { path: "/ai-chat", label: "AI Chat", icon: Sparkles, badge: 2, category: "Tools" },
  { path: "/quiz", label: "Quiz", icon: HelpCircle, category: "Tools" },
  { path: "/profile-page", label: "Profile", icon: User, category: "Account" },
  { path: "/settings", label: "Settings", icon: Settings, category: "Settings" },
  { path: "/help-support", label: "Help & Support", icon: HelpCircle, category: "Settings" },
]

export function BottomBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/"
    }
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const handleMoreItemClick = (path: string) => {
    setIsMoreOpen(false)
    navigate(path)
  }

  // Group items by category
  const toolsItems = moreMenuItems.filter(item => item.category === "Tools")
  const accountItems = moreMenuItems.filter(item => item.category === "Account")
  const settingsItems = moreMenuItems.filter(item => item.category === "Settings")

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden shadow-lg">
        <nav className="flex items-center justify-between px-2 py-1.5 safe-area-bottom">
          {/* Main menu items - show first 4 most important */}
          {mainMenu.slice(0, 4).map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-1.5 py-1.5 flex-1 max-w-[20%] rounded-lg transition-all relative active:scale-95",
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
                  "text-[10px] font-medium text-center leading-tight truncate w-full",
                  active ? "text-primary" : "text-gray-600"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-1.5 py-1.5 flex-1 max-w-[20%] rounded-lg transition-all relative active:scale-95",
              isMoreOpen
                ? "text-primary bg-primary/5"
                : "text-gray-600 active:text-primary"
            )}
          >
            <MoreHorizontal className={cn(
              "h-5 w-5 transition-colors",
              isMoreOpen ? "text-primary" : "text-gray-600"
            )} />
            <span className={cn(
              "text-[10px] font-medium text-center leading-tight truncate w-full",
              isMoreOpen ? "text-primary" : "text-gray-600"
            )}>
              More
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Sheet for More Menu */}
      {isMoreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-in fade-in"
            onClick={() => setIsMoreOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] lg:hidden animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-hidden">
            {/* Handle bar */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-slate-900">More Options</h2>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Menu Items */}
            <div className="overflow-y-auto px-4 py-4 space-y-6">
              {/* Tools & Features */}
              {toolsItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Tools & Features
                  </h3>
                  <div className="space-y-1">
                    {toolsItems.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path)
                      
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleMoreItemClick(item.path)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px]",
                            active
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            active ? "text-white" : "text-gray-500"
                          )} />
                          <span className={cn(
                            "font-medium flex-1 text-left",
                            active ? "text-white" : "text-gray-900"
                          )}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className={cn(
                              "h-5 min-w-5 px-1.5 flex items-center justify-center text-xs font-semibold flex-shrink-0",
                              active
                                ? "bg-white text-primary"
                                : "bg-primary text-white"
                            )}>
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Account */}
              {accountItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Account
                  </h3>
                  <div className="space-y-1">
                    {accountItems.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path)
                      
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleMoreItemClick(item.path)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px]",
                            active
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            active ? "text-white" : "text-gray-500"
                          )} />
                          <span className={cn(
                            "font-medium flex-1 text-left",
                            active ? "text-white" : "text-gray-900"
                          )}>
                            {item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Settings & Support */}
              {settingsItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Settings & Support
                  </h3>
                  <div className="space-y-1">
                    {settingsItems.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path)
                      
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleMoreItemClick(item.path)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px]",
                            active
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            active ? "text-white" : "text-gray-500"
                          )} />
                          <span className={cn(
                            "font-medium flex-1 text-left",
                            active ? "text-white" : "text-gray-900"
                          )}>
                            {item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

