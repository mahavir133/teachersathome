import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw, UserCheck, Eye, TrendingUp, CheckCircle, Award } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/content';

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  UserCheck: <UserCheck className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-[#F2F4EF] border-y border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider">
            Why Parents Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            The Heart-Led Mentorship Approach for Guaranteed Board Success
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            We don’t just send tutors; we match verified mentors who build student confidence, conceptual clarity, and self-discipline right in your home.
          </p>
        </div>

        {/* 6 Core Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 border border-[#E6E8E1] shadow-xs hover:border-[#D1D5CB] hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-bold bg-[#FAF9F6] text-[#708238] border border-[#E6E8E1]">
                {iconMap[item.icon] || <Award className="w-6 h-6" />}
              </div>

              <h3 className="text-lg font-extrabold text-[#2C3317] mb-2 group-hover:text-[#708238] transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-[#5C6348] leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Verification Standards Callout */}
        <div className="mt-12 bg-[#2C3317] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#E9EDDE] font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#708238]" />
              <span>3-Layer Safety & Quality Audit</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Every Mentor Passes Background Check & Teaching Audits
            </h3>
            <p className="text-xs text-[#E2E6D5] max-w-xl">
              1) Identity & Address Verification via Aadhaar. 2) Qualification & Degree Certificate Checks. 3) Live 1-on-1 Mock Teaching Class before registration.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a 
              href="tel:+918340543395"
              className="px-6 py-3 bg-[#708238] hover:bg-[#5A692D] text-white text-xs font-black rounded-full shadow-md transition-colors flex items-center gap-2"
            >
              <span>Speak to Academic Counselor</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
