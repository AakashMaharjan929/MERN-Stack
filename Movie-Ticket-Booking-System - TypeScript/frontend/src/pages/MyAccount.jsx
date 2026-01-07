import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { updateUserProfile, changeUserPassword, getUserBookings, cancelUserBooking } from '../api/userAPI';

const MyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      console.log('🔍 Raw localStorage user:', stored);
      const parsed = stored ? JSON.parse(stored) : null;
      console.log('👤 Parsed user object:', parsed);
      return parsed;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Derived values
  const userId = user?._id || user?.id;
  const token = localStorage.getItem('token');
  const isAuthed = !!token;

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthed) {
      navigate('/login');
    }
  }, [isAuthed, navigate]);

  // Prefill profile form
  useEffect(() => {
    if (user) {
      console.log('📋 Setting profile from user:', user);
      console.log('📞 Phone value:', user.phone);
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;
      setLoadingBookings(true);
      try {
        const res = await getUserBookings(userId);
        const data = res?.data?.bookings || res?.bookings || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load bookings', err);
        toast.error(err?.response?.data?.message || 'Could not load your bookings');
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [userId]);

  const maskedEmail = useMemo(() => {
    if (!profile.email) return '';
    const [local, domain] = profile.email.split('@');
    if (!domain) return profile.email;
    const keep = Math.min(3, local.length);
    return `${local.slice(0, keep)}***@${domain}`;
  }, [profile.email]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setSavingProfile(true);
    try {
      const payload = { name: profile.name, email: profile.email, phone: profile.phone };
      const res = await updateUserProfile(userId, payload);
      const updated = res?.data?.user || res?.user || payload;
      const nextUser = { ...user, ...updated };
      if (!nextUser.id && nextUser._id) nextUser.id = nextUser._id;
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
      toast.success('Profile updated');
    } catch (err) {
      console.error('Profile update failed', err);
      toast.error(err?.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await changeUserPassword(userId, { oldPassword, newPassword });
      toast.success('Password updated');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change failed', err);
      toast.error(err?.response?.data?.message || 'Could not change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!userId || !bookingId) return;
    try {
      await cancelUserBooking(userId, bookingId);
      toast.success('Booking cancelled');
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      console.error('Cancel booking failed', err);
      toast.error(err?.response?.data?.message || 'Could not cancel booking');
    }
  };

  if (!isAuthed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={() => {}} suggestions={[]} selectedCity={localStorage.getItem('city') || 'All'} />

      <ToastContainer position="top-right" autoClose={3000} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="text-xl font-semibold text-gray-900">{profile.name}</p>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 uppercase">{user?.role || 'customer'}</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><i className="fas fa-envelope text-gray-400"></i><span>{maskedEmail}</span></div>
              <div className="flex items-center gap-2"><i className="fas fa-phone text-gray-400"></i><span>{profile.phone || 'Not set'}</span></div>
              <div className="flex items-center gap-2"><i className="fas fa-id-badge text-gray-400"></i><span>ID: {userId}</span></div>
              <div className="flex items-center gap-2"><i className="fas fa-calendar text-gray-400"></i><span>Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></div>
              <div className="flex items-center gap-2"><i className="fas fa-shield-alt text-gray-400"></i><span>Status: {user?.status || 'active'}</span></div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow disabled:opacity-60"
                >
                  {savingProfile ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, oldPassword: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg shadow disabled:opacity-60"
                >
                  {savingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              {loadingBookings && <span className="text-sm text-gray-500">Loading…</span>}
            </div>
            {bookings.length === 0 && !loadingBookings && (
              <p className="text-gray-600">No bookings yet.</p>
            )}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="space-y-1 text-sm text-gray-800">
                    <p className="font-semibold text-gray-900">{booking.movieTitle || booking.movieName || 'Movie'}</p>
                    <p className="text-gray-600">Show Time: {booking.showTime ? new Date(booking.showTime).toLocaleString() : '—'}</p>
                    <p className="text-gray-600">Seats: {Array.isArray(booking.seats) ? booking.seats.join(', ') : (booking.seats || '—')}</p>
                    <p className="text-gray-600">Amount: {booking.totalAmount ? `रु. ${booking.totalAmount}` : '—'}</p>
                    <p className="text-gray-600">Status: <span className={`font-semibold capitalize ${
                      booking.status === 'Confirmed' ? 'text-green-600' :
                      booking.status === 'Cancelled' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>{booking.status || 'pending'}</span></p>
                    {booking.screenName && <p className="text-gray-600 text-xs">Screen: {booking.screenName}</p>}
                    {booking.bookingDate && <p className="text-gray-600 text-xs">Booked: {new Date(booking.bookingDate).toLocaleDateString()}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                      onClick={() => navigate('/my-tickets')}
                    >
                      View Ticket
                    </button>
                    {booking.status !== 'cancelled' && (
                      <button
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 hover:bg-red-100"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
