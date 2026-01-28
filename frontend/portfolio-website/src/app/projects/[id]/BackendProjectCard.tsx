'use client';

import { useMotionValue } from "motion/react";
import { useState, useEffect } from "react";
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

  // Initialize random string immediately, not in useEffect
  const [randomString, setRandomString] = useState(() => generateRandomString(5000));
  const [isHovered, setIsHovered] = useState(false);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    // Generate new string on mouse move (throttled by React's batching)
    setRandomString(generateRandomString(5000));
  }

  let maskImage = useMotionTemplate`radial-gradient(${textConfig.gradientRadius}px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden relative">
      <div
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group/card rounded-lg w-full h-full relative overflow-hidden"
        style={{ backgroundColor: textConfig.backgroundColor }}
      >
        {/* Background Effect Layer - Full container coverage */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Gradient mask overlay */}
          <div className="absolute inset-0 rounded-lg [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
          
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 rounded-lg backdrop-blur-xl transition-opacity duration-500"
            style={{
              ...style,
              background: `linear-gradient(to right, ${textConfig.gradientFrom}, ${textConfig.gradientTo})`,
              opacity: isHovered ? textConfig.gradientBrightness : 0
            }}
          />
          
          {/* Random string overlay - fills entire container */}
          <motion.div
            className="absolute inset-0 rounded-lg mix-blend-overlay transition-opacity duration-500"
            style={{
              ...style,
              opacity: isHovered ? textConfig.gradientBrightness : 0
            }}
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
