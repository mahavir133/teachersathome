import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  Users, CheckCircle, FileText, ClipboardList, AlertCircle, 
  Banknote, Target, Bell
} from 'lucide-react';

export function AdvancedDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [tutorsRes, requestsRes, asgRes, feeRes, attRes, grvRes] = await Promise.all([
          fetch('/api/tutors'),
          fetch('/api/requests'),
          fetch('/api/admin/assignments', { headers }),
          fetch('/api/admin/fees', { headers }),
          fetch('/api/admin/attendance', { headers }),
          fetch('/api/grievances', { headers })
        ]);
        
        const tutors = await tutorsRes.json();
        const requestsData = await requestsRes.json();
        const assignments = await asgRes.json();
        const payments = await feeRes.json();
        const attendance = await attRes.json();
        const grievances = await grvRes.json();
        
        const safeParse = (val: any) => typeof val === 'string' ? JSON.parse(val || '[]') : val;
        
        setData({
          tutors: (tutors || []).map((t: any) => ({...t, cities: safeParse(t.cities), subjects: safeParse(t.subjects)})),
          requests: (requestsData.parentRequests || []).map((r: any) => ({...r, subjects: safeParse(r.subjects)})),
          applications: (requestsData.tutorApplications || []).map((a: any) => ({...a, cities: safeParse(a.cities), subjects: safeParse(a.subjects)})),
          assignments: assignments || [],
          payments: payments || [],
          attendance: attendance || [],
          grievances: grievances || []
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-500">Loading overview...</div>;
  }

  const { tutors, requests, applications, assignments, payments, grievances } = data;

  const metrics = [
    { label: 'Total Tutors', value: tutors.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Tutors', value: tutors.filter((t: any) => t.verified).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Apps', value: applications.filter((a: any) => a.status === 'Pending').length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Parent Requests', value: requests.length, icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Unassigned', value: requests.filter((r: any) => !assignments.some((a: any) => a.request_id === r.id)).length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Active Assignments', value: assignments.filter((a: any) => a.status === 'Active').length, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Fees Collected (₹)', value: payments.filter((p: any) => p.status === 'Paid').reduce((s: number, p: any) => s + Number(p.amount), 0).toLocaleString('en-IN'), icon: Banknote, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Open Grievances', value: grievances.filter((g: any) => g.status !== 'Resolved').length, icon: Bell, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-600">{m.label}</span>
              <div className={`p-2 rounded-lg ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Recent Parent Requests</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {requests.slice(0, 5).map((r: any, i: number) => (
              <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-800">{r.parentName}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    r.status === 'New' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{r.status}</span>
                </div>
                <div className="text-sm text-slate-500 flex gap-4 mt-2">
                  <span>📍 {r.city}</span>
                  <span>📚 {r.studentClass}</span>
                </div>
              </div>
            ))}
            {requests.length === 0 && <div className="p-6 text-center text-slate-500 text-sm">No parent requests found.</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Needs Attention</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {applications.filter((a: any) => a.status === 'Pending').slice(0, 3).map((a: any, i: number) => (
              <div key={i} className="px-6 py-4 hover:bg-slate-50 flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Tutor Application: {a.fullName}</p>
                  <p className="text-xs text-slate-500 mt-1">Pending review. Applied for {a.preferredMode} tutoring.</p>
                </div>
              </div>
            ))}
            {grievances.filter((g: any) => g.status !== 'Resolved').slice(0, 3).map((g: any, i: number) => (
              <div key={`g${i}`} className="px-6 py-4 hover:bg-slate-50 flex items-start gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Grievance ({g.grievance_type})</p>
                  <p className="text-xs text-slate-500 mt-1">{g.description}</p>
                </div>
              </div>
            ))}
            {applications.filter((a: any) => a.status === 'Pending').length === 0 && 
             grievances.filter((g: any) => g.status !== 'Resolved').length === 0 && (
              <div className="p-6 text-center text-emerald-600 flex flex-col items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8 opacity-50" />
                <span className="text-sm font-medium">All caught up! No pending tasks.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
