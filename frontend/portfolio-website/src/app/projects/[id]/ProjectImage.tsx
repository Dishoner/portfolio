'use client';

import { useState } from 'react';

interface ProjectImageProps {
  images: string[];
  alt: string;
  previewTextColor: string;
}

export default function ProjectImage({ images, alt, previewTextColor }: ProjectImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(images.length).fill(false));

  // Handle single image or empty array
  if (!images || images.length === 0) {
    return (
      <div 
        className="w-full h-64 rounded-lg flex items-center justify-center border border-gray-600"
        style={{ color: previewTextColor }}
      >
        <p className="text-center px-4">Project preview</p>
      </div>
    );
  }

  // If only one image, show it without carousel controls
  if (images.length === 1) {
    if (imageErrors[0]) {
      return (
        <div 
          className="w-full h-64 rounded-lg flex items-center justify-center border border-gray-600"
          style={{ color: previewTextColor }}
        >
          <p className="text-center px-4">Project preview</p>
        </div>
      );
    }
    return (
      <img 
        src={images[0]} 
        alt={alt}
        className="w-full h-auto rounded-lg object-contain"
        onError={() => {
          const newErrors = [...imageErrors];
          newErrors[0] = true;
          setImageErrors(newErrors);
        }}
      />
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    const newErrors = [...imageErrors];
    newErrors[index] = true;
    setImageErrors(newErrors);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {/* Image Container with Sliding Animation */}
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
        {/* Sliding Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
            width: `${images.length * 100}%`
          }}
        >
          {images.map((image, index) => (
            <div 
              key={index}
              className="h-full flex-shrink-0 flex items-center justify-center"
              style={{ width: `calc(100% / ${images.length})` }}
            >
              {imageErrors[index] ? (
                <div 
                  className="w-full h-full flex items-center justify-center border border-gray-600"
                  style={{ color: previewTextColor }}
                >
                  <p className="text-center px-4">Project preview</p>
                </div>
              ) : (
                <img 
                  src={image} 
                  alt={`${alt} - Image ${index + 1}`}
                  className="w-full h-full object-contain"
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
              aria-label="Previous image"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
              aria-label="Next image"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
