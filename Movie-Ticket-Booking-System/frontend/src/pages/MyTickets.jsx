import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import Barcode from 'react-barcode';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Barcode error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-600 text-sm">
          <strong>Barcode failed to load</strong>
          <p className="mt-1">Use download to view code: {this.props.fallbackValue}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MyTickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // New: Upcoming / Past tabs
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // If no token, definitely not logged in
  if (!token) {
    toast.info('Please log in to view your tickets');
    navigate('/login');
    return;
  }

  // If no stored user data, try to fetch fresh profile (optional, if you have /me endpoint)
  // Or just redirect to login safely
  if (!storedUser) {
    console.log('No stored user, but have token - will try to load tickets anyway');
    // Don't redirect immediately - try to fetch tickets first
    setLoading(true);
    
    const fetchTicketsWithoutUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/payment/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.tickets)) {
          setTickets(res.data.tickets);
          setLoading(false);
          // Success - tickets loaded, user can stay on page
          return;
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      }
      
      // Only redirect if tickets couldn't be loaded
      setLoading(false);
      toast.info('Session expired. Please log in again.');
      navigate('/login');
    };
    
    fetchTicketsWithoutUser();
    return;
  }

  let parsedUser;
  try {
    parsedUser = JSON.parse(storedUser);
    console.log('Parsed user from localStorage:', parsedUser);
    // Basic validation: user should be an object
    if (!parsedUser || typeof parsedUser !== 'object') {
      throw new Error('Invalid user data structure');
    }
    setUser(parsedUser);
  } catch (err) {
    console.warn('Invalid user data in localStorage:', err);
    // Don't redirect immediately - try to load tickets with just the token
    console.log('User data invalid, but trying to load tickets anyway with token');
    
    const fetchTicketsWithoutValidUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/payment/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.tickets)) {
          setTickets(res.data.tickets);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      }
      
      // Only redirect if tickets couldn't be loaded
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.info('Session issue detected. Please log in again.');
      navigate('/login');
    };
    
    fetchTicketsWithoutValidUser();
    return;
  }

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${baseUrl}/payment/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && Array.isArray(res.data.tickets)) {
        setTickets(res.data.tickets);
      } else {
        setTickets([]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.clear(); // or remove token/user
        navigate('/login');
      } else {
        console.error(err);
        toast.error('Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchTickets();
}, [navigate]);
  // Determine if a ticket is upcoming using real show start time and status
  const isUpcoming = (ticket) => {
    if (ticket.showStatus === 'Completed') return false;
    if (ticket.showStatus === 'Live') return true;

    const start = ticket.showStartTimeISO ? new Date(ticket.showStartTimeISO) : null;
    if (!start || isNaN(start.getTime())) return true;
    return start >= new Date();
  };

  const upcomingTickets = tickets.filter(isUpcoming);
  const pastTickets = tickets.filter((t) => !isUpcoming(t));

  const downloadTicket = async (ticket) => {
    const element = document.getElementById(`ticket-${ticket.id}`);
    if (!element) {
      toast.error('Ticket not found');
      return;
    }

    const buttons = element.querySelectorAll('button');
    buttons.forEach((btn) => (btn.style.display = 'none'));

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedTicket = clonedDoc.getElementById(`ticket-${ticket.id}`);
          if (clonedTicket) {
            clonedTicket.style.backgroundColor = '#ffffff';

            clonedTicket.querySelector('h2')?.style.setProperty('color', '#ea580c', 'important');

            clonedTicket.querySelectorAll('*').forEach((el) => {
              if (el.style.color?.includes('oklch')) {
                el.style.color = '#000000';
              }
            });

            const svg = clonedTicket.querySelector('svg');
            if (svg) {
              svg.style.backgroundColor = '#ffffff';
              svg.querySelectorAll('rect, path').forEach((el) => {
                const currentFill = el.getAttribute('fill');
                if (currentFill && currentFill !== 'none' && currentFill !== '#ffffff') {
                  el.setAttribute('fill', '#000000');
                } else {
                  el.setAttribute('fill', 'none');
                }
                el.style.stroke = '#000000';
              });
            }
          }
        },
      });

      const pdf = new jsPDF('p', 'mm', [105, 148]);
      const imgWidth = 95;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (105 - imgWidth) / 2;
      const y = imgHeight > 138 ? 5 : (148 - imgHeight) / 2;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${ticket.movieTitle.replace(/[^a-zA-Z0-9]/g, '_')}-ticket.pdf`);

      toast.success('Ticket downloaded successfully! Ready for print.');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      buttons.forEach((btn) => (btn.style.display = ''));
    }
  };

  const cancelTicket = async (ticketId) => {
    setCancellingId(ticketId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${baseUrl}/payment/${ticketId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success('Ticket cancelled successfully. Refund will be processed soon.');
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      } else {
        toast.error(res.data.message || 'Cancellation failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancellingId(null);
    }
  };

  const handleBrowseMovies = () => navigate('/');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Loading your tickets...</p>
      </div>
    );
  }

  // Allow rendering even without user data if tickets are loaded
  const displayedTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <main className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-10 drop-shadow-lg text-center">
            My Tickets
          </h1>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-lg bg-white/90 shadow-lg p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-8 py-3 rounded-md font-bold transition ${
                  activeTab === 'upcoming'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Upcoming ({upcomingTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-8 py-3 rounded-md font-bold transition ${
                  activeTab === 'past'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Past ({pastTickets.length})
              </button>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white text-xl mb-8 drop-shadow-lg">No tickets booked yet</p>
              <button
                onClick={handleBrowseMovies}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition shadow-lg"
              >
                Browse Movies
              </button>
            </div>
          ) : displayedTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-xl drop-shadow-lg">
                No {activeTab === 'upcoming' ? 'upcoming' : 'past'} tickets found.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {displayedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  id={`ticket-${ticket.id}`}
                  className={`bg-white rounded-xl shadow-2xl border border-gray-300 max-w-md mx-auto overflow-hidden transition-opacity ${
                    activeTab === 'past' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="p-6">
                    {/* Cinema Header */}
                    <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                      <h2 className="text-2xl font-bold text-orange-600">{ticket.cinema.name}</h2>
                      <p className="text-sm text-gray-700 mt-1">{ticket.cinema.address}</p>
                      <p className="text-xs text-gray-600">{ticket.cinema.phone}</p>
                      <p className="text-xs italic text-gray-500">{ticket.cinema.website}</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                      <div>
                        <strong className="text-gray-800">Show Date/Time</strong>
                        <p className="font-medium">{ticket.showDateTime}</p>
                      </div>
                      <div>
                        <strong className="text-gray-800">Movie</strong>
                        <p className="font-bold text-lg">{ticket.movieTitle}</p>
                      </div>
                      <div>
                        <strong className="text-gray-800">Auditorium</strong>
                        <p>{ticket.auditorium}</p>
                      </div>
                      <div className="col-span-2">
                        <strong className="text-gray-800">Screen / Seat</strong>
                        <p className="font-medium">Screen {ticket.screen} • Seat {ticket.seat}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-600">{ticket.showType}</p>
                      <p className="text-right text-2xl font-bold text-gray-900">{ticket.grandTotal}</p>
                    </div>

                    {/* Barcode */}
                    <div className="text-center mb-6 bg-white">
                      <ErrorBoundary fallbackValue={ticket.barcodeValue}>
                        <Barcode
                          value={ticket.barcodeValue}
                          format="CODE128"
                          width={2}
                          height={70}
                          displayValue={false}
                          background="#ffffff"
                          lineColor="#000000"
                        />
                      </ErrorBoundary>
                      <p className="text-xs font-mono text-gray-600 mt-2">{ticket.barcodeValue}</p>
                    </div>

                    {/* Notes */}
                    <div className="text-xs text-gray-600 space-y-1 border-t pt-4">
                      <p>Note: Ticket prices are inclusive of Refreshments</p>
                      <p>{ticket.notes.inclusive}</p>
                      <p>Normal/3D Movies</p>
                      <p>{ticket.notes.glasses}</p>
                      <p>{ticket.notes.nepali}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 print:hidden">
                      <button
                        data-action="download"
                        onClick={() => downloadTicket(ticket)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                      >
                        Download PDF Ticket
                      </button>

                      {activeTab === 'upcoming' && ticket.canRefund && (
                        <button
                          onClick={() => cancelTicket(ticket.id)}
                          disabled={cancellingId === ticket.id}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition shadow-md disabled:cursor-not-allowed"
                        >
                          {cancellingId === ticket.id ? (
                            'Cancelling...'
                          ) : (
                            <>
                              Cancel Ticket
                              <span className="block text-xs font-normal mt-1">
                                {ticket.minutesLeft} min left
                              </span>
                            </>
                          )}
                        </button>

                        
                      )}
                    </div>

                    {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-3 mt-8 print:hidden">
  {/* ... download and cancel buttons ... */}
</div>

{/* Cancellation Closed Message - Only for upcoming expired tickets */}
{activeTab === 'upcoming' && !ticket.canRefund && (
  <p className="text-center text-sm text-grey-600 mt-(-1) font-medium">
    Cancellation period has ended
  </p>
)}

                    

                    {activeTab === 'past' && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        Completed • Thank you for watching!
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyTickets;