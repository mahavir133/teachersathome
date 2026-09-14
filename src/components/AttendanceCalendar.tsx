import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X, Minus } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  assignment_id: string;
  class_date: string;
  status: 'Present' | 'Absent' | 'Cancelled';
  marked_by: string;
}

interface AttendanceCalendarProps {
  assignmentId: string;
  token: string;
  role: 'TUTOR' | 'PARENT' | 'ADMIN';
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ assignmentId, token, role }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/attendance?assignment_id=${assignmentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecords(data);
        }
      } catch (err) {
        console.error("Failed to load attendance", err);
      }
      setLoading(false);
    };
    fetchAttendance();
  }, [assignmentId, token]);

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const handleMarkAttendance = async (dateStr: string, status: 'Present' | 'Absent' | 'Cancelled') => {
    if (role === 'PARENT') return; // Parents cannot mark attendance
    
    try {
      const existing = records.find(r => r.class_date === dateStr);
      
      const payload = {
        id: existing?.id,
        assignment_id: assignmentId,
        class_date: dateStr,
        status,
        marked_by: role
      };

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Optimistic update
        setRecords(prev => {
          const filtered = prev.filter(r => r.class_date !== dateStr);
          return [...filtered, { ...payload, id: existing?.id || Date.now().toString() } as AttendanceRecord];
        });
      }
    } catch (err) {
      console.error("Failed to mark attendance", err);
    }
  };

  // Calendar generation logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getRecordForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.find(r => r.class_date === dateStr);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Class Attendance
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-slate-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold w-32 text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-slate-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-slate-500">Loading calendar...</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="h-20 bg-slate-50/50 rounded-lg border border-transparent"></div>;
              
              const record = getRecordForDate(day);
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div key={`day-${day}`} className={`h-20 rounded-lg border flex flex-col p-1.5 transition-colors ${isToday ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`text-xs font-bold ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</div>
                  
                  <div className="flex-1 flex items-center justify-center mt-1">
                    {record ? (
                      <div className={`flex flex-col items-center justify-center w-full h-full rounded ${
                        record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                        record.status === 'Absent' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {record.status === 'Present' && <Check className="w-4 h-4" />}
                        {record.status === 'Absent' && <X className="w-4 h-4" />}
                        {record.status === 'Cancelled' && <Minus className="w-4 h-4" />}
                        <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">{record.status}</span>
                      </div>
                    ) : (
                      (role === 'TUTOR' || role === 'ADMIN') && (
                        <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                          <button onClick={() => handleMarkAttendance(dateStr, 'Present')} className="p-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200" title="Present">
                            <Check className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleMarkAttendance(dateStr, 'Absent')} className="p-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200" title="Absent">
                            <X className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleMarkAttendance(dateStr, 'Cancelled')} className="p-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200" title="Cancelled">
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex items-center gap-4 text-xs font-medium text-slate-500 border-t pt-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center"><Check className="w-2 h-2" /></div> Present</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-100 text-rose-700 rounded flex items-center justify-center"><X className="w-2 h-2" /></div> Absent</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-100 text-amber-700 rounded flex items-center justify-center"><Minus className="w-2 h-2" /></div> Cancelled</div>
          </div>
        </>
      )}
    </div>
  );
}
