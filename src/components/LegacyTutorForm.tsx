import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export function LegacyTutorForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    experienceYears: '5',
    subjects: 'Mathematics, Science',
    cities: 'Ranchi',
    mode: 'Home Tuition',
    gender: 'Female',
    pricePerHour: '300',
    pricePerMonth: '3000',
    boards: 'CBSE',
    localities: 'Lalpur'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()),
        cities: formData.cities.split(',').map(s => s.trim()),
        boards: formData.boards.split(',').map(s => s.trim()),
        localities: formData.localities.split(',').map(s => s.trim())
      };

      const res = await fetch('/api/admin/legacy-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add tutor');

      setSuccess(true);
      setFormData({
        name: '', email: '', phone: '', password: '', qualification: '', experienceYears: '5',
        subjects: '', cities: '', mode: 'Home Tuition', gender: 'Female', pricePerHour: '300',
        pricePerMonth: '3000', boards: '', localities: ''
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Add Legacy Tutor Profile</h3>
      <p className="text-sm text-slate-500 mb-6">
        Create a live tutor profile directly. They will be able to log in using the email and password you set.
      </p>

      {success && (
        <div className="mb-4 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
          Tutor added successfully! They can now log in.
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input type="text" name="password" required value={formData.password} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Temporary password" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Qualification</label>
            <input type="text" name="qualification" required value={formData.qualification} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Experience (Years)</label>
            <input type="number" name="experienceYears" required value={formData.experienceYears} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Subjects (comma separated)</label>
            <input type="text" name="subjects" required value={formData.subjects} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Boards (comma separated)</label>
            <input type="text" name="boards" required value={formData.boards} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Cities (comma separated)</label>
            <input type="text" name="cities" required value={formData.cities} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Localities (comma separated)</label>
            <input type="text" name="localities" required value={formData.localities} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Mode</label>
            <select name="mode" value={formData.mode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="Home Tuition">Home Tuition</option>
              <option value="Online 1-on-1">Online 1-on-1</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-4 disabled:opacity-50">
          {loading ? 'Adding Tutor...' : 'Add Legacy Tutor & Create Account'}
        </button>
      </form>
    </div>
  );
}
