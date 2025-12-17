// components/MovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ movie }) => {
  const [imageSrc, setImageSrc] = useState(movie.image);
  const navigate = useNavigate();

  const handleImageError = () => {
    setImageSrc('https://picsum.photos/400/600?random=0');
  };

  

  const handleBuyTickets = () => {
    const path = movie.tag === 'Now Showing'
      ? `/movies/now-showing?movieId=${movie.id}`
      : movie.tag === 'Upcoming'
      ? `/movies/coming-soon?movieId=${movie.id}`
      : `/movies/${movie.id}`;

    navigate(path);
  };

  const handleCardClick = (e) => {
    // If clicked on the Buy Tickets button or its children, don't navigate to details
    if (e.target.closest('button')) return;

    // Otherwise, go to movie details (optional)
    const detailsPath = movie.tag === 'Now Showing'
      ? `/movies/now-showing?movieId=${movie.id}`
      : `/movies/coming-soon?movieId=${movie.id}`;
    navigate(detailsPath);
  };

  return (
    <div
      className="relative w-64 mx-auto group cursor-pointer"
      onClick={handleCardClick} // Click anywhere → go to details
    >
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

        {/* Hover Buy Tickets Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            handleBuyTickets();
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 transition-all duration-300 bg-black/40 backdrop-blur-sm"
        >
          <div className="bg-white text-green-900 py-4 px-8 rounded-full text-lg font-bold shadow-2xl hover:scale-110 transition-all duration-200 border-4 border-green-900">
            Buy Tickets
          </div>
        </button>

        {/* Bottom info section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div
            className="absolute top-0 left-0 right-0 h-px bg-white/60"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 3px, white 3px, white 6px)',
            }}
          />

          <h3 className="text-xl font-bold text-center mb-2 tracking-wider">
            {movie.title}
          </h3>

          <div className="flex justify-center items-center gap-3 text-sm opacity-90">
            <span className="bg-white/20 px-3 py-1 rounded-full">{movie.language || 'Nepali'}</span>
            <span className="text-white/70">•</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">{movie.genre || 'Drama'}</span>
          </div>
        </div>
      </div>

      {/* Advance Label */}
      {movie.tag === 'Upcoming' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg animate-pulse">
          Advance Booking
        </div>
      )}
    </div>
  );
};

export default Card;
