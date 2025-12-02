import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf'; // npm install jspdf
import html2canvas from 'html2canvas'; // npm install html2canvas
import Barcode from 'react-barcode'; // Already installed
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '0.375rem' }}>
          <strong>Something went wrong with the barcode display.</strong>
          <p style={{ marginTop: '0.25rem' }}>{this.state.error?.message}</p>
          <p>Use the download option to get the barcode value.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const MyTickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  // Mock ticket data - Updated to match ticket style (no images, added details)
  const MOCK_TICKETS = [
    {
      id: 1,
      movieTitle: "जारि२",
      showDateTime: "Kartik 29 | 7 NOV 7:00 PM",
      auditorium: "Auditorium 1",
      screen: "Screen 1",
      seat: "G 7",
      showType: "Weekend 3D Foreign Platinum Afternoon",
      price: "NPR 500.00",
      grandTotal: "NPR 500.00",
      barcodeValue: "11817063087", // Numeric barcode like in example
      cinema: {
        name: "Cinemax",
        address: "Rising Mall, Durbar Marg",
        phone: "4169201/4169202",
        website: "www.qscinemas.com"
      },
      notes: {
        inclusive: "+ Inclusive of 15% FDT and 13% VAT.",
        glasses: "+ 3D Glasses Rs 50 Extra On Every Ticket (All Show).",
        nepali: "+ Inclusive of 13% VAT. Nepali Movies"
      }
    },
    {
      id: 2,
      movieTitle: "Wicked 2: For Good",
      showDateTime: "November 21 5:30 PM",
      auditorium: "Auditorium 2",
      screen: "Screen 2",
      seat: "H 12",
      showType: "Weekend 3D Foreign Platinum Afternoon",
      price: "NPR 750.00",
      grandTotal: "NPR 750.00",
      barcodeValue: "11817063088",
      cinema: {
        name: "Q's Cinemas",
        address: "Rising Mall, Durbar Marg",
        phone: "4169201/4169202",
        website: "www.qscinemas.com"
      },
      notes: {
        inclusive: "+ Inclusive of 15% FDT and 13% VAT.",
        glasses: "+ 3D Glasses Rs 50 Extra On Every Ticket (All Show).",
        nepali: "+ Inclusive of 13% VAT. Nepali Movies"
      }
    },
    {
      id: 3,
      movieTitle: "माया",
      showDateTime: "Kartik 15 | 31 OCT 8:45 PM",
      auditorium: "Auditorium 3",
      screen: "Screen 3",
      seat: "F 5",
      showType: "Weekend 3D Foreign Platinum Afternoon",
      price: "NPR 400.00",
      grandTotal: "NPR 400.00",
      barcodeValue: "11817063089",
      cinema: {
        name: "Q's Cinemas",
        address: "Rising Mall, Durbar Marg",
        phone: "4169201/4169202",
        website: "www.qscinemas.com"
      },
      notes: {
        inclusive: "+ Inclusive of 15% FDT and 13% VAT.",
        glasses: "+ 3D Glasses Rs 50 Extra On Every Ticket (All Show).",
        nepali: "+ Inclusive of 13% VAT. Nepali Movies"
      }
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        const downloadableTickets = MOCK_TICKETS.filter(t => true); // All are downloadable
        setTickets(downloadableTickets);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const downloadTicket = async (ticket) => {
    const ticketElement = document.getElementById(`ticket-${ticket.id}`);
    if (!ticketElement) {
      toast.error('Ticket element not found.');
      return;
    }

    // Temporarily hide the download button for clean capture
    const downloadBtn = ticketElement.querySelector('button');
    if (downloadBtn) {
      downloadBtn.style.display = 'none';
    }

    try {
      // Capture the ticket div as canvas
      const canvas = await html2canvas(ticketElement, {
        scale: 3, // Higher scale for better resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Ensure white background
        width: ticketElement.scrollWidth,
        height: ticketElement.scrollHeight,
        logging: false, // Disable logging to reduce noise
        onclone: (clonedDoc) => {
          const clonedTicket = clonedDoc.getElementById(`ticket-${ticket.id}`);
          if (clonedTicket) {
            // Set root styles
            clonedTicket.style.backgroundColor = '#ffffff';
            clonedTicket.style.color = '#000000';
            clonedTicket.style.borderColor = '#d1d5db';

            // Recursively fix any oklch colors using TreeWalker
            const walker = clonedDoc.createTreeWalker(
              clonedTicket,
              NodeFilter.SHOW_ELEMENT,
              null,
              false
            );
            let node;
            while (node = walker.nextNode()) {
              // Check and fix color
              if (node.style.color && node.style.color.includes('oklch')) {
                node.style.color = '#000000';
              }
              // Check and fix backgroundColor
              if (node.style.backgroundColor && node.style.backgroundColor.includes('oklch')) {
                node.style.backgroundColor = '#ffffff';
              }
              // Check and fix border colors
              if (node.style.borderColor && node.style.borderColor.includes('oklch')) {
                node.style.borderColor = '#d1d5db';
              }
              // For SVG elements in barcode (stroke, fill)
              if (node.tagName && (node.tagName === 'path' || node.tagName === 'rect' || node.tagName === 'line')) {
                if (node.style.stroke && node.style.stroke.includes('oklch')) {
                  node.style.stroke = '#000000';
                }
                if (node.style.fill && node.style.fill.includes('oklch')) {
                  node.style.fill = '#000000';
                }
              }
            }

            // Specific overrides
            const h2 = clonedTicket.querySelector('h2');
            if (h2) {
              h2.style.color = '#ea580c';
            }
            const strongs = clonedTicket.querySelectorAll('strong');
            strongs.forEach(el => {
              el.style.color = '#000000';
            });
          }
        }
      });

      // Create PDF with custom size to fit the ticket better (e.g., A6-like for compact ticket)
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [105, 148] // A6 size: 105mm width x 148mm height, compact for tickets
      });

      // Calculate dimensions to fill the page
      const pageWidth = 105;
      const pageHeight = 148;
      const imgWidth = pageWidth - 10; // 95mm width with 5mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xPosition = (pageWidth - imgWidth) / 2; // Center horizontally
      const yPosition = (pageHeight - imgHeight) / 2; // Center vertically if it fits

      // Check if it fits on one page; if not, scale down height proportionally
      let finalImgHeight = imgHeight;
      let finalYPosition = 5; // Top margin
      if (imgHeight > pageHeight - 10) { // If too tall, scale to fit
        finalImgHeight = pageHeight - 10;
        finalYPosition = 5;
      } else {
        finalYPosition = (pageHeight - finalImgHeight) / 2; // Center if fits
      }

      // Add the image centered
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xPosition, finalYPosition, imgWidth, finalImgHeight);

      // Save the PDF
      pdf.save(`ticket-${ticket.id}-${ticket.movieTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

      toast.success('Ticket downloaded as PDF successfully! Print for entry.', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      // Restore the download button
      if (downloadBtn) {
        downloadBtn.style.display = '';
      }
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleBrowseMovies = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      <Navbar />
      <main className="pt-16 p-8 relative z-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">My Tickets</h1>
          {tickets.length > 0 ? (
            <div className="space-y-6">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  id={`ticket-${ticket.id}`}
                  className="p-6 rounded-lg shadow-lg max-w-md mx-auto print:max-w-none"
                  style={{ backgroundColor: '#ffffff', color: '#000000', border: '1px solid #d1d5db' }}
                >
                  {/* Cinema Header */}
                  <div className="text-center border-b-2 pb-2 mb-4" style={{ borderBottomColor: '#d1d5db' }}>
                    <h2 className="text-xl font-bold" style={{ color: '#ea580c' }}>{ticket.cinema.name}</h2>
                    <p className="text-sm" style={{ color: '#000000' }}>{ticket.cinema.address}</p>
                    <p className="text-xs" style={{ color: '#000000' }}>{ticket.cinema.phone}</p>
                    <p className="text-xs italic" style={{ color: '#000000' }}>{ticket.cinema.website}</p>
                  </div>

                  {/* Show Details */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm" style={{ color: '#000000' }}>
                    <div>
                      <strong style={{ color: '#000000' }}>Show Date/Time</strong>
                      <p style={{ color: '#000000' }}>{ticket.showDateTime}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#000000' }}>Movie Name</strong>
                      <p className="font-semibold" style={{ color: '#000000' }}>{ticket.movieTitle}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#000000' }}>Auditorium</strong>
                      <p style={{ color: '#000000' }}>{ticket.auditorium}</p>
                    </div>
                    <div className="col-span-2">
                      <strong style={{ color: '#000000' }}>Screen / Seat</strong>
                      <p style={{ color: '#000000' }}>Screen {ticket.screen} Seat {ticket.seat}</p>
                    </div>
                  </div>

                  {/* Show Type and Price */}
                  <div className="mb-4" style={{ color: '#000000' }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: '#000000' }}>{ticket.showType}</p>
                    <p className="text-right font-bold" style={{ color: '#000000' }}>{ticket.price}</p>
                  </div>

                  {/* Grand Total */}
                  <div className="border-t pt-2 mb-4" style={{ borderTopColor: '#d1d5db', color: '#000000' }}>
                    <p className="text-right font-bold text-lg" style={{ color: '#000000' }}>Grand Total</p>
                    <p className="text-right font-bold text-xl" style={{ color: '#000000' }}>{ticket.grandTotal}</p>
                  </div>

                  {/* Barcode */}
                  <div className="text-center mb-4" style={{ color: '#000000' }}>
                    <div style={{ color: 'black' }}>
                      <ErrorBoundary>
                        <Barcode
                          value={ticket.barcodeValue}
                          format="CODE128"
                          width={2}
                          height={60}
                          displayValue={false}
                          style={{ color: 'black' }}
                        />
                      </ErrorBoundary>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#000000' }}>{ticket.barcodeValue}</p>
                  </div>

                  {/* Notes */}
                  <div className="text-xs border-t pt-2" style={{ borderTopColor: '#d1d5db', color: '#000000' }}>
                    <p className="mb-1" style={{ color: '#000000' }}>Note: Ticket prices are inclusive of Refreshments</p>
                    <p style={{ color: '#000000' }}>{ticket.notes.inclusive}</p>
                    <p className="mb-1" style={{ color: '#000000' }}>Normal/3D Movies</p>
                    <p style={{ color: '#000000' }}>{ticket.notes.glasses}</p>
                    <p style={{ color: '#000000' }}>{ticket.notes.nepali}</p>
                  </div>

                  {/* Download Button - Hidden on print */}
                  <div className="text-center mt-4 print:hidden">
                    <button
                      onClick={() => downloadTicket(ticket)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
                      style={{ backgroundColor: '#16a34a', color: 'white' }} // Inline for button too
                    >
                      Download Ticket as PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-lg drop-shadow-lg mb-4">No tickets available yet. Book a movie to get yours!</p>
              <button
                onClick={handleBrowseMovies}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-sm font-semibold transition-colors"
              >
                Browse Movies
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyTickets;