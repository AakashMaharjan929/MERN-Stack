// components/Banner.jsx - Ensured "Buy Now" text is perfectly centered in button
// Updated: Added left and right navigation arrows for manual carousel control
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx'; // Optional: For clean className merging; npm i clsx

const Banner = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const bannerContent = [
    { 
      title: "जारि२", // Re-added title (Jaari 2)
      tag: "Now Showing",
      ctaText: "in Cinemas",  // Simplified CTA
      link: "/movies/now-showing",
      date: "Kartik 29 | 7 NOV",
      image: "https://picsum.photos/1920/400?random=1" // Replace with actual poster URL
    },
    // Add more slides with similar structure...
    { 
      title: "Wicked 2: For Good",
      tag: "Now Showing",
      ctaText: "in Cinemas",
      link: "/movies/now-showing",
      date: "November 21",
      image: "https://picsum.photos/1920/400?random=2" 
    },
    // ... (extend for other entries)
  ];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerContent.length);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bannerContent.length]);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerContent.length);
    }, 3000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerContent.length) % bannerContent.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerContent.length);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://picsum.photos/1920/400?random=0';
  };

  const currentSlide = bannerContent[currentIndex];

  return (
    <div 
      className={clsx('relative overflow-hidden w-full h-full', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full w-full">
        {/* Carousel Slides */}
        <div className="flex transition-transform duration-500 ease-in-out h-full w-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {bannerContent.map((item, index) => (
            <div key={index} className="w-full relative flex-shrink-0 h-full">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={handleImageError}
              />
              {/* Bottom-only overlay for true bottom alignment */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                {/* Bottom Layout: Flex row for left/right positioning */}
                <div className="flex justify-between items-end w-full max-w-7xl mx-auto">  {/* Constrain width for text; no fixed h */}
                  {/* Lower Left: Title + Now Showing Tag (plain text) + CTA + Buy Now Button */}
                  <div className="flex flex-col text-left text-white drop-shadow-lg space-y-1">
                    <h2 className="text-6xl md:!text-5xl font-bold tracking-wide leading-tight">
                      {item.title}
                    </h2>
                    {/* Now Showing as plain text, no background */}
                    <p className="text-base md:text-lg font-semibold text-green-400">
                      {item.tag}
                    </p>
                    <p className="text-sm md:text-base font-medium">{item.ctaText}</p>
                    {/* Buy Now Button - A little bigger sizing, with explicit text centering and improved typography for better UI/UX */}
                    <Link 
                      to={item.link} 
                      className="inline-flex w-36 md:w-48 h-16 md:h-20 bg-green-600 hover:bg-green-700 text-white rounded-md text-2xl md:text-3xl font-semibold tracking-wide flex-1 items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                    >
                      Buy Now
                    </Link>
                  </div>

                  {/* Lower Right: Date only */}
                  <div className="text-right text-white drop-shadow-lg">
                    <p className="text-xs md:text-sm font-light">
                      {item.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-20 opacity-80 hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-20 opacity-80 hover:opacity-100"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enhanced Pagination Dots - Centered bottom, with subtle glow */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {bannerContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1} of ${bannerContent.length}`}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-green-400 scale-150 shadow-lg shadow-green-500/50' 
                  : 'bg-white/60 hover:bg-white hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;