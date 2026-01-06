// pages/ContactPage.jsx
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        'service_sb26awc',     // Your Service ID
        'template_bfeayhy',    // Your Template ID
        form.current,
        'r1z4dOUKeQEBcpdoh'    // Your Public Key
      )
      .then(
        (result) => {
          // SUCCESS TOAST
          toast.success('🎉 Thank you! Your message has been sent successfully. We\'ll get back to you soon.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          form.current.reset(); // Clear the form
          setLoading(false);
        },
        (error) => {
          // ERROR TOAST
          toast.error('❌ Oops! Failed to send message. Please check your connection and try again.', {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          console.error('EmailJS Error:', error);
          setLoading(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-[url('/bgsignup.png')] bg-cover bg-center bg-no-repeat">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
              Contact Cinemax
            </h1>
            <p className="text-xl text-white/80 drop-shadow-md max-w-2xl mx-auto">
              Have questions about bookings, theaters, or anything else? We're here to help!
            </p>
          </div>

          {/* Contact Info and Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <i className="fas fa-phone mr-3 text-green-400"></i>
                  Phone
                </h2>
                <p className="text-lg hover:text-green-400 transition-colors">
                  +977-1-1234567
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <i className="fas fa-envelope mr-3 text-green-400"></i>
                  Email
                </h2>
                <p className="text-lg hover:text-green-400 transition-colors">
                  info@cinemax.com
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <i className="fas fa-map-marker-alt mr-3 text-green-400"></i>
                  Address
                </h2>
                <p className="text-lg">
                  Thamel Marg, Kathmandu 44600<br />
                  Bagmati Province, Nepal
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
                <div className="flex space-x-4">
                  <a href="#" className="text-2xl text-white hover:text-green-400 transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-2xl text-white hover:text-green-400 transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-2xl text-white hover:text-green-400 transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-2xl text-white hover:text-green-400 transition-colors">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      className="w-full p-4 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
                      className="w-full p-4 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={5}
                      required
                      className="w-full p-4 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-4 px-6 rounded-md text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                  >
                    {loading ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;