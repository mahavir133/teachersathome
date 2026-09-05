import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Assignment, ParentRequest, Tutor } from '../types';
import { Edit2, Trash2, X, Check } from 'lucide-react';

export function AssignmentsManager() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fee_agreed: '', status: '' });

  const [newAssignment, setNewAssignment] = useState({
    tutor_id: '',
    request_id: '',
    fee_agreed: '3000'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [assRes, reqRes, tutRes] = await Promise.all([
        fetch('/api/admin/assignments', { headers }),
        fetch('/api/requests', { headers }),
        fetch('/api/tutors')
      ]);

      const assData = await assRes.json();
      const reqData = await reqRes.json();
      const tutData = await tutRes.json();

      setAssignments(assData || []);
      setRequests((reqData.parentRequests || []).filter((r: any) => r.status !== 'Completed' && r.status !== 'Rejected'));
      setTutors(tutData || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load assignments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.tutor_id || !newAssignment.request_id || !newAssignment.fee_agreed) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAssignment)
      });
      if (res.ok) {
        setNewAssignment({ tutor_id: '', request_id: '', fee_agreed: '3000' });
        fetchData();
        alert("Assignment created successfully");
      } else {
        alert("Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating assignment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(`/api/admin/assignments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Assignment Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">New Tutor Assignment</h3>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleCreateAssignment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">Parent Request</label>
            <select
              value={newAssignment.request_id}
              onChange={e => setNewAssignment({ ...newAssignment, request_id: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Request</option>
              {requests.map(req => (
                <option key={req.id} value={req.id}>
                  {req.parentName} - {req.city} ({req.subjects?.join(', ')})
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">Assign Tutor</label>
            <select
              value={newAssignment.tutor_id}
              onChange={e => setNewAssignment({ ...newAssignment, tutor_id: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Tutor</option>
              {tutors.map(tut => (
                <option key={tut.id} value={tut.id}>
                  {tut.name} - {tut.cities?.join(', ')}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-slate-700 mb-1">Agreed Monthly Fee</label>
            <input
              type="number"
              value={newAssignment.fee_agreed}
              onChange={e => setNewAssignment({ ...newAssignment, fee_agreed: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. 3000"
            />
          </div>

          <div className="md:col-span-1">
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
              Assign Tutor
            </button>
          </div>
        </form>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
          Active Mappings
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No assignments created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Parent</th>
                  <th className="p-4">Tutor</th>
                  <th className="p-4">Subjects</th>
                  <th className="p-4">Agreed Fee</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-500">{a.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{a.parentName}</div>
                      <div className="text-xs text-slate-500">{a.parentPhone} • {a.city}</div>
                    </td>
                    <td className="p-4 font-bold text-indigo-700">{a.tutorName}</td>
                    <td className="p-4 text-slate-600">{a.subjects?.join(', ')}</td>
                    
                    <td className="p-4 font-black text-emerald-600">
                      {editingId === a.id ? (
                        <input 
                          type="number" 
                          value={editForm.fee_agreed} 
                          onChange={e => setEditForm({...editForm, fee_agreed: e.target.value})}
                          className="w-24 border rounded p-1 text-sm"
                        />
                      ) : (
                        `₹${a.fee_agreed}`
                      )}
                    </td>
                    
                    <td className="p-4 text-slate-500">{new Date(a.assigned_date).toLocaleDateString()}</td>
                    
                    <td className="p-4">
                      {editingId === a.id ? (
                        <select 
                          value={editForm.status}
                          onChange={e => setEditForm({...editForm, status: e.target.value})}
                          className="border rounded p-1 text-sm"
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          a.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          a.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {a.status}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {editingId === a.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditSave(a.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingId(a.id);
                              setEditForm({ fee_agreed: a.fee_agreed.toString(), status: a.status });
                            }} 
                            className="text-slate-400 hover:text-indigo-600 p-1 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(a.id)} 
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
