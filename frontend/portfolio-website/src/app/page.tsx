"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Modal, ModalTrigger, ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal";

// Helper to check if animation should be skipped (runs during render)
function getInitialAnimationState() {
  if (typeof window === 'undefined') {
    return { shouldSkip: false, isReload: false };
  }
  
  // Check if this is a page reload/refresh
  let isReload = false;
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    isReload = navigation?.type === 'reload';
  } catch (e) {
    isReload = false;
  }
  
  // If it's a reload, show animation (clear the flag)
  if (isReload) {
    sessionStorage.removeItem('hasSeenHomeAnimation');
    return { shouldSkip: false, isReload: true };
  }
  
  // Check if we've already shown animation in this session
  // If yes, skip animation (user is navigating back)
  const hasSeenInSession = sessionStorage.getItem('hasSeenHomeAnimation') === 'true';
  return { shouldSkip: hasSeenInSession, isReload: false };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [translateY, setTranslateY] = useState(0);
  const isPositionLockedRef = useRef(false);
  const heroRef = useRef<HTMLElement>(null);
  const floatingTextRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hasInitializedRef = useRef(false);

  // Check and initialize animation state when pathname is '/' (home page)
  // Use useLayoutEffect to run synchronously before paint to prevent animation flash
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || pathname !== '/') {
      // Reset ref when not on home page
      hasInitializedRef.current = false;
      return;
    }
    
    // Only check once per navigation to home
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    
    // Check if animation should be skipped
    const { shouldSkip } = getInitialAnimationState();
    
    if (shouldSkip) {
      // User is navigating back - skip animation, show content immediately
      isPositionLockedRef.current = false; // Reset position lock
      setShowAnimation(false);
      setIsLoading(false);
      setShowContent(true);
      setFadeIn(true);
    } else {
      // First visit or reload - show animation
      isPositionLockedRef.current = false; // Reset position lock
      setShowAnimation(true);
      setIsLoading(true);
      setShowContent(false);
      setFadeIn(false);
    }
  }, [pathname]);

  // Mark that user has seen the home page when content is shown
  useEffect(() => {
    if (pathname === '/' && showContent && typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenHomeAnimation', 'true');
    }
  }, [pathname, showContent]);

  useEffect(() => {
    // If animation is not showing, skip animation logic
    if (!showAnimation) {
      return;
    }

    // If we're here, we should show the animation (first visit or reload)

    // Fade in text immediately
    const fadeTimer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    // Calculate the exact position to match hero section (top alignment)
    const calculatePosition = () => {
      // Don't recalculate if position is already locked (transition has started)
      if (isPositionLockedRef.current) return;
      
      if (heroRef.current && floatingTextRef.current) {
        // Get the h1 elements from both sections
        const heroH1 = heroRef.current.querySelector('h1') as HTMLElement;
        const floatingH1 = floatingTextRef.current.querySelector('h1') as HTMLElement;
        
        if (heroH1 && floatingH1) {
          // Force a reflow to ensure accurate measurements
          void heroH1.offsetHeight;
          void floatingH1.offsetHeight;
          
          const heroH1Top = heroH1.getBoundingClientRect().top;
          const floatingH1Rect = floatingH1.getBoundingClientRect();
          const floatingH1Top = floatingH1Rect.top;
          const viewportHeight = window.innerHeight;
          
          // Calculate how much to move the floating text to align tops
          // Current floating h1 top position - target hero h1 top position
          const offset = floatingH1Top - heroH1Top;
          
          // Ensure offset is positive (moving up) and calculate in vh
          if (offset > 0) {
            const offsetVh = (offset / viewportHeight) * 100;
            setTranslateY(offsetVh);
          } else {
            // If offset is negative or zero, set a minimum positive value
            setTranslateY(0);
          }
        }
      }
    };

    // Calculate position after content is rendered (even if hidden)
    // Longer delay on mobile to ensure layout is settled
    const positionTimer = setTimeout(() => {
      calculatePosition();
      // Recalculate after a short delay to catch any layout shifts
      setTimeout(() => {
        calculatePosition();
      }, 100);
    }, 300);

    // After 2 seconds, start transition to top
    const transitionTimer = setTimeout(() => {
      // Recalculate position right before transition to ensure accurate mobile layout
      calculatePosition();
      // Small delay to ensure calculation is applied, then lock position and start transition
      setTimeout(() => {
        isPositionLockedRef.current = true; // Lock position before transition starts
        setIsTransitioning(true);
      }, 50);
      
      // After transition completes, show full content
      const contentTimer = setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
        // Mark animation as seen in sessionStorage when it completes
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hasSeenHomeAnimation', 'true');
        }
        // Don't recalculate after transition - position is locked
      }, 1200); // Transition duration

      return () => clearTimeout(contentTimer);
    }, 2000); // 2 seconds static wait

    // Recalculate on resize and orientation change (for mobile)
    // Only recalculate if position is not locked
    const handleResize = () => {
      if (!isPositionLockedRef.current) {
        calculatePosition();
      }
    };
    
    const handleOrientationChange = () => {
      // Delay to allow layout to settle after orientation change
      // Only recalculate if position is not locked
      if (!isPositionLockedRef.current) {
        setTimeout(() => {
          calculatePosition();
        }, 200);
      }
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(transitionTimer);
      clearTimeout(positionTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [showContent, showAnimation]);

  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      {/* Animated Hero Text - moves from center to top - only render if animation is not skipped */}
      {showAnimation && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-40 transition-all duration-[1200ms] ease-in-out ${
            isTransitioning ? "" : "translate-y-0"
          } ${isLoading ? "" : "opacity-0 pointer-events-none"}`}
          style={{
            transform: isTransitioning
              ? `translateY(-${translateY}vh)`
              : "translateY(0)",
            // Keep transform fixed during fade out
            willChange: isTransitioning ? "transform" : "auto",
          }}
        >
          <div
            ref={floatingTextRef}
            className={`text-center transition-opacity duration-1000 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#F0F0F0]">Hii I'm DEV</h1>
            <p className="text-xl md:text-2xl text-[#F0F0F0]">Software Developer</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 transition-opacity duration-700 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <section ref={heroRef} className="mb-12 md:mb-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#F0F0F0]">Hii I'm DEV</h1>
            <p className="text-xl md:text-2xl text-[#F0F0F0] mb-8">Software Developer</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Modal>
                <ModalTrigger
                  className="w-full sm:w-auto px-6 py-3 rounded-md transition-all duration-200 text-center font-bold text-[#000000]"
                  style={{ backgroundColor: '#F5E7C6' }}
                >
                  View Projects
                </ModalTrigger>
                <ModalBody>
                  <ModalContent>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Projects</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Here are some of my featured projects. Click on any project to learn more.
                    </p>
                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Project 1</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Description of project 1 and the technologies used.
                        </p>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Project 2</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Description of project 2 and the technologies used.
                        </p>
                      </div>
                    </div>
                  </ModalContent>
                </ModalBody>
              </Modal>
              
              <Modal>
                <ModalTrigger
                  className="w-full sm:w-auto px-6 py-3 rounded-md transition-all duration-200 text-center font-bold text-[#000000]"
                  style={{ backgroundColor: '#F5E7C6' }}
                >
                  Contact Me
                </ModalTrigger>
                <ModalBody>
                  <ModalContent>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Feel free to reach out if you'd like to collaborate or have any questions.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          rows={4}
                          placeholder="Your message here..."
                        />
                      </div>
                      <button
                        className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-bold hover:opacity-90 transition"
                      >
                        Send Message
                      </button>
                    </div>
                  </ModalContent>
                </ModalBody>
              </Modal>
            </div>
          </section>

          {/* Preview of Projects */}
          <section className="mb-16" style={{ isolation: 'isolate' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-200 p-6 rounded-lg" style={{ position: 'relative' }}>
                  <h3 className="font-semibold text-lg mb-2">Project {i}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Short description of what this project does and the tech used.
                  </p>
                  <div className="text-blue-600 text-sm font-medium">
                    See details →
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}