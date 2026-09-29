import React from 'react';
import { useAuth } from '../AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

import { AdminDashboard } from '../components/AdminDashboard';
import { ParentDashboard } from '../components/ParentDashboard';
import { TutorDashboard } from '../components/TutorDashboard';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Teachers At Home Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 font-medium">
              Welcome, {user.email} ({user.role})
            </span>
            <button 
              onClick={logout}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'ADMIN' ? (
          <AdminDashboard />
        ) : user.role === 'TUTOR' ? (
          <TutorDashboard />
        ) : user.role === 'PARENT' ? (
          <ParentDashboard />
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{user.role} Dashboard</h1>
          </div>
        )}
      </main>
    </div>
  );
}
