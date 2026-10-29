import React from 'react';
import { SCHOOL_ADMISSIONS } from './SchoolAdmissionsSection';

interface AdmissionsMarqueeProps {
  onSchoolClick?: (schoolName: string) => void;
}

export const AdmissionsMarquee: React.FC<AdmissionsMarqueeProps> = ({ onSchoolClick }) => {
  const handleClick = (e: React.MouseEvent, schoolName: string, url: string) => {
    if (onSchoolClick) {
      onSchoolClick(schoolName);
    } else {
      const section = document.getElementById('ranchi-school-admissions');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <aside 
      aria-label="Ranchi School Admissions News Ticker"
      className="bg-gradient-to-r from-red-700 via-rose-600 to-amber-600 text-white py-2 px-3 shadow-md overflow-hidden relative z-30 border-b border-red-800/40"
    >
      <div className="flex items-center">
        {/* Fixed Title Label & Help Link */}
        <div className="shrink-0 flex items-center gap-1.5 mr-3">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-black uppercase tracking-wider border border-white/20 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            <span className="text-yellow-300">ADMISSIONS OPEN</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const helpDesk = document.getElementById('admission-help-box');
              if (helpDesk) {
                helpDesk.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus highlight flash
                helpDesk.classList.add('ring-4', 'ring-yellow-400');
                setTimeout(() => helpDesk.classList.remove('ring-4', 'ring-yellow-400'), 2500);
              }
            }}
            title="Need help with school admission or entrance prep? Open Portal Admin Help Desk"
            className="flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-red-950 font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-md shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider whitespace-nowrap"
          >
            <span className="animate-pulse text-xs">💬</span>
            <span>Admin Assistance</span>
          </button>
        </div>

        {/* Running Marquee Container */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-6 text-xs sm:text-sm font-semibold tracking-wide">
            {Array.from({ length: 2 }).map((_, repeatIdx) => (
              <React.Fragment key={repeatIdx}>
                <span className="text-white/90 font-medium">
                  Ranchi Top Schools Admission 2027-28 Links:
                </span>
                {SCHOOL_ADMISSIONS.map((school) => (
                  <button
                    key={`${repeatIdx}-${school.id}`}
                    type="button"
                    onClick={(e) => handleClick(e, school.name, school.url)}
                    className="inline-flex items-center gap-1.5 hover:underline focus:outline-hidden hover:text-yellow-200 transition-colors cursor-pointer group"
                  >
                    <span className="text-yellow-300 font-bold">★</span>
                    <span className="font-bold text-white group-hover:text-yellow-200">{school.name}</span>
                    <span className="text-[10px] text-white/80 bg-white/20 px-1.5 py-0.2 rounded font-normal hidden sm:inline">
                      {school.location.split(',')[0]}
                    </span>
                  </button>
                ))}
                <span className="bg-yellow-300 text-red-950 px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                  Apply Online Below ↗
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
