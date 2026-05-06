'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [businesses, setBusinesses] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is super_admin
    if (!authToken || user?.role !== 'super_admin') {
      router.push('/admin/login');
      return;
    }

    setToken(authToken);
    fetchBusinesses(authToken);
  }, []);

  const fetchBusinesses = async (authToken) => {
    try {
      setLoading(true);
      const statuses = ['pending', 'approved', 'rejected'];
      const results = {};

      for (const status of statuses) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/businesses?approvalStatus=${status}&limit=50`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await response.json();
        results[status] = data.success ? data.data?.businesses || [] : [];
      }

      setBusinesses(results);
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (businessId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/businesses/${businessId}/decision`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision: 'approved',
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchBusinesses(token);
      } else {
        alert('Failed to approve: ' + data.message);
      }
    } catch (err) {
      console.error('Failed to approve business:', err);
      alert('Error approving business');
    }
  };

  const handleReject = async () => {
    if (!selectedBusiness || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/businesses/${selectedBusiness._id}/decision`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision: 'rejected',
            rejectionReason: rejectionReason,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedBusiness(null);
        fetchBusinesses(token);
      } else {
        alert('Failed to reject: ' + data.message);
      }
    } catch (err) {
      console.error('Failed to reject business:', err);
      alert('Error rejecting business');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="flex min-h-screen bg-[#f7f9fb]">
        {/* Sidebar */}
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f2f4f6] flex flex-col p-4 space-y-2 font-['Inter'] z-40">
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1e] leading-none">
                LocalBiz
              </h1>
              <p className="text-[11px] text-slate-500 font-normal">Super Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 mt-6">
            <div className="px-4 py-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Management
              </p>
              <button
                onClick={() => setActiveTab('pending')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  true
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-slate-500 hover:bg-[#eceef0]'
                }`}
              >
                <span className="material-symbols-outlined">domain_verification</span>
                <span>Store Approvals</span>
              </button>
            </div>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8 space-y-8">
          {/* Header */}
          <section className="space-y-2">
            <h1 className="text-4xl font-bold text-[#191c1e]">Store Approvals</h1>
            <p className="text-slate-500">Review and manage business store applications</p>
          </section>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'pending'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
                Pending ({businesses.pending.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'approved'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  verified_user
                </span>
                Approved ({businesses.approved.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'rejected'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  block
                </span>
                Rejected ({businesses.rejected.length})
              </span>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-red-500 rounded-full mx-auto"></div>
              <p className="text-slate-500 mt-4">Loading businesses...</p>
            </div>
          ) : businesses[activeTab].length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-slate-400">
                  {activeTab === 'pending'
                    ? 'inbox'
                    : activeTab === 'approved'
                    ? 'verified_user'
                    : 'block'}
                </span>
              </div>
              <p className="text-[#191c1e] font-bold text-lg">
                No {activeTab} stores
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {activeTab === 'pending'
                  ? 'All pending applications have been processed'
                  : `No ${activeTab} stores to display`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses[activeTab].map(business => (
                <div
                  key={business._id}
                  className="glass-card rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#191c1e] mb-1">
                        {business.storeName}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {business.description || 'No description provided'}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Owner
                          </p>
                          <p className="font-semibold text-slate-800">
                            {business.owner?.fullName || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {business.owner?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            City
                          </p>
                          <p className="font-semibold text-slate-800">
                            {business.city}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Category
                          </p>
                          <p className="font-semibold text-slate-800">
                            {business.category?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                            Phone
                          </p>
                          <p className="font-semibold text-slate-800">
                            {business.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason - Show if Rejected */}
                  {activeTab === 'rejected' && business.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                      <p className="text-xs text-red-600 uppercase font-bold">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-700">
                        {business.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Actions - Show only for Pending */}
                  {activeTab === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => handleApprove(business._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-base">
                          check_circle
                        </span>
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBusiness(business);
                          setShowRejectModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-base">
                          cancel
                        </span>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#191c1e] mb-2">
                Reject Store Application
              </h3>
              <p className="text-sm text-slate-600">
                {selectedBusiness?.storeName}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Explain why you're rejecting this application..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedBusiness(null);
                }}
                className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
