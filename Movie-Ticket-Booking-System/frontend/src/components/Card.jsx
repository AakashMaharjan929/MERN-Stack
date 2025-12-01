// components/MovieCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Card = ({ movie }) => {
  const [imageSrc, setImageSrc] = useState(movie.image);
  const navigate = useNavigate();
  const handleImageError = () => {
    setImageSrc('https://picsum.photos/400/600?random=0');
  };

  const handleBuyTickets = (e) => {
    e.preventDefault(); // Prevent Link navigation if wrapped
    // Updated to navigate to movie details page instead of booking for testing
    const detailsPath = movie.tag === 'Now Showing' 
      ? `/movies/now-showing?movieId=${movie.id}` 
      : movie.tag === 'Upcoming' 
      ? `/movies/coming-soon?movieId=${movie.id}` 
      : `/movies/${movie.id}`;
    navigate(detailsPath);
  };

  const getDetailsPath = () => {
    if (movie.tag === 'Now Showing') {
      return `/movies/now-showing?movieId=${movie.id}`;
    } else if (movie.tag === 'Upcoming') {
      return `/movies/coming-soon?movieId=${movie.id}`;
    }
    return `/movies/${movie.id}`; // Fallback
  };

  return (
    <div className="relative w-64 mx-auto group">
      {/* Outer ticket shape */}
      <div
        className="relative bg-white shadow-xl overflow-hidden group-hover:shadow-2xl transition-all duration-300"
        style={{
          height: '28rem',
          borderRadius: '20px',
          clipPath: `path('M0,20 
            Q0,0 20,0 
            H100 
            A12,12 0 0 1 112,12 
            A12,12 0 0 1 124,0 
            H244 
            Q264,0 264,20 
            V120 
            A12,12 0 0 0 252,132 
            A12,12 0 0 0 264,144 
            V420 
            Q264,440 244,440 
            H124 
            A12,12 0 0 1 112,428 
            A12,12 0 0 1 100,440 
            H20 
            Q0,440 0,420 Z')`,
        }}
      >
        {/* Background image */}
        <img
          src={imageSrc}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
          loading="eager"
        />

        {/* Hover Buy Tickets overlay - Now navigates to details */}
        <button
          onClick={handleBuyTickets}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 transition-all duration-300 bg-transparent border-0 cursor-pointer"
        >
          <div className="bg-white/90 backdrop-blur-md text-green-900 py-3 px-6 rounded-full text-sm font-bold shadow-lg hover:bg-white hover:scale-105 transition-all duration-200">
            Buy Tickets
          </div>
        </button>

        {/* Optional: Separate link for details if needed, e.g., click on image */}
        <Link
          to={getDetailsPath()}
          className="absolute inset-0 z-10"
          onClick={(e) => {
            // If clicking near the button, don't navigate to details
            const button = e.currentTarget.querySelector('button');
            if (button && button.contains(e.target)) {
              e.preventDefault();
            }
          }}
        />

        {/* Bottom info section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 bg-gradient-to-t from-green-900 via-green-800 to-green-700">
          {/* Perforated effect line */}
          <div
            className="absolute top-0 left-0 right-0 h-px bg-white/60"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 3px, white 3px, white 6px)',
            }}
          ></div>

          {/* Movie title */}
          <h3 className="text-lg font-bold text-center mb-1">
            {movie.title}
          </h3>

          {/* Language and genre */}
          <div className="flex justify-center items-center space-x-1 text-sm opacity-80">
            <span>{movie.language || 'Nepali'}</span>
            <span>|</span>
            <span>{movie.genre || 'Drama'}</span>
          </div>
        </div>
      </div>

      {/* “Advance” label at the top - only for Upcoming */}
      {movie.tag === 'Upcoming' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-cyan-700 text-white px-3 py-1 text-xs font-semibold rounded-b-md shadow-md">
          Advance
        </div>
      )}
    </div>
  );
};

export default Card;