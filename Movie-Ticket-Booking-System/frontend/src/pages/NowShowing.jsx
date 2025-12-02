import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Duplicate the NOW_SHOWING_MOVIES data here for client-side access (in a real app, fetch from API or use context)
const NOW_SHOWING_MOVIES = [
  {
    id: 1,
    title: "जारि२",
    tag: "Now Showing",
    date: "Kartik 29 | 7 NOV",
    image: "https://picsum.photos/300/400?random=1",
    language: "Nepali",
    genre: "Thriller",
    synopsis: "A thrilling sequel to the blockbuster Jaari."
  },
  {
    id: 2,
    title: "Wicked 2: For Good",
    tag: "Now Showing",
    date: "November 21",
    image: "https://picsum.photos/300/400?random=2",
    language: "English",
    genre: "Fantasy Musical",
    synopsis: "The magical journey continues in this epic tale."
  },
  {
    id: 3,
    title: "माया",
    tag: "Now Showing",
    date: "Kartik 15 | 31 OCT",
    image: "https://picsum.photos/300/400?random=5",
    language: "Nepali",
    genre: "Romance",
    synopsis: "A heartfelt story of love and loss in the Himalayas."
  },
  {
    id: 4,
    title: "Deadpool & Wolverine",
    tag: "Now Showing",
    date: "October 10",
    image: "https://picsum.photos/300/400?random=6",
    language: "English",
    genre: "Action Comedy",
    synopsis: "The Merc with a Mouth teams up with the Clawed Mutant."
  },
  {
    id: 5,
    title: "काला",
    tag: "Now Showing",
    date: "November 5",
    image: "https://picsum.photos/300/400?random=7",
    language: "Nepali",
    genre: "Action",
    synopsis: "A tale of revenge and redemption in rural Nepal."
  },
  {
    id: 11,
    title: "The Enchanted Forest",
    tag: "Now Showing",
    date: "November 12",
    image: "https://picsum.photos/300/400?random=11",
    language: "English",
    genre: "Fantasy",
    synopsis: "A magical journey through an enchanted forest."
  },
  {
    id: 12,
    title: "दिलको कुरा",
    tag: "Now Showing",
    date: "Mangsir 1 | 17 NOV",
    image: "https://picsum.photos/300/400?random=12",
    language: "Nepali",
    genre: "Drama",
    synopsis: "A touching story about family and relationships."
  },
  {
    id: 13,
    title: "Space Odyssey",
    tag: "Now Showing",
    date: "December 1",
    image: "https://picsum.photos/300/400?random=13",
    language: "English",
    genre: "Sci-Fi",
    synopsis: "An epic adventure through space and time."
  },
  {
    id: 14,
    title: "सपनाको शहर",
    tag: "Now Showing",
    date: "Poush 5 | 20 DEC",
    image: "https://picsum.photos/300/400?random=14",
    language: "Nepali",
    genre: "Romance",
    synopsis: "A romantic tale set in the bustling city of Kathmandu."
  },
  {
    id: 15,
    title: "The Last Samurai",
    tag: "Now Showing",
    date: "November 25",
    image: "https://picsum.photos/300/400?random=15",
    language: "English",
    genre: "Action Drama",
    synopsis: "A warrior's journey in feudal Japan."
  }
];

// Mock data for booking flow (in real app, fetch from API based on movie/date/cinema/etc.)
const MOCK_BOOKING_DATA = {
  dates: ['Today', 'Tomorrow', 'Kartik 29 | 7 NOV', 'November 21', 'Kartik 15 | 31 OCT'], // Example dates
  cinemas: [
    { id: 1, name: 'Kathmandu Cineplex', location: 'Kathmandu' },
    { id: 2, name: 'Big Cinema', location: 'Lalitpur' },
    { id: 3, name: 'Roxy Theatre', location: 'Pokhara' }
  ],
  languages: [
    { id: 1, name: 'Nepali (Original)', code: 'np' },
    { id: 2, name: 'English (Subtitled)', code: 'en-sub' },
    { id: 3, name: 'Hindi Dubbed', code: 'hi-dub' }
  ],
  times: { // Mock times per cinema/language combo
    'Kathmandu Cineplex': { 'np': ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM'], 'en-sub': ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'], 'hi-dub': ['12:00 PM', '3:00 PM', '6:00 PM'] },
    'Big Cinema': { 'np': ['9:30 AM', '12:30 PM', '3:30 PM', '6:30 PM'], 'en-sub': ['10:30 AM', '1:30 PM', '4:30 PM', '7:30 PM'], 'hi-dub': ['11:30 AM', '2:30 PM', '5:30 PM'] },
    'Roxy Theatre': { 'np': ['11:00 AM', '2:00 PM', '5:00 PM'], 'en-sub': ['12:00 PM', '3:00 PM', '6:00 PM'], 'hi-dub': ['1:00 PM', '4:00 PM', '7:00 PM'] }
  },
  seats: [ // Mock 5x5 seat grid, 0=available, 1=booked
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0]
  ]
};

const STEPS = ['Date', 'Cinema', 'Language', 'Time', 'Seats', 'Complete'];

const NowShowing = () => {
  const [searchParams] = useSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Booking states
  const [currentStep, setCurrentStep] = useState(0); // Start with 0 to show form by default
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const movieId = searchParams.get('movieId');

  useEffect(() => {
    if (movieId) {
      const parsedId = parseInt(movieId);
      const foundMovie = NOW_SHOWING_MOVIES.find(m => m.id === parsedId);
      if (foundMovie) {
        setMovie(foundMovie);
      } else {
        toast.error('Movie not found!');
        navigate('/');
      }
    } else {
      navigate('/');
    }
    setLoading(false);
  }, [movieId, navigate]);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    nextStep();
  };

  const selectCinema = (cinema) => {
    setSelectedCinema(cinema);
    nextStep();
  };

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    nextStep();
  };

  const selectTime = (time) => {
    setSelectedTime(time);
    nextStep();
  };

  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    const seatIndex = selectedSeats.findIndex(s => s === seatId);
    if (seatIndex !== -1) {
      setSelectedSeats(prev => prev.filter((_, idx) => idx !== seatIndex));
    } else if (selectedSeats.length < 10) {
      setSelectedSeats(prev => [...prev, seatId]);
    } else {
      toast.warn('Maximum 10 seats allowed.');
    }
  };

  const completeBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat.');
      return;
    }
    const pricePerSeat = 500; // Mock price
    const total = selectedSeats.length * pricePerSeat;
    setTotalPrice(total);
    // Save to localStorage for MyTickets
    const booking = {
      movie: movie.title,
      date: selectedDate,
      cinema: selectedCinema,
      language: selectedLanguage,
      time: selectedTime,
      seats: selectedSeats,
      total
    };
    localStorage.setItem('latestBooking', JSON.stringify(booking));
    toast.success(`Booking confirmed! Total: NPR ${total}. Check My Tickets.`);
    setCurrentStep(5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-xl drop-shadow-lg">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-white text-xl drop-shadow-lg">No movie selected. <button onClick={() => navigate('/')} className="text-green-400 underline">Go to Home</button></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <Navbar />

      {/* Movie Details Content */}
      <main className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
          >
            ← Back to Home
          </button>

          {/* Movie Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="relative">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/400/600?random=0';
                }}
              />
            </div>
            <div className="text-white space-y-4">
              <h1 className="text-4xl font-bold drop-shadow-lg">{movie.title}</h1>
              <div className="space-y-2">
                <p className="text-lg"><span className="font-semibold">Release Date:</span> {movie.date}</p>
                <p className="text-lg"><span className="font-semibold">Language:</span> {movie.language}</p>
                <p className="text-lg"><span className="font-semibold">Genre:</span> {movie.genre}</p>
              </div>
              <p className="text-lg drop-shadow-lg">{movie.synopsis}</p>
            </div>
          </div>

          {/* Booking Flow - Shown by default */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            {/* Progress Bar */}
            <div className="flex justify-between mb-8 text-white text-sm font-semibold">
              {STEPS.map((step, idx) => (
                <div key={idx} className={`flex-1 text-center ${
                  idx < currentStep ? 'text-green-400' : idx === currentStep ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step}
                  {idx < STEPS.length - 1 && <span className="mx-2">&gt;</span>}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="text-white">
              {/* Step 0: Select Date */}
              {currentStep === 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Date</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {MOCK_BOOKING_DATA.dates.map((date, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectDate(date)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          selectedDate === date
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-transparent border-white/50 hover:border-green-400'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Select Cinema */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Cinema</h3>
                  <div className="space-y-3">
                    {MOCK_BOOKING_DATA.cinemas.map((cinema) => (
                      <button
                        key={cinema.id}
                        onClick={() => selectCinema(cinema.name)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          selectedCinema === cinema.name
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-transparent border-white/50 hover:border-green-400'
                        }`}
                      >
                        <div className="font-semibold">{cinema.name}</div>
                        <div className="text-sm opacity-75">{cinema.location}</div>
                      </button>
                    ))}
                  </div>
                  <button onClick={prevStep} className="mt-4 text-green-400 underline">← Back</button>
                </div>
              )}

              {/* Step 2: Select Language/Version */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Language/Version</h3>
                  <div className="space-y-3">
                    {MOCK_BOOKING_DATA.languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => selectLanguage(lang.name)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          selectedLanguage === lang.name
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-transparent border-white/50 hover:border-green-400'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                  <button onClick={prevStep} className="mt-4 text-green-400 underline">← Back</button>
                </div>
              )}

              {/* Step 3: Select Time */}
              {currentStep === 3 && selectedCinema && selectedLanguage && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Showtime</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {MOCK_BOOKING_DATA.times[selectedCinema]?.[selectedLanguage.split(' (')[0].toLowerCase().replace(' ', '-')]?.map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectTime(time)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          selectedTime === time
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-transparent border-white/50 hover:border-green-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button onClick={prevStep} className="mt-4 text-green-400 underline">← Back</button>
                </div>
              )}

              {/* Step 4: Select Seats */}
              {currentStep === 4 && selectedTime && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Select Seats (Max 10)</h3>
                  <div className="mb-4">
                    <p className="text-sm opacity-75 mb-2">Selected: {selectedSeats.length} seats</p>
                    <div className="grid grid-cols-5 gap-1 bg-gray-800 p-4 rounded-lg max-w-xs mx-auto">
                      {MOCK_BOOKING_DATA.seats.map((row, rowIdx) =>
                        row.map((seat, colIdx) => {
                          const seatId = `${rowIdx}-${colIdx}`;
                          const isSelected = selectedSeats.includes(seatId);
                          const isBooked = seat === 1;
                          return (
                            <button
                              key={seatId}
                              onClick={() => !isBooked && toggleSeat(rowIdx, colIdx)}
                              disabled={isBooked}
                              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                                isBooked
                                  ? 'bg-gray-600 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                              }`}
                            >
                              {String.fromCharCode(65 + rowIdx)}{colIdx + 1}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <button
                    onClick={completeBooking}
                    disabled={selectedSeats.length === 0}
                    className={`w-full py-3 px-6 rounded-md text-lg font-semibold transition-colors ${
                      selectedSeats.length === 0
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    Proceed to Payment (NPR {selectedSeats.length * 500})
                  </button>
                  <button onClick={prevStep} className="mt-4 text-green-400 underline">← Back</button>
                </div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 5 && (
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-4">Booking Complete!</h3>
                  <p className="mb-4">Your tickets have been added to My Tickets.</p>
                  <div className="space-y-2 text-sm opacity-75 mb-6">
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Cinema:</strong> {selectedCinema}</p>
                    <p><strong>Language:</strong> {selectedLanguage}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                    <p><strong>Total:</strong> NPR {totalPrice}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setSelectedDate('');
                      setSelectedCinema('');
                      setSelectedLanguage('');
                      setSelectedTime('');
                      setSelectedSeats([]);
                      setTotalPrice(0);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold transition-colors"
                  >
                    Book Another
                  </button>
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold transition-colors"
                  >
                    View My Tickets
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Sections (e.g., Showtimes, Cast - placeholders) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Showtimes</h3>
              <ul className="space-y-2">
                <li>10:00 AM - Kathmandu Cineplex</li>
                <li>1:00 PM - Big Cinema</li>
                <li>4:00 PM - Roxy Theatre</li>
                <li>7:00 PM - Kathmandu Cineplex</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Cast & Crew</h3>
              <ul className="space-y-1 text-sm">
                <li>Director: John Doe</li>
                <li>Lead Actor: Jane Smith</li>
                <li>Supporting: Bob Johnson</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Ratings</h3>
              <p className="text-2xl font-bold">★★★★☆ (4.2/5)</p>
              <p className="text-sm opacity-75">Based on 1,234 reviews</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NowShowing;