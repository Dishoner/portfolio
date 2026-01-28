"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { projects } from '@/content/projects.json';
import { workExperience } from '@/content/work-experience.json';

// Function to read and sort work experience from JSON
function getWorkExperience() {
  return workExperience
    .slice()
    .sort((a, b) => {
      // Extract number from ID format "PT-{i}"
      const getExperienceNumber = (id: string): number => {
        const match = id.match(/PT-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getExperienceNumber(a.id) - getExperienceNumber(b.id);
    });
}

// Function to highlight programming languages in text
function highlightProgrammingLanguages(text: string) {
  // Common programming languages and technologies to highlight
  const languages = [
    'Python', 'JAVA', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'C++', 'C#', 'C', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'PHP', 'Ruby',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Angular', 'Vue', 'Next.js', 'Express', 'Django', 'Flask', 'Spring',
    'Playwright', 'Selenium', 'Jest', 'Cypress', 'BDD'
  ];
  
  // Sort by length (longest first) to avoid partial matches
  const sortedLanguages = languages.sort((a, b) => b.length - a.length);
  
  // Create regex pattern that matches whole words only
  const pattern = new RegExp(
    `\\b(${sortedLanguages.map(lang => lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );
  
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the matched language in bold
    parts.push(
      <strong key={match.index} className="font-bold">
        {match[0]}
      </strong>
    );
    
    lastIndex = pattern.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? <>{parts}</> : text;
}

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

  const handleDownloadResume = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${baseURL}/api/resume`);
      
      // Get status code from response
      const statusCode = response.status;
      const statusCodeHeader = response.headers.get('X-Status-Code');
      
      console.log('Resume API Response:', {
        statusCode,
        statusCodeFromHeader: statusCodeHeader,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download resume. Status code: ${statusCode}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Dev Swami.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again later.');
    }
  };

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
            <p className="text-xl md:text-2xl text-[#F0F0F0]">&lt;&gt; Software Developer &lt;/&gt;</p>
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
            <p className="text-xl md:text-2xl text-[#F0F0F0] mb-8">&lt;&gt; Software Developer &lt;/&gt;</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={handleDownloadResume}
                className="w-full sm:w-auto px-6 py-3 rounded-md transition-all duration-200 ease-in-out text-center font-bold text-[#000000] bg-[#B0A6A4] hover:bg-[#BFBFBF] hover:scale-105 active:scale-95"
              >
                Download Resume 📃
              </button>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-md transition-all duration-200 ease-in-out text-center font-bold text-[#000000] bg-[#B0A6A4] hover:bg-[#BFBFBF] hover:scale-105 active:scale-95"
              >
                Contact Me 📞
              </Link>
            </div>
          </section>

          {/* Work Experience Section */}
          <section className="mb-16" style={{ isolation: 'isolate' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Work Experience</h2>
            <div className="max-w-4xl mx-auto space-y-8">
              {getWorkExperience().map((experience) => (
                <div key={experience.id} className="relative flex">
                  {/* Left Part - 25% width */}
                  <div className="w-1/4 pr-4">
                    <p className="text-[#B0A6A4] font-medium text-base">{experience.company_name}</p>
                  </div>
                  
                  {/* Vertical Divider Line at 25% */}
                  <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-200"></div>
                  
                  {/* Right Part - 75% width */}
                  <div className="w-3/4 pl-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{experience.position}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mt-2 md:mt-0">{experience.duration}</p>
                    </div>
                    <p className="text-gray-300 mb-4">{experience.description}</p>
                    {experience.projects && experience.projects.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-200 mb-2">Key Projects & Achievements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          {experience.projects.map((project, index) => (
                            <li key={index} className="text-sm">{highlightProgrammingLanguages(project)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Separation Line */}
          <div className="max-w-4xl mx-auto mb-16">
            <hr className="border-gray-600" />
          </div>

          {/* Preview of Projects */}
          <section className="mb-16" style={{ isolation: 'isolate' }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {projects
                .slice()
                .sort((a, b) => {
                  // Extract number from ID format "PJ-{i}"
                  const getProjectNumber = (id: string): number => {
                    const match = id.match(/PJ-(\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                  };
                  return getProjectNumber(a.id) - getProjectNumber(b.id);
                })
                .slice(0, 2)
                .map((project) => (
                <div key={project.id} className="border border-gray-200 p-6 rounded-lg" style={{ position: 'relative' }}>
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.ShortDiscription}
                  </p>
                  <Link href={`/projects/${project.id}`}>
                    <button 
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                    >
                      See details →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/projects"
                className="px-6 py-3 rounded-md transition-all duration-200 ease-in-out text-center font-bold text-[#000000] bg-[#B0A6A4] hover:bg-[#BFBFBF] hover:scale-105 active:scale-95"
              >
                More Projects
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
