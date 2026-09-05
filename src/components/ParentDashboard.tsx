import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Sparkles, Receipt, UserPlus, IndianRupee } from 'lucide-react';
import { ParentRequest } from '../types';
import { useAuth } from '../AuthContext';

export function ParentDashboard() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'assignments' | 'fees'>('requests');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setRequests(data.requests || []);

        const resAsg = await fetch('/api/parent/assignments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resAsg.ok) {
          const asgData = await resAsg.json();
          setAssignments(asgData || []);
        }

        const resFees = await fetch('/api/parent/fees', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resFees.ok) {
          const feesData = await resFees.json();
          setFees(feesData || []);
        }
      } catch (err) {
        console.error('Failed to load user data', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUserData();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold">Parent Dashboard</h2>
        <p className="text-sm text-indigo-200 mt-1">Track your demo requests, assigned tutors, and payment history.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'requests' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" /> My Demo Requests
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'assignments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Assigned Tutors
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'fees' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" /> Payment History
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        
        {activeTab === 'requests' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">My Demo Requests</h3>
            
            {loading ? (
              <div className="py-12 text-center text-slate-500">Loading your requests...</div>
            ) : requests.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold">You haven't submitted any demo requests yet.</p>
                <p className="text-sm mt-1">Go back to the home page to request a tutor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#708238] bg-[#F2F4EF] px-2 py-1 rounded-md text-xs border border-[#E6E8E1]">
                        {req.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900">
                      {req.studentClass} • {req.board}
                    </div>

                    <div className="text-slate-600 text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{req.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="truncate">Subjects: {req.subjects?.join(', ')}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">My Assigned Tutors</h3>
            
            {loading ? (
              <div className="py-8 text-center text-slate-500">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <p className="font-bold">No tutors assigned yet.</p>
                <p className="text-sm mt-1">Once a tutor is confirmed, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((asg) => (
                  <div key={asg.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 text-lg">{asg.tutorName}</div>
                    <div className="text-slate-600 text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span>{asg.qualification} • {asg.experienceYears} Years Exp.</span>
                      </div>
                      <div className="font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                        Agreed Fee: ₹{asg.fee_agreed}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                        Assigned on: {new Date(asg.assigned_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'fees' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Payment History</h3>
            
            {loading ? (
              <div className="py-8 text-center text-slate-500">Loading fees...</div>
            ) : fees.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold">No payments recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">Tutor / Student</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fees.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="p-3 font-black text-slate-700">{f.month_year}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{f.tutorName}</div>
                          <div className="text-xs text-slate-500">Student: {f.studentName || f.parentName}</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-600">₹{f.amount}</td>
                        <td className="p-3 text-xs text-slate-500">
                          <div>{f.payment_mode}</div>
                          {f.txn_id && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{f.txn_id}</div>}
                        </td>
                        <td className="p-3 text-slate-500 text-xs">{new Date(f.payment_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
