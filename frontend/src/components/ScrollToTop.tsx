import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window and main content to the top
 * whenever the route changes. Handles lazy-loaded components and ensures
 * scrolling happens after content is rendered.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Function to scroll everything to top
    const scrollToTop = () => {
      // Scroll window to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });

      // Also scroll any scrollable containers (like main content area)
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }

      // Scroll document element and body as well (for different browsers)
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also try scrolling any other scrollable containers
      const scrollableContainers = document.querySelectorAll('[class*="overflow-y-auto"], [class*="overflow-y-scroll"]');
      scrollableContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
        }
      });
    };

    // Immediate scroll
    scrollToTop();

    // Also scroll after a small delay to catch lazy-loaded content
    const timeoutId = setTimeout(scrollToTop, 100);
    
    // One more scroll after components are fully rendered
    const timeoutId2 = setTimeout(scrollToTop, 300);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [pathname]);

  return null;
}

