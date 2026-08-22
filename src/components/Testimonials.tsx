import React from 'react';
import { Star, Quote, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/content';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-[#F2F4EF] border-b border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Success Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            Trusted by 25,000+ Happy Parents Across Jharkhand & Bihar
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            Read real feedback from parents who transformed their children’s academic confidence and board results with Teachers At Home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-[#E6E8E1] shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {/* Top Rating & City Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#708238]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#708238]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#2C3317] bg-[#E9EDDE] px-2.5 py-0.5 rounded-full border border-[#D1D5CB]">
                    📍 {item.city}
                  </span>
                </div>

                {/* Score Improvement Badge */}
                <div className="mb-3 inline-flex items-center gap-1.5 bg-[#FAF9F6] text-[#2C3317] border border-[#D1D5CB] text-xs font-extrabold px-3 py-1 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-[#708238]" />
                  <span>{item.improvementText}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#3D441E] leading-relaxed font-normal italic mb-4">
                  "{item.reviewText}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-[#E6E8E1] flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-[#2C3317]">{item.parentName}</div>
                  <div className="text-[11px] text-[#5C6348]">
                    Parent of {item.studentName} ({item.studentClass})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#5C6348] font-medium">Tutor Assigned:</div>
                  <div className="font-bold text-[#708238] text-xs">{item.tutorAssigned}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
