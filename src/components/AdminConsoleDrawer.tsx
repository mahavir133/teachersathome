import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, Phone, Calendar, User, MapPin, Sparkles, ShieldCheck, Award, School, MessageSquare } from 'lucide-react';
import { ParentRequest, Tutor } from '../types';

interface AdminConsoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshTutors: () => void;
}

export const AdminConsoleDrawer: React.FC<AdminConsoleDrawerProps> = ({ isOpen, onClose, onRefreshTutors }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'applications' | 'admissions'>('requests');
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [admissionInquiries, setAdmissionInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      setRequests(data.parentRequests || []);
      setApplications(data.tutorApplications || []);
      setAdmissionInquiries(data.admissionHelpRequests || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

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
        onRefreshTutors();
      } else {
        alert('Failed to approve tutor application.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during approval.');
    }
  };

  const handleUpdateAdmissionStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/school-admissions/help/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="bg-[#2C3317] text-white p-5 flex items-center justify-between shrink-0 border-b border-[#3D441E]">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base">Academic Control Console</h3>
            </div>
            <p className="text-[10px] text-[#E9EDDE] font-medium">Manage tuition operations & onboard verified mentors</p>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-[#3D441E] rounded-lg text-[#E9EDDE]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#FAF9F6] border-b border-[#E6E8E1] text-xs font-bold">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-[#708238] text-[#2C3317] bg-white'
                : 'border-transparent text-[#5C6348] hover:text-[#2C3317]'
            }`}
          >
            Demo ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-[#708238] text-[#2C3317] bg-white'
                : 'border-transparent text-[#5C6348] hover:text-[#2C3317]'
            }`}
          >
            Tutors ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'admissions'
                ? 'border-red-600 text-red-700 bg-white font-black'
                : 'border-transparent text-[#5C6348] hover:text-[#2C3317]'
            }`}
          >
            Admissions ({admissionInquiries.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50">
          {loading ? (
            <div className="text-center py-16 text-xs text-[#5C6348]">Loading operational logs...</div>
          ) : activeTab === 'requests' ? (
            /* Demo Requests List */
            requests.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold">No demo requests received yet</p>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#708238] bg-[#F2F4EF] px-2 py-0.5 rounded-md border border-[#E6E8E1]">
                      {req.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {req.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">
                    {req.studentClass} • {req.board}
                  </div>

                  <div className="text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Parent: <strong>{req.parentName}</strong> (+91 {req.phone})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Location: <strong>{req.city}</strong> {req.locality ? `(${req.locality})` : ''}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Subjects: {req.subjects?.join(', ')}</span>
                    </div>
                  </div>

                  {req.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{req.notes}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                    Submitted: {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )
          ) : activeTab === 'applications' ? (
            /* Tutor Onboarding List */
            applications.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold">No pending mentor registrations</p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {app.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Pending Verification
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C3317]">{app.fullName}</h4>
                    <p className="text-[#5C6348] text-[11px] font-medium">{app.qualification} ({app.experienceYears} Years Exp)</p>
                  </div>

                  <div className="text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    <div><strong>Teaching:</strong> {app.subjects?.join(', ')}</div>
                    <div><strong>Boards:</strong> {app.boards?.join(', ')}</div>
                    <div><strong>Cities:</strong> {app.cities?.join(', ')}</div>
                    <div><strong>Preferred Mode:</strong> {app.preferredMode}</div>
                    <div className="text-slate-400 mt-1 italic">"{app.bio}"</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveTutor(app.id)}
                      className="flex-1 py-2 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-center rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Approve & Publish Live
                    </button>
                    <a
                      href={`tel:${app.phone}`}
                      className="p-2 border border-[#D1D5CB] hover:bg-slate-100 rounded-lg text-[#3D441E] flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))
            )
          ) : (
            /* School Admission Help Requests */
            admissionInquiries.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                <School className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold">No school admission help requests yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Queries submitted from front page will appear here</p>
              </div>
            ) : (
              admissionInquiries.map((inq: any) => (
                <div
                  key={inq.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                      {inq.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inq.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {inq.status || 'Pending'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-[#2C3317]">
                      {inq.parent_name || 'Parent (Name not provided)'}
                    </h4>
                    <p className="text-[#708238] font-bold text-xs flex items-center gap-1 mt-0.5">
                      <School className="w-3.5 h-3.5" />
                      <span>{inq.school_name || 'General Admission Guidance'}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                    <div className="font-semibold text-slate-500 text-[10px] uppercase">Query Message:</div>
                    <div className="italic font-normal">
                      "{inq.query_message || 'Requested assistance with form filling and entrance prep.'}"
                    </div>
                    {inq.created_at && (
                      <div className="text-[10px] text-slate-400 pt-1">
                        Received: {new Date(inq.created_at).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={inq.status || 'Pending'}
                      onChange={(e) => handleUpdateAdmissionStatus(inq.id, e.target.value)}
                      className="flex-1 py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-[#708238]"
                    >
                      <option value="Pending">Status: Pending</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="In Progress">Status: In Progress</option>
                      <option value="Resolved">Status: Resolved</option>
                    </select>

                    <a
                      href={`tel:${inq.phone}`}
                      className="p-2 border border-[#D1D5CB] hover:bg-slate-100 rounded-lg text-[#3D441E] flex items-center justify-center title='Call Parent'"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </a>

                    <a
                      href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${inq.parent_name || 'Parent'}, this is the Admin from Teachers At Home regarding your admission inquiry for ${inq.school_name || 'School'}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-[#25D366]/40 hover:bg-emerald-50 rounded-lg text-emerald-600 flex items-center justify-center title='WhatsApp Parent'"
                    >
                      <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    </a>
                  </div>
                </div>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );
};
