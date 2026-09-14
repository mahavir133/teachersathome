import React, { useState, useEffect } from 'react';
import { Clock, Phone, User, MapPin, Sparkles, ShieldCheck, Award, CheckCircle, XCircle } from 'lucide-react';
import { ParentRequest } from '../types';
import { LegacyTutorForm } from './LegacyTutorForm';
import { AssignmentsManager } from './AssignmentsManager';
import { FeeManager } from './FeeManager';
import { useAuth } from '../AuthContext';
import { AttendanceCalendar } from './AttendanceCalendar';
import { AlertTriangle, Calendar } from 'lucide-react';

export function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'applications' | 'legacy' | 'assignments' | 'fees' | 'grievances' | 'rectification'>('requests');
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [selectedRectifyAssignment, setSelectedRectifyAssignment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      setRequests(data.parentRequests || []);
      setApplications(data.tutorApplications || []);

      if (token) {
        const resGrv = await fetch('/api/grievances', { headers: { 'Authorization': `Bearer ${token}` } });
        if (resGrv.ok) setGrievances(await resGrv.json() || []);

        const resAsg = await fetch('/api/admin/assignments', { headers: { 'Authorization': `Bearer ${token}` } });
        if (resAsg.ok) {
          const asgData = await resAsg.json();
          setAllAssignments(asgData || []);
          if (asgData && asgData.length > 0) setSelectedRectifyAssignment(asgData[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveTutor = async (appId: string) => {
    try {
      const res = await fetch('/api/tutor-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      if (res.ok) {
        alert('Tutor application approved and added to active directory successfully!');
        fetchAdminData();
      } else {
        alert('Failed to approve tutor application.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during approval.');
    }
  };

  const handleRejectTutor = async (appId: string) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    try {
      const res = await fetch('/api/tutor-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        alert('Failed to reject tutor application.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during rejection.');
    }
  };

  const handleUpdateStatus = async (reqId: string, status: string) => {
    try {
      const res = await fetch('/api/parent-request-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reqId, status })
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during update.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-[#2C3317] text-white p-6 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="font-extrabold text-lg">Academic Control Console</h3>
          </div>
          <p className="text-xs text-[#E9EDDE] font-medium mt-1">Manage tuition operations & onboard verified mentors</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden text-sm font-bold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'requests'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Demo Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tutor Onboarding ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('legacy')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'legacy'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Add Legacy Tutor
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'assignments'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'fees'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Fees
        </button>
        <button
          onClick={() => setActiveTab('grievances')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'grievances'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Grievances
        </button>
        <button
          onClick={() => setActiveTab('rectification')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'rectification'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Attendance Edit
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[400px]">
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading operational logs...</div>
        ) : activeTab === 'requests' ? (
          /* Parent Demo Requests List */
          requests.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold">No demo requests received yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
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
                      <User className="w-4 h-4 text-slate-400" />
                      <span><strong>{req.parentName}</strong> (+91 {req.phone})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{req.city} {req.locality ? `(${req.locality})` : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="truncate">Subjects: {req.subjects?.join(', ')}</span>
                    </div>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{req.notes}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <select 
                      className="text-xs border border-slate-300 rounded px-2 py-1 w-full font-medium"
                      value={req.status}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Demo Scheduled">Demo Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'applications' ? (
          /* Tutor Onboarding List */
          applications.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold">No pending mentor registrations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-xs border border-indigo-100">
                      {app.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      Review Needed
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-lg text-slate-900">{app.fullName}</h4>
                    <p className="text-slate-600 text-sm font-medium">{app.qualification} ({app.experienceYears} Yrs Exp)</p>
                  </div>

                  <div className="text-slate-600 text-sm space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div><strong>Email:</strong> {app.email}</div>
                    <div><strong>Teaching:</strong> {app.subjects?.join(', ')}</div>
                    <div><strong>Boards:</strong> {app.boards?.join(', ')}</div>
                    <div><strong>Cities:</strong> {app.cities?.join(', ')}</div>
                    <div className="text-slate-500 mt-2 italic text-xs">"{app.bio}"</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${app.phone}`}
                      className="p-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700"
                      title="Call Tutor"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleRejectTutor(app.id)}
                      className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-center text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleApproveTutor(app.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'legacy' ? (
          <LegacyTutorForm />
        ) : activeTab === 'assignments' ? (
          <AssignmentsManager />
        ) : activeTab === 'fees' ? (
          <FeeManager />
        ) : activeTab === 'rectification' ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Attendance Rectification</h3>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Assignment to Edit</label>
              <select 
                value={selectedRectifyAssignment} 
                onChange={(e) => setSelectedRectifyAssignment(e.target.value)}
                className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-700"
              >
                {allAssignments.map((asg: any) => (
                  <option key={asg.id} value={asg.id}>
                    {asg.tutor_name} teaching {asg.student_name}
                  </option>
                ))}
              </select>
            </div>
            {selectedRectifyAssignment && token && (
              <AttendanceCalendar assignmentId={selectedRectifyAssignment} token={token} role="ADMIN" />
            )}
          </div>
        ) : activeTab === 'grievances' ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Manage Grievances</h3>
            
            {grievances.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold">No grievances found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {grievances.map(g => (
                  <div key={g.id} className="border border-slate-200 rounded-lg p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-slate-800">{g.grievance_type}</div>
                        <div className="text-xs text-slate-500">ID: {g.id} • {new Date(g.created_at).toLocaleString()}</div>
                      </div>
                      <select 
                        value={g.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await fetch('/api/admin/grievance', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                              body: JSON.stringify({ id: g.id, status: newStatus })
                            });
                            if (res.ok) {
                              setGrievances(grievances.map(grv => grv.id === g.id ? { ...grv, status: newStatus } : grv));
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className={`text-xs font-bold px-2 py-1 rounded border-0 outline-none ${
                          g.status === 'Open' ? 'bg-rose-100 text-rose-700' :
                          g.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                      {g.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
