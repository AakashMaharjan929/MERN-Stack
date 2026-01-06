// CapacityManagement.jsx - Admin page for viewing screen capacity breakdowns with navigation to editor
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getAllScreens } from '../../api/screenAPI'; // Adjust path

const CapacityManagement = () => {
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to compute capacity breakdown from seatLayout (client-side)
  const getCapacityBreakdown = (seatLayout) => {
    const breakdown = { Standard: 0, Premium: 0, VIP: 0 };
    const validSeats = seatLayout.flat().filter(seat => seat !== null);
    validSeats.forEach(seat => {
      if (breakdown[seat.type] !== undefined) {
        breakdown[seat.type]++;
      }
    });
    const total = validSeats.length;
    return {
      breakdown,
      total,
      percentages: Object.fromEntries(
        Object.entries(breakdown).map(([type, count]) => [type, total > 0 ? ((count / total) * 100).toFixed(1) : 0])
      )
    };
  };

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const data = await getAllScreens();
        setScreens(data);
      } catch (err) {
        toast.error('Failed to load screens');
      } finally {
        setLoading(false);
      }
    };
    fetchScreens();
  }, []);

  const handleManageClick = (screenId) => {
    navigate(`/admin/screens/layout/${screenId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#6B7280]">Loading capacity data...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#fff', color: '#2E2E2E', border: '1px solid #E5E7EB' },
          success: { style: { background: '#F0FDF4', color: '#065F46' } },
          error: { style: { background: '#FEF2F2', color: '#991B1B' } },
        }}
      />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#F5F6FA]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-chart-bar text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">Capacity Management</h1>
            <p className="text-[#6B7280] text-sm">View seat type breakdowns across all screens and manage layouts</p>
          </div>

          {/* Capacity Table */}
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-[#E5E7EB]/50 overflow-x-auto">
            {screens.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280]">
                <i className="fas fa-inbox text-4xl mb-4 opacity-50"></i>
                <p>No screens available.</p>
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead className="bg-[#F5F6FA]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Theater</th>
                    <th className="px-4 py-3 text-left text-[#6B7280] text-sm font-medium">Screen</th>
                    <th className="px-4 py-3 text-right text-[#6B7280] text-sm font-medium">Total Seats</th>
                    <th className="px-4 py-3 text-right text-[#6B7280] text-sm font-medium">Standard</th>
                    <th className="px-4 py-3 text-right text-[#6B7280] text-sm font-medium">Premium</th>
                    <th className="px-4 py-3 text-right text-[#6B7280] text-sm font-medium">VIP</th>
                    <th className="px-4 py-3 text-center text-[#6B7280] text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {screens.map((screen) => {
                    const { breakdown, total, percentages } = getCapacityBreakdown(screen.seatLayout);
                    return (
                      <tr key={screen._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-[#2E2E2E] text-sm font-medium">
                          {screen.fullAddress}
                        </td>
                        <td className="px-4 py-4 text-[#2E2E2E] text-sm">{screen.name}</td>
                        <td className="px-4 py-4 text-right text-[#2E2E2E] text-sm font-medium">{total}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-[#2E2E2E] text-sm">
                            {breakdown.Standard} ({percentages.Standard}%)
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentages.Standard}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-[#2E2E2E] text-sm">
                            {breakdown.Premium} ({percentages.Premium}%)
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentages.Premium}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-[#2E2E2E] text-sm">
                            {breakdown.VIP} ({percentages.VIP}%)
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentages.VIP}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleManageClick(screen._id)}
                            className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-[#065F46] transition-all duration-200"
                          >
                            Manage Layout
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary Stats */}
          {!loading && screens.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]/50">
                <h3 className="text-[#6B7280] text-sm font-medium mb-1">Total Screens</h3>
                <p className="text-2xl font-bold text-[#2E2E2E]">{screens.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]/50">
                <h3 className="text-[#6B7280] text-sm font-medium mb-1">Total Capacity</h3>
                <p className="text-2xl font-bold text-[#2E2E2E]">
                  {screens.reduce((sum, screen) => sum + getCapacityBreakdown(screen.seatLayout).total, 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E7EB]/50">
                <h3 className="text-[#6B7280] text-sm font-medium mb-1">Avg. per Screen</h3>
                <p className="text-2xl font-bold text-[#2E2E2E]">
                  {Math.round(
                    screens.reduce((sum, screen) => sum + getCapacityBreakdown(screen.seatLayout).total, 0) /
                      screens.length
                  ) || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CapacityManagement;