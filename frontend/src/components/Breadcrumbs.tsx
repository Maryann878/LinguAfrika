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
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4 px-4 sm:px-6 lg:px-8 pt-4">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1
        
        return (
          <div key={index} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                to={crumb.path || '#'}
                className={cn(
                  "flex items-center gap-1 hover:text-primary transition-colors",
                  isLast && "text-gray-900 font-medium"
                )}
              >
                <Home className="h-4 w-4" />
                {crumb.label}
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {crumb.path && !isLast ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "text-gray-900 font-medium")}>
                    {crumb.label}
                  </span>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}


