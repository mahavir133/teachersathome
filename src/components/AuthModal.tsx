import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('PARENT');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');

        login(data.token, data.user);
        onClose();
        navigate('/dashboard');
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role, phone }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMode('login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'login' 
                ? 'Welcome back to Teachers At Home' 
                : 'Join our platform to get started'}
            </p>
          </div>
          
          {success ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-center font-medium">
              Registration successful! Switching to login...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">I am a...</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PARENT">Parent / Student</option>
                    <option value="TUTOR">Tutor</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. hello@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mode === 'login' ? (
                  <><LogIn className="w-4 h-4" /> {loading ? 'Signing In...' : 'Sign In'}</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> {loading ? 'Registering...' : 'Create Account'}</>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-600">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => { setMode('register'); setError(''); }} className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
