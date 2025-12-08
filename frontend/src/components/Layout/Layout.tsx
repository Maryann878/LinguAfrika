import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const Layout: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    // Scroll main content to top when route changes
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      
      // Scroll main element to top
      if (mainRef.current) {
        mainRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }

      // Also scroll window to top (for pages without Layout)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile, always visible on desktop */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden w-full lg:w-auto">
        <TopBar />
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-gray-50 pb-16 lg:pb-0 px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
      
      {/* Bottom Bar - Only visible on mobile */}
      <BottomBar />
    </div>
  );
};

export default Layout;

