import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Small, dependency-free sparkline (line) and bar chart helpers using SVG
const Sparkline = ({ data = [], color = '#10B981', strokeWidth = 2 }) => {
  if (!data || data.length === 0) return <div className="text-sm text-gray-400">No data</div>;
  const width = 200;
  const height = 50;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  const first = data[0];
  const last = data[data.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={0} cy={height - ((first - min) / range) * height} r={3} fill={color} />
      <circle cx={width} cy={height - ((last - min) / range) * height} r={3} fill={color} />
    </svg>
  );
};

const MiniBarChart = ({ labels = [], values = [], color = '#059669' }) => {
  if (!values || values.length === 0) return <div className="text-sm text-gray-400">No data</div>;
  const max = Math.max(...values) || 1;
  return (
    <div className="flex items-end gap-2 h-24">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div className="w-full" style={{ height: `${(v / max) * 100}%`, background: color, borderRadius: 4 }} />
          <div className="text-xs text-gray-500 mt-1">{labels[i] || ''}</div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState({ bookingsToday: 0, revenueToday: 0, activeShows: 0, totalUsers: 0 });
  const [occupancyToday, setOccupancyToday] = useState(0);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [lowStockShows, setLowStockShows] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueSeries, setRevenueSeries] = useState({ labels: [], values: [] });
  const [bookingsSeries, setBookingsSeries] = useState({ labels: [], values: [] });
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const http = axios.create({
    baseURL: API,
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Build dates for last 7 days
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 6);
        const fmt = (d) => d.toISOString().slice(0, 10);
        const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        // Fetch all needed data in parallel
        const [revResp, revMovieResp, showsResp, bookingsResp] = await Promise.all([
          http.get(`/booking/revenue`, { params: { dateFrom: fmt(from), dateTo: fmt(to), groupBy: 'date' } }),
          http.get(`/booking/revenue`, { params: { dateFrom: fmt(from), dateTo: fmt(to), groupBy: 'movie' } }),
          http.get(`/show`),
          http.get(`/booking`, { params: { limit: 10 } })
        ]);

        const revData = Array.isArray(revResp.data) ? revResp.data : revResp.data?.data || [];
        const revMovieData = Array.isArray(revMovieResp.data) ? revMovieResp.data : revMovieResp.data?.data || [];
        const shows = Array.isArray(showsResp.data) ? showsResp.data : showsResp.data?.shows || [];
        const bookingsData = Array.isArray(bookingsResp.data?.bookings) ? bookingsResp.data.bookings : (Array.isArray(bookingsResp.data) ? bookingsResp.data : []);

        // Map revData to day-sorted series
        const days = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(from);
          d.setDate(from.getDate() + i);
          days.push(fmt(d));
        }
        const revMap = revData.reduce((acc, cur) => { acc[cur._id] = cur.totalRevenue || 0; return acc; }, {});
        const revenueValues = days.map(d => Math.round((revMap[d] || 0) * 100) / 100);

        // For bookings per day, reuse revenue endpoint's ticketCount if present
        const bookingsValues = days.map(d => {
          const row = revData.find(r => r._id === d);
          return row ? (row.ticketCount || 0) : 0;
        });

        setRevenueSeries({ labels: days.map(d => d.slice(5)), values: revenueValues });
        setBookingsSeries({ labels: days.map(d => d.slice(5)), values: bookingsValues });

        // Today's KPIs: find today's revenue and booking count
        const todayKey = fmt(to);
        const todayRow = revData.find(r => r._id === todayKey) || {};
        const bookingsToday = todayRow.ticketCount || 0;
        const revenueToday = todayRow.totalRevenue || 0;

        // Active shows (upcoming or currently running)
        const now = new Date();
        const activeShows = shows.filter(s => new Date(s.endTime) > now).length;

        // Occupancy today and low-stock alerts
        const startToday = startOfDay(to);
        const endToday = endOfDay(to);
        const todaysShows = shows.filter((s) => {
          const st = new Date(s.startTime);
          return st >= startToday && st <= endToday;
        });

        let totalSeatsToday = 0;
        let bookedSeatsToday = 0;
        const lowStock = [];
        todaysShows.forEach((s) => {
          const total = s.totalSeatCount || 0;
          const booked = (s.availableSeats || []).filter(seat => seat && seat.isBooked).length;
          const remaining = Math.max(total - booked, 0);
          totalSeatsToday += total;
          bookedSeatsToday += booked;
          if (total > 0 && remaining / total <= 0.2 && remaining > 0) {
            lowStock.push({
              id: s._id,
              movie: s.movieId?.title || s.title || 'Show',
              screen: s.screenId?.name || s.screenId?.label || 'Screen',
              startsAt: s.startTime,
              seatsLeft: remaining,
              total
            });
          }
        });
        const occupancyPct = totalSeatsToday > 0 ? Math.round((bookedSeatsToday / totalSeatsToday) * 100) : 0;

        // All upcoming shows (not started yet, across all dates)
        console.log('Total shows fetched:', shows.length);
        console.log('Current time:', now);
        const upcoming = shows
          .filter((s) => {
            const st = new Date(s.startTime);
            console.log('Show:', s.movieId?.title || s.title, 'starts at:', st, 'is future?', st > now);
            return st > now;
          })
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        console.log('Upcoming shows count:', upcoming.length);

        // Top movies this week from revenue by movie
        const top = revMovieData
          .map((r) => ({
            title: r._id || 'Untitled',
            revenue: Math.round((r.totalRevenue || 0) * 100) / 100,
            tickets: r.ticketCount || 0
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Recent bookings (last 10)
        const recent = bookingsData.slice(0, 10).map((b) => ({
          id: b._id,
          time: b.bookingDate || b.createdAt,
          amount: b.totalPrice,
          status: b.status,
          seats: b.seatIds?.length || 0,
          showTime: b.showId?.startTime,
          movie: b.showId?.movieId?.title || b.showId?.title || '—',
          customer: b.userId?.name || b.userId?.email || '—'
        }));

        // Total users (try to fetch a large page)
        let totalUsers = 0;
        try {
          const usersResp = await http.get(`/user`, { params: { limit: 1000 } });
          if (Array.isArray(usersResp.data)) {
            totalUsers = usersResp.data.length;
          } else {
            totalUsers = usersResp.data?.pagination?.total
              ?? usersResp.data?.total
              ?? usersResp.data?.length
              ?? 0;
          }
        } catch (e) {
          // ignore — endpoint may be protected
          totalUsers = 0;
        }

        setKpis({ bookingsToday, revenueToday, activeShows, totalUsers });
        setOccupancyToday(occupancyPct);
        setUpcomingShows(upcoming);
        setLowStockShows(lowStock);
        setTopMovies(top);
        setRecentBookings(recent);
      } catch (err) {
        console.error('Dashboard fetch error', err?.response?.data || err.message || err);
        setError(err?.response?.data?.message || err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (t) => {
    if (!t) return '—';
    const d = new Date(t);
    return d.toLocaleString('en-GB', { hour12: false });
  };

  const formatCurrency = (v) => {
    if (v === undefined || v === null) return '—';
    return `रु. ${Number(v).toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm text-gray-500">Overview and quick actions</div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Bookings Today</div>
          <div className="text-2xl font-bold">{loading ? '—' : kpis.bookingsToday}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Revenue Today</div>
          <div className="text-2xl font-bold">{loading ? '—' : `रु. ${kpis.revenueToday.toFixed ? kpis.revenueToday.toFixed(2) : kpis.revenueToday}`}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Active Shows</div>
          <div className="text-2xl font-bold">{loading ? '—' : kpis.activeShows}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{loading ? '—' : kpis.totalUsers}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Occupancy Today</div>
          <div className="text-2xl font-bold">{loading ? '—' : `${occupancyToday}%`}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-medium">Revenue (last 7 days)</h3>
              <div className="text-sm text-gray-500">Daily confirmed booking revenue</div>
            </div>
            <div className="w-48">
              <Sparkline data={revenueSeries.values} color="#0EA5A4" />
            </div>
          </div>
          <div className="mt-3">
            <MiniBarChart labels={revenueSeries.labels} values={revenueSeries.values} color="#0EA5A4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-medium">Bookings (last 7 days)</h3>
              <div className="text-sm text-gray-500">Tickets booked per day</div>
            </div>
            <div className="w-48">
              <Sparkline data={bookingsSeries.values} color="#84CC16" />
            </div>
          </div>
          <div className="mt-3">
            <MiniBarChart labels={bookingsSeries.labels} values={bookingsSeries.values} color="#84CC16" />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-3">Movie Revenue Distribution (7d)</h3>
        {loading ? '—' : topMovies.length === 0 ? (
          <div className="text-gray-500 text-sm">No data</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topMovies.map(m => ({ name: m.title, value: m.revenue }))}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topMovies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0EA5A4', '#84CC16', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => `${value} (${formatCurrency(entry.payload.value)})`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors">Add Movie</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors">View Bookings</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-green-500 hover:text-white transition-colors">Manage Screens</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-2">Top Movies (7d)</h3>
          {loading ? '—' : (
            <ul className="space-y-2 text-sm">
              {topMovies.length === 0 && <li className="text-gray-500">No data</li>}
              {topMovies.map((m, idx) => (
                <li key={m.title + idx} className="flex justify-between">
                  <span className="text-gray-800">{idx + 1}. {m.title}</span>
                  <span className="text-gray-600">{formatCurrency(m.revenue)} · {m.tickets} tix</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-2">Almost Sold Out</h3>
          {loading ? '—' : (
            <div className="space-y-2 text-sm">
              {lowStockShows.length === 0 && <div className="text-gray-500">No low-stock shows</div>}
              {lowStockShows.map((s) => (
                <div key={s.id} className="p-2 rounded border border-yellow-100 bg-yellow-50">
                  <div className="font-medium text-yellow-800">{s.movie}</div>
                  <div className="text-gray-700">{s.screen} · {formatTime(s.startsAt)}</div>
                  <div className="text-gray-700">Seats left: {s.seatsLeft} / {s.total}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-2">Upcoming Shows</h3>
          {loading ? '—' : (
            <ul className="space-y-2 text-sm">
              {upcomingShows.length === 0 && <li className="text-gray-500">No upcoming shows</li>}
              {upcomingShows.map((s) => (
                <li key={s._id} className="flex justify-between">
                  <span className="text-gray-800">{s.movieId?.title || s.title || 'Show'}</span>
                  <span className="text-gray-600">{formatTime(s.startTime)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-3">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Booked At</th>
                <th className="py-2 pr-4">Movie</th>
                <th className="py-2 pr-4">Show Time</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Seats</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-3 text-gray-500" colSpan="7">Loading...</td></tr>
              ) : recentBookings.length === 0 ? (
                <tr><td className="py-3 text-gray-500" colSpan="7">No recent bookings</td></tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="border-t border-gray-100">
                    <td className="py-2 pr-4 text-gray-700">{formatTime(b.time)}</td>
                    <td className="py-2 pr-4 text-gray-700">{b.movie}</td>
                    <td className="py-2 pr-4 text-gray-700">{formatTime(b.showTime)}</td>
                    <td className="py-2 pr-4 text-gray-700">{b.customer}</td>
                    <td className="py-2 pr-4 text-gray-700">{b.seats}</td>
                    <td className="py-2 pr-4 text-gray-700">{formatCurrency(b.amount)}</td>
                    <td className="py-2 pr-4 text-gray-700">{b.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
    </div>
  );
};

export default Dashboard;