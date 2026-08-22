import React from 'react';
import { X, Clock, CheckCircle2, Phone, Calendar, User, MapPin, Sparkles } from 'lucide-react';
import { ParentRequest } from '../types';

interface UserRequestsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ParentRequest[];
}

export const UserRequestsDrawer: React.FC<UserRequestsDrawerProps> = ({ isOpen, onClose, requests }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base">My Submitted Demo Requests</h3>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-indigo-800 rounded-lg text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50">
          {requests.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold">No submitted requests found</p>
              <p className="mt-1">When you request a free demo class, your request details will appear here.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
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
                    <span>Subjects: {req.subjects.join(', ')}</span>
                  </div>
                </div>

                {req.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{req.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                  <a
                    href={`https://wa.me/919334349207?text=Hello%20Teachers%20At%20Home,%20checking%20status%20for%20request%20${req.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Track via WhatsApp →
                  </a>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
