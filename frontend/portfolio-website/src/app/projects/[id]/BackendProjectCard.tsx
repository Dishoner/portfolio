'use client';

import { useMotionValue } from "motion/react";
import { useState, useRef, useCallback } from "react";
import { useMotionTemplate, motion } from "motion/react";

interface BackendProjectCardTextConfig {
  color: string;
  fontSize: string;
  fontWeight: string;
  textAlign: string;
  padding: string;
  backgroundOpacity: number;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientRadius: number;
  gradientBrightness: number;
}

interface BackendProjectCardProps {
  text: string;
  textConfig: BackendProjectCardTextConfig;
}

export default function BackendProjectCard({ text, textConfig }: BackendProjectCardProps) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState(() => generateRandomString(5000));
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number } | null>(null);
  const lastStringUpdateRef = useRef(0);
  const throttleDelay = 150; // Update string every 150ms max

  // Cache bounding rect and only recalculate when needed
  const updateRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top };
    }
  }, []);

  const onMouseMove = useCallback(({ clientX, clientY }: any) => {
    if (!rectRef.current && containerRef.current) {
      updateRect();
    }
    
    if (rectRef.current) {
      mouseX.set(clientX - rectRef.current.left);
      mouseY.set(clientY - rectRef.current.top);
    }

    // Throttle random string generation to reduce performance impact
    const now = Date.now();
    if (now - lastStringUpdateRef.current > throttleDelay) {
      setRandomString(generateRandomString(5000));
      lastStringUpdateRef.current = now;
    }
  }, [mouseX, mouseY, updateRect]);

  let maskImage = useMotionTemplate`radial-gradient(${textConfig.gradientRadius}px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden relative">
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseEnter={updateRect}
        className="group/card rounded-lg w-full h-full relative overflow-hidden"
        style={{ 
          backgroundColor: textConfig.backgroundColor,
          '--brightness': textConfig.gradientBrightness
        } as React.CSSProperties & { '--brightness': number }}
      >
        {/* Background Effect Layer - Full container coverage */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Gradient mask overlay */}
          <div className="absolute inset-0 rounded-lg [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
          
          {/* Animated gradient background - using CSS hover like evervault-card */}
          <motion.div
            className="absolute inset-0 rounded-lg backdrop-blur-xl opacity-0 group-hover/card:opacity-[var(--brightness)] transition duration-500"
            style={{
              ...style,
              background: `linear-gradient(to right, ${textConfig.gradientFrom}, ${textConfig.gradientTo})`,
            }}
          />
          
          {/* Random string overlay - using CSS hover like evervault-card */}
          <motion.div
            className="absolute inset-0 rounded-lg mix-blend-overlay opacity-0 group-hover/card:opacity-[var(--brightness)] transition duration-500"
            style={style}
          >
            <p className="absolute inset-0 w-full h-full text-xs break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500 p-4 overflow-hidden">
              {randomString}
            </p>
          </motion.div>
        </div>

        {/* Foreground Text Layer - Centered and readable */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className={`relative ${textConfig.padding} rounded-full`}>
            <div 
              className="absolute inset-0 w-full h-full dark:bg-black/[0.8] blur-sm rounded-full"
              style={{ backgroundColor: `rgba(255, 255, 255, ${textConfig.backgroundOpacity})` }}
            ></div>
            <p 
              className={`relative ${textConfig.textAlign} ${textConfig.fontSize} ${textConfig.fontWeight}`}
              style={{ color: textConfig.color }}
            >
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomString(length: number) {
  // Use Array and join for better performance
  const chars = Array.from({ length }, () => 
    characters[Math.floor(Math.random() * characters.length)]
  );
  return chars.join('');
}
