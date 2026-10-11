import React, { useState, useEffect } from 'react';
import { 
  School, 
  Phone, 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  User, 
  FileText,
  Save,
  Check
} from 'lucide-react';
import { AdmissionHelpRequest } from '../types';

export function SchoolAdmissionsManager() {
  const [inquiries, setInquiries] = useState<AdmissionHelpRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [schoolFilter, setSchoolFilter] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/school-admissions/help');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data || []);
      }
    } catch (err) {
      console.error('Failed to load admission inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/school-admissions/help/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev =>
          prev.map(item => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdatingId(id);
    try {
      const item = inquiries.find(i => i.id === id);
      const res = await fetch('/api/school-admissions/help/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: item?.status || 'Pending',
          adminNotes: noteText.trim()
        })
      });
      if (res.ok) {
        setInquiries(prev =>
          prev.map(i => (i.id === id ? { ...i, admin_notes: noteText.trim() } : i))
        );
        setEditingNotesId(null);
      } else {
        alert('Failed to save notes');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving notes');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch =
      (item.parent_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.school_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.query_message || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;

    const matchesSchool =
      schoolFilter === 'All' || (item.school_name || '').includes(schoolFilter);

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const totalCount = inquiries.length;
  const pendingCount = inquiries.filter(i => i.status === 'Pending').length;
  const contactedCount = inquiries.filter(i => i.status === 'Contacted' || i.status === 'In Progress').length;
  const resolvedCount = inquiries.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-[#2C3317] via-[#3D441E] to-[#2C3317] text-white p-6 rounded-2xl shadow-md border border-[#5C6348]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-red-600 rounded-xl text-white shadow-xs">
                <School className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">
                School Admission Help Requests
              </h2>
            </div>
            <p className="text-xs text-[#E2E6D5] mt-1">
              Direct inquiries submitted from Ranchi school admission links on Teachers At Home front portal.
            </p>
          </div>

          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <div className="text-[11px] font-semibold text-[#D1D5CB]">Total Inquiries</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalCount}</div>
          </div>

          <div className="bg-amber-500/20 rounded-xl p-3 border border-amber-400/30">
            <div className="text-[11px] font-semibold text-amber-200 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
              </span>
              <span>Pending Follow-ups</span>
            </div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{pendingCount}</div>
          </div>

          <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-400/30">
            <div className="text-[11px] font-semibold text-blue-200">Contacted / In Progress</div>
            <div className="text-2xl font-black text-blue-300 mt-0.5">{contactedCount}</div>
          </div>

          <div className="bg-emerald-500/20 rounded-xl p-3 border border-emerald-400/30">
            <div className="text-[11px] font-semibold text-emerald-200">Resolved / Enrolled</div>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Parent name, Phone, Ticket ID, or School..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#708238] bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-[#2C3317] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'All' || schoolFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setSchoolFilter('All');
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-[#708238] animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-semibold">Loading admission inquiries...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No admission help requests found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm || statusFilter !== 'All' ? 'Try adjusting your search filters.' : 'New queries submitted on the website will show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => {
            const schoolTags = (inq.school_name || 'General Guidance')
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);

            const isEditingNotes = editingNotesId === inq.id;

            return (
              <div
                key={inq.id}
                className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-4"
              >
                {/* Header Row: ID, Badges, Status selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-black tracking-wide border border-red-200">
                      {inq.id}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      inq.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                      inq.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {inq.status || 'Pending'}
                    </span>

                    {inq.created_at && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(inq.created_at).toLocaleString('en-IN')}</span>
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Update Status:</span>
                    <select
                      value={inq.status || 'Pending'}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors cursor-pointer ${
                        inq.status === 'Resolved' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        inq.status === 'Contacted' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                        inq.status === 'In Progress' ? 'bg-indigo-50 text-indigo-900 border-indigo-300' :
                        'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Parent & School Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
                  
                  {/* Left Column: Parent Details & Direct Action Buttons */}
                  <div className="md:col-span-4 space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#708238] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#2C3317]">
                          {inq.parent_name || 'Parent (Not Named)'}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold">
                          +91 {inq.phone}
                        </div>
                      </div>
                    </div>

                    {/* Quick Call & WhatsApp Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Parent</span>
                      </a>

                      <a
                        href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hello ${inq.parent_name || 'Parent'}, I am the Academic Counselor from Teachers At Home reaching out regarding your admission inquiry for: ${inq.school_name || 'Schools'}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Target Schools & Query Message */}
                  <div className="md:col-span-8 space-y-3">
                    
                    {/* Schools Selected Tags */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-[#708238]" />
                        <span>Target Schools ({schoolTags.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {schoolTags.map((name, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F2F4EF] text-[#2C3317] border border-[#D5DDC8] rounded-lg text-xs font-bold shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#708238]"></span>
                            <span>{name}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="bg-[#FAFBF7] p-3 rounded-xl border border-[#E8EDE0]">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Parent Requirement / Message:</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                        {inq.query_message || 'Parent requested admission guidance and entrance preparation home tuition.'}
                      </p>
                    </div>

                    {/* Admin Follow-up Notes */}
                    <div className="pt-1">
                      {isEditingNotes ? (
                        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <label className="block text-xs font-bold text-slate-700">
                            Counselor / Admin Notes:
                          </label>
                          <textarea
                            rows={2}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add internal notes (e.g. Called parent on 11 Oct, advised syllabus for Class 1, tutor demo scheduled)..."
                            className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#708238] bg-white resize-none"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveNotes(inq.id)}
                              disabled={updatingId === inq.id}
                              className="px-3 py-1 bg-[#708238] hover:bg-[#5C6B2F] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save Notes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-500">Admin Notes:</span>
                            <span className="italic">{inq.admin_notes || 'No follow-up notes yet.'}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(inq.id);
                              setNoteText(inq.admin_notes || '');
                            }}
                            className="text-xs font-bold text-[#708238] hover:underline cursor-pointer shrink-0"
                          >
                            {inq.admin_notes ? 'Edit Notes' : '+ Add Note'}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
