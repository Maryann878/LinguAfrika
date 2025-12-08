import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  path?: string
}

export function Breadcrumbs() {
  const location = useLocation()
  
  // Don't show breadcrumbs on dashboard or auth pages
  const hideOnPaths = ['/dashboard', '/login', '/signup', '/reset-email', '/reset-otp', '/reset-password', '/verify', '/onboarding', '/welcome-onboarding', '/splash']
  if (hideOnPaths.includes(location.pathname)) {
    return null
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/dashboard' }
  ]

  // Add dynamic segments
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Format label (replace hyphens with spaces, capitalize)
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Don't add if it's the last segment (current page)
    if (index < pathSegments.length - 1) {
      breadcrumbs.push({ label, path: currentPath })
    } else {
      breadcrumbs.push({ label })
    }
  })

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav 
      className="flex items-center gap-2 text-sm text-slate-600 mb-4 px-4 sm:px-6 lg:px-8 pt-4 bg-white/50 backdrop-blur-sm border-b border-gray-100"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          
          return (
            <li key={index} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  to={crumb.path || '#'}
                  className={cn(
                    "flex items-center gap-1.5 hover:text-primary transition-colors min-h-[44px] min-w-[44px] px-2 py-1 rounded-md hover:bg-primary/5",
                    isLast && "text-slate-900 font-semibold"
                  )}
                  aria-label={isLast ? `Current page: ${crumb.label}` : `Navigate to ${crumb.label}`}
                >
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  {crumb.path && !isLast ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-primary transition-colors min-h-[44px] px-2 py-1 rounded-md hover:bg-primary/5"
                      aria-label={`Navigate to ${crumb.label}`}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span 
                      className={cn(
                        "min-h-[44px] px-2 py-1",
                        isLast && "text-slate-900 font-semibold"
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}


