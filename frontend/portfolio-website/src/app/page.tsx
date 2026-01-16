"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Antigravity from "@/components/Antigravity";

// Helper to check if animation should be skipped (runs during render)
function checkShouldSkipAnimation(): { shouldSkip: boolean; isReload: boolean } {
  if (typeof window === 'undefined') return { shouldSkip: false, isReload: false };
  
  // Check if this is a page reload/refresh
  let isReload = false;
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    isReload = navigation?.type === 'reload';
  } catch (e) {
    isReload = false;
  }
  
  // If it's a reload, don't skip (but we'll clear the flag in useEffect)
  if (isReload) return { shouldSkip: false, isReload: true };
  
  // Check if we've already shown animation in this session
  const hasSeenInSession = sessionStorage.getItem('hasSeenHomeAnimation') === 'true';
  return { shouldSkip: hasSeenInSession, isReload: false };
}

export default function Home() {
  // Check synchronously during render if animation should be skipped
  const { shouldSkip, isReload } = typeof window !== 'undefined' ? checkShouldSkipAnimation() : { shouldSkip: false, isReload: false };
  
  const [isLoading, setIsLoading] = useState(!shouldSkip);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(shouldSkip);
  const [fadeIn, setFadeIn] = useState(shouldSkip);
  const [showAnimation, setShowAnimation] = useState(!shouldSkip);
  const [translateY, setTranslateY] = useState(0);
  const isPositionLockedRef = useRef(false);
  const heroRef = useRef<HTMLElement>(null);
  const floatingTextRef = useRef<HTMLDivElement>(null);
  const projectLinkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [linkPositions, setLinkPositions] = useState<Array<{ top: number; left: number; width: number }>>([]);
  const animationSkippedRef = useRef(shouldSkip);
  const hasCheckedRef = useRef(false);
  const pathname = usePathname();

  // Update state when pathname changes and handle reloads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Reset check ref when navigating away from home
    if (pathname !== '/') {
      hasCheckedRef.current = false;
      return;
    }
    
    // Only check once per navigation to home
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    
    // Re-check if animation should be skipped
    const { shouldSkip: shouldSkipNow, isReload: isReloadNow } = checkShouldSkipAnimation();
    
    // If it's a reload, clear the flag
    if (isReloadNow) {
      sessionStorage.removeItem('hasSeenHomeAnimation');
    }
    
    if (shouldSkipNow && !animationSkippedRef.current) {
      // Skip animation, show content immediately
      animationSkippedRef.current = true;
      setShowAnimation(false);
      setIsLoading(false);
      setShowContent(true);
      setFadeIn(true);
    } else if (!shouldSkipNow && animationSkippedRef.current && !isReloadNow) {
      // This shouldn't happen, but reset if needed
      animationSkippedRef.current = false;
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
    // If animation was skipped, only handle link positions
    if (animationSkippedRef.current) {
      // Calculate project link positions
      const calculateLinkPositions = () => {
        const positions = projectLinkRefs.current
          .filter(ref => ref !== null)
          .map(ref => {
            const rect = ref!.getBoundingClientRect();
            return {
              top: rect.top,
              left: rect.left,
              width: rect.width
            };
          });
        setLinkPositions(positions);
      };

      setTimeout(calculateLinkPositions, 100);
      window.addEventListener("scroll", calculateLinkPositions);
      window.addEventListener("resize", calculateLinkPositions);

      return () => {
        window.removeEventListener("scroll", calculateLinkPositions);
        window.removeEventListener("resize", calculateLinkPositions);
      };
    }

    // If we're here, we should show the animation

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

    // Calculate project link positions
    const calculateLinkPositions = () => {
      const positions = projectLinkRefs.current
        .filter(ref => ref !== null)
        .map(ref => {
          const rect = ref!.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            width: rect.width
          };
        });
      setLinkPositions(positions);
    };

    // Calculate positions after content is shown
    if (showContent) {
      setTimeout(calculateLinkPositions, 100);
      window.addEventListener("scroll", calculateLinkPositions);
      window.addEventListener("resize", calculateLinkPositions);
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(transitionTimer);
      clearTimeout(positionTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("scroll", calculateLinkPositions);
      window.removeEventListener("resize", calculateLinkPositions);
    };
  }, [showContent]);

  return (
    <main className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hii I'm DEV</h1>
            <p className="text-xl md:text-2xl text-gray-600">Software Developer</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 transition-opacity duration-700 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: 'none' }}
      >
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <section ref={heroRef} className="mb-12 md:mb-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hii I'm DEV</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">Software Developer</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/projects"
                className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition text-center"
                style={{ pointerEvents: 'auto' }}
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 border border-black text-black rounded-md hover:bg-gray-100 transition text-center"
                style={{ pointerEvents: 'auto' }}
              >
                Contact Me
              </Link>
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
                  <div 
                    ref={el => { projectLinkRefs.current[i - 1] = el; }}
                    className="text-blue-600 text-sm font-medium"
                  >
                    See details →
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Fixed positioned clickable project links */}
      {showContent && linkPositions.map((pos, i) => (
        <Link
          key={i}
          href="/projects"
          className="text-blue-600 text-sm font-medium fixed"
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            width: `${pos.width}px`,
            zIndex: 100,
            pointerEvents: 'auto',
          }}
        >
          See details →
        </Link>
      ))}

      {/* Antigravity Background Effect - On top to capture mouse everywhere */}
      <div className="fixed inset-0 z-50" style={{ pointerEvents: 'auto' }}>
        <Antigravity 
          magnetRadius={17}
          ringRadius={5}
          waveSpeed={0}
          particleSize={0.7}
          color="#1E1F3B"
          autoAnimate={false}
          particleVariance={0.5}
          rotationSpeed={0.2}
          pulseSpeed={0.8}
          fieldStrength={6.4}
        />
      </div>
    </main>
  );
}