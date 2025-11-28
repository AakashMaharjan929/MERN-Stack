import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [kpis, setKpis] = useState({ bookingsToday: 0, revenueToday: 0, activeShows: 0, totalUsers: 0 });
  const [revenueSeries, setRevenueSeries] = useState({ labels: [], values: [] });
  const [bookingsSeries, setBookingsSeries] = useState({ labels: [], values: [] });
  const API = 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build dates for last 7 days
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 6);
        const fmt = (d) => d.toISOString().slice(0, 10);

        // Revenue breakdown grouped by date for last 7 days
        const revResp = await axios.get(`${API}/booking/revenue`, {
          params: { dateFrom: fmt(from), dateTo: fmt(to), groupBy: 'date' }
        });
        const revData = Array.isArray(revResp.data) ? revResp.data : [];
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
        const showsResp = await axios.get(`${API}/show`);
        const shows = Array.isArray(showsResp.data) ? showsResp.data : showsResp.data?.shows || [];
        const now = new Date();
        const activeShows = shows.filter(s => new Date(s.endTime) > now).length;

        // Total users (try to fetch a large page)
        let totalUsers = 0;
        try {
          const usersResp = await axios.get(`${API}/user`, { params: { limit: 1000 } });
          if (Array.isArray(usersResp.data)) totalUsers = usersResp.data.length;
          else totalUsers = usersResp.data?.total || usersResp.data?.length || 0;
        } catch (e) {
          // ignore — endpoint may be protected
          totalUsers = 0;
        }

        setKpis({ bookingsToday, revenueToday, activeShows, totalUsers });
      } catch (err) {
        console.error('Dashboard fetch error', err?.response?.data || err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm text-gray-500">Overview and quick actions</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Bookings Today</div>
          <div className="text-2xl font-bold">{loading ? '—' : kpis.bookingsToday}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Revenue Today</div>
          <div className="text-2xl font-bold">{loading ? '—' : `₹ ${kpis.revenueToday.toFixed ? kpis.revenueToday.toFixed(2) : kpis.revenueToday}`}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Active Shows</div>
          <div className="text-2xl font-bold">{loading ? '—' : kpis.activeShows}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{loading ? '—' : kpis.totalUsers}</div>
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
        <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-3 py-1 bg-green-500 text-white rounded">Add Movie</button>
          <button className="px-3 py-1 border border-gray-200 rounded">View Bookings</button>
          <button className="px-3 py-1 border border-gray-200 rounded">Manage Screens</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;