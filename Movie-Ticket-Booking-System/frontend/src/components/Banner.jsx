// components/MovieHeroCarousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = ({ className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      id: 1,
      title: "जारि २",
      language: "Nepali",
      formats: ["2D", "4K"],
      price: "From ₹199",
      showtime: "Earliest: 6:30 PM",
      releaseDate: "In Cinemas Now",
      image: "https://picsum.photos/1920/1080?random=10",
      link: "/movie/jaari-2",
    },
    {
      id: 2,
      title: "Wicked: For Good",
      language: "English",
      formats: ["IMAX", "4DX"],
      price: "From ₹399",
      showtime: "Earliest: 7:00 PM",
      releaseDate: "November 21",
      image: "https://picsum.photos/1920/1080?random=11",
      link: "/movie/wicked-2",
    },
    {
      id: 3,
      title: "Captain America: Brave New World",
      language: "English • Hindi • Tamil • Telugu",
      formats: ["IMAX 3D"],
      price: "From ₹349",
      showtime: "Earliest: 8:15 PM",
      releaseDate: "February 14, 2025",
      image: "https://picsum.photos/1920/1080?random=12",
      link: "/movie/captain-america",
    },
  ];

  // Auto-play logic (disabled on mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsAutoPlay(!isMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, slides.length]);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const goToSlide = (index) => setCurrentIndex(index);

  // Touch swipe
  const handleTouchStart = (e) => touchStartX.current = e.touches[0].clientX;
  const handleTouchMove = (e) => touchEndX.current = e.touches[0].clientX;
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    touchStartX.current = touchEndX.current = 0;
  };

  const current = slides[currentIndex];

  return (
    <div
      className={`relative w-full h-screen md:h-[85vh] overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(window.innerWidth >= 768)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Featured movies carousel"
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative h-full">
            {index === 0 && <link rel="preload" as="image" href={slide.image} />}
            <img
              src={slide.image}
              alt={`Poster for ${slide.title}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-16">
              <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-end">
                {/* Left Side */}
                <div className="text-white max-w-2xl">
                  <div className="flex gap-3 mb-4">
                    {slide.formats.map((f) => (
                      <span key={f} className="px-3 py-1.5 text-xs font-bold bg-yellow-400 text-black rounded uppercase">
                        {f}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-3 drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-gray-200 mb-3">{slide.language}</p>

                  <div className="flex items-center gap-6 text-base md:text-lg mb-8">
                    <span className="text-green-400 font-bold">{slide.price}</span>
                    <span className="text-gray-300">• {slide.showtime}</span>
                  </div>

                  {/* GREEN BOOK TICKETS BUTTON */}
                  <Link
                    to={slide.link}
                    className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold text-lg md:text-xl px-10 py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-green-500/50"
                  >
                    Book Tickets
                    <ChevronRight className="w-6 h-6" />
                  </Link>
                </div>

                {/* Right Side - Release Date */}
                <div className="hidden md:block text-right">
                  <p className="text-3xl font-bold text-white opacity-90">{slide.releaseDate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button onClick={goPrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-4 rounded-full z-10 transition">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={goNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-4 rounded-full z-10 transition">
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* GREEN PAGINATION DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              currentIndex === index
                ? 'w-12 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50'
                : 'w-3 h-3 bg-white/60 hover:bg-white rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;