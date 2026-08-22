import React from 'react';
import { FileText, UserCheck, Sparkles, CheckCircle2, PhoneCall, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onRequestTutor: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onRequestTutor }) => {
  const steps = [
    {
      stepNum: '01',
      title: 'Submit Your Requirements',
      desc: 'Fill out our simple form with student class, board, preferred subjects, locality address, and preferred timing.',
      icon: <FileText className="w-6 h-6 text-[#708238]" />,
      color: 'bg-[#FAF9F6] border-[#E6E8E1]'
    },
    {
      stepNum: '02',
      title: 'Get Matched in 24 Hours',
      desc: 'Our Academic Counselor selects 2-3 top verified mentors near your location who match your exact criteria.',
      icon: <PhoneCall className="w-6 h-6 text-[#708238]" />,
      color: 'bg-[#FAF9F6] border-[#E6E8E1]'
    },
    {
      stepNum: '03',
      title: '100% Free Home Demo Class',
      desc: 'The tutor visits your home for a 1-hour free trial lesson. Parents can sit in and assess teaching quality.',
      icon: <Sparkles className="w-6 h-6 text-[#708238]" />,
      color: 'bg-[#FAF9F6] border-[#E6E8E1]'
    },
    {
      stepNum: '04',
      title: 'Confirm & Start Regular Classes',
      desc: 'Satisfied with the demo? Confirm the schedule and pay monthly fee. Enjoy weekly tests & free replacement guarantee.',
      icon: <CheckCircle2 className="w-6 h-6 text-[#708238]" />,
      color: 'bg-[#FAF9F6] border-[#E6E8E1]'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-[#F2F4EF] border-b border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider">
            Simple & Transparent Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            How Teachers At Home Works in 4 Easy Steps
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            Zero hassle. Zero advance registration fees. You only pay after attending a free demo session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E6E8E1] shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${s.color}`}>
                    {s.icon}
                  </div>
                  <span className="text-2xl font-black text-[#D1D5CB]">
                    {s.stepNum}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#2C3317] mb-2">
                  {s.title}
                </h3>

                <p className="text-xs text-[#5C6348] leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#D1D5CB]">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onRequestTutor}
            className="px-6 py-3.5 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Book Your Free Home Demo Class Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
