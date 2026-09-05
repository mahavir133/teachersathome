import React, { useState, useEffect } from 'react';
import { ShieldCheck, BookOpen, MapPin, GraduationCap, Receipt, Users, UserCircle } from 'lucide-react';
import { TutorApplication, Tutor } from '../types';
import { useAuth } from '../AuthContext';

export function TutorDashboard() {
  const { user, token } = useAuth();
  const [application, setApplication] = useState<TutorApplication | null>(null);
  const [profile, setProfile] = useState<Tutor | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'students' | 'fees'>('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setApplication(data.application || null);
        setProfile(data.profile || null);

        if (data.profile) {
          const resAsg = await fetch('/api/tutor/assignments', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resAsg.ok) {
            const asgData = await resAsg.json();
            setAssignments(asgData || []);
          }

          const resFees = await fetch('/api/tutor/fees', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resFees.ok) {
            const feesData = await resFees.json();
            setFees(feesData || []);
          }
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
      <div className="bg-[#2C3317] text-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold">Tutor Dashboard</h2>
        <p className="text-sm text-[#E9EDDE] mt-1">Manage your teaching profile, assigned students, and payments.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'profile' ? 'border-[#708238] text-[#708238]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCircle className="w-4 h-4" /> My Profile
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'students' ? 'border-[#708238] text-[#708238]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Assigned Students
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'fees' ? 'border-[#708238] text-[#708238]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" /> Payments Received
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
        
        {activeTab === 'profile' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">My Profile & Status</h3>
            
            {loading ? (
              <div className="py-12 text-center text-slate-500">Loading your profile...</div>
            ) : profile ? (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h4 className="font-extrabold text-lg text-emerald-900">Your Profile is Live!</h4>
                    <p className="text-sm text-emerald-700">Parents can now discover you on Teachers At Home.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-100 space-y-2 mt-4 text-sm text-slate-700">
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Qualification:</strong> {profile.qualification}</p>
                  <p><strong>Experience:</strong> {profile.experienceYears} Years</p>
                  <p><strong>Subjects:</strong> {profile.subjects?.join(', ')}</p>
                  <p><strong>Cities:</strong> {profile.cities?.join(', ')}</p>
                </div>
              </div>
            ) : application ? (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-amber-900">Application Under Review</h4>
                    <p className="text-sm text-amber-700">Our administrative team is verifying your application.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-100 space-y-2 mt-4 text-sm text-slate-700">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold">Application ID:</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{application.id}</span>
                  </div>
                  <p><strong>Name:</strong> {application.fullName}</p>
                  <p><strong>Qualification:</strong> {application.qualification}</p>
                  <p><strong>Experience:</strong> {application.experienceYears} Years</p>
                  <p><strong>Subjects:</strong> {application.subjects?.join(', ')}</p>
                </div>
                
                <p className="text-xs text-amber-600 italic">Submitted on: {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold">You haven't submitted a tutor application.</p>
                <p className="text-sm mt-1">Go back to the home page and click "Join as Tutor" to apply.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">My Assigned Students</h3>
            
            {loading ? (
              <div className="py-8 text-center text-slate-500">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <p className="font-bold">No students assigned yet.</p>
                <p className="text-sm mt-1">Once a parent confirms you as their tutor, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((asg) => (
                  <div key={asg.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 text-lg">
                      {asg.studentName ? `${asg.studentName} (Student)` : 'Student'}
                    </div>
                    <div className="text-slate-600 text-sm space-y-2">
                      <div><strong>Parent:</strong> {asg.parentName}</div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <span>{asg.studentClass} • {asg.board}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span>{asg.city} {asg.locality ? `(${asg.locality})` : ''}</span>
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
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Payments Received</h3>
            
            {loading ? (
              <div className="py-8 text-center text-slate-500">Loading payments...</div>
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
                      <th className="p-3">Student / Parent</th>
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
                          <div className="font-bold text-slate-900">{f.studentName || f.parentName}</div>
                          <div className="text-xs text-slate-500">Parent: {f.parentName}</div>
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
