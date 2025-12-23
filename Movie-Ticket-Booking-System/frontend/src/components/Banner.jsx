// components/Banner.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isEmpty = movies.length === 0;
  // Use only first 4 now-showing movies
  const featuredMovies = movies.slice(0, 4);

  // Auto-play (disabled on mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsAutoPlay(!isMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlay || featuredMovies.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, featuredMovies.length]);

  const goPrev = () => {
    if (featuredMovies.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };
  const goNext = () => {
    if (featuredMovies.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };
  const goToSlide = (index) => {
    if (featuredMovies.length === 0) return;
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => touchStartX.current = e.touches[0].clientX;
  const handleTouchMove = (e) => touchEndX.current = e.touches[0].clientX;
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    touchStartX.current = touchEndX.current = 0;
  };

  if (isEmpty) {
    return (
      <div className="relative w-full h-screen md:h-[85vh] bg-gray-900 flex items-center justify-center text-white">
        <p className="text-3xl">No featured movies available</p>
      </div>
    );
  }

  const current = featuredMovies[currentIndex % featuredMovies.length];

  // Build full image URL (same as in Card)
  const getImageUrl = (filename) => {
    if (!filename) return 'https://picsum.photos/1920/1080?random=' + currentIndex;
    return `${import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000'}/posters/${filename}`;
  };

  const bannerImage = getImageUrl(current.bannerPoster || current.profilePoster);

  return (
    <div
      className="relative w-full h-screen md:h-[85vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(window.innerWidth >= 768)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredMovies.map((movie, index) => {
          const imgUrl = getImageUrl(movie.bannerPoster || movie.profilePoster);
          return (
            <div key={movie._id} className="w-full flex-shrink-0 relative h-full">
              <img
                src={imgUrl}
                alt={`Banner for ${movie.title}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end pb-10 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex justify-between items-end">
          <div className="text-white max-w-2xl">
            {/* Formats (optional - you can add later) */}
            <div className="flex gap-3 mb-4">
              <span className="px-3 py-1.5 text-xs font-bold bg-yellow-400 text-black rounded uppercase">
                {current.language || 'Nepali'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-3 drop-shadow-2xl">
              {current.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8">
              In Cinemas Now • Book your tickets today!
            </p>

            {/* BOOK TICKETS BUTTON */}
            <Link
              to={`/movies/now-showing?movieId=${current._id}`}
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold text-lg md:text-xl px-10 py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-green-500/50"
            >
              Book Tickets
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-3xl font-bold text-white opacity-90">Now Showing</p>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={goPrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-4 rounded-full z-10 transition">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={goNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-4 rounded-full z-10 transition">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              currentIndex === index
                ? 'w-12 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50'
                : 'w-3 h-3 bg-white/60 hover:bg-white rounded-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;