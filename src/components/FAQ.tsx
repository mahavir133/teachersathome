import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/content';

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Parents' | 'Demo Class' | 'Fees & Payment' | 'Tutors'>('All');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const categories = ['All', 'Parents', 'Demo Class', 'Fees & Payment', 'Tutors'];

  const filteredFaqs = FAQS.filter((f) => {
    if (activeCategory === 'All') return true;
    return f.category === activeCategory;
  });

  return (
    <section id="faqs" className="py-16 bg-white border-b border-[#E6E8E1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#708238]" />
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            Everything you need to know about booking home tutors, free demo classes, and safety protocols.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#708238] text-white shadow-xs'
                  : 'bg-[#F2F4EF] text-[#2C3317] hover:bg-[#E9EDDE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-[#E6E8E1] rounded-2xl bg-[#F2F4EF] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-[#2C3317] text-sm hover:text-[#708238] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#5C6348] shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#708238]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-[#5C6348] leading-relaxed border-t border-[#E6E8E1] font-normal">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
