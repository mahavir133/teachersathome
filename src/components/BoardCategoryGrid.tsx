import React from 'react';
import { BookOpen, GraduationCap, Award, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { BoardType } from '../types';

interface BoardCategoryGridProps {
  onSelectBoardFilter: (board: BoardType) => void;
  onRequestTutor: () => void;
}

export const BoardCategoryGrid: React.FC<BoardCategoryGridProps> = ({ onSelectBoardFilter, onRequestTutor }) => {
  const boards = [
    {
      title: 'CBSE Board',
      subtitle: 'Central Board of Secondary Education',
      classes: 'Class 1st to 12th (PCM, PCB, Commerce)',
      desc: 'NCERT aligned conceptual teaching, sample paper drills, and board exam answer presentation strategies.',
      boardKey: 'CBSE' as BoardType,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Most Popular'
    },
    {
      title: 'ICSE & ISC Board',
      subtitle: 'Council for the Indian School Certificate Examinations',
      classes: 'Class 1st to 10th ICSE & Class 11-12 ISC',
      desc: 'In-depth literature, ICSE Java programming, detailed Science numericals, and exhaustive grammar syllabus.',
      boardKey: 'ICSE/ISC' as BoardType,
      color: 'from-purple-600 to-indigo-800',
      badge: 'In-Depth Curriculum'
    },
    {
      title: 'JAC Board (Jharkhand)',
      subtitle: 'Jharkhand Academic Council',
      classes: 'Class 1st to 12th Arts, Science, Commerce',
      desc: 'Specialized tutors in Ranchi, Jamshedpur, Dhanbad & Bokaro familiar with JAC board textbook solutions.',
      boardKey: 'JAC' as BoardType,
      color: 'from-emerald-600 to-teal-800',
      badge: 'Jharkhand State Hub'
    },
    {
      title: 'BSEB Board (Bihar)',
      subtitle: 'Bihar School Examination Board',
      classes: 'Class 1st to 12th Matric & Inter',
      desc: 'Expert mentors in Patna, Gaya & Bihar cities for high scoring in BSEB objective + subjective paper formats.',
      boardKey: 'BSEB' as BoardType,
      color: 'from-amber-600 to-orange-700',
      badge: 'Bihar State Special'
    },
    {
      title: 'IIT-JEE & NEET Medical',
      subtitle: 'Engineering & Medical Entrance Coaching',
      classes: 'Class 11, 12 & Droppers',
      desc: '1-on-1 coaching by Ex-IITians & Doctors for JEE Main, Advanced, and NEET Physics, Chemistry, Biology.',
      boardKey: 'CBSE' as BoardType,
      color: 'from-rose-600 to-red-800',
      badge: 'Top Rank Focus'
    },
    {
      title: 'IB / IGCSE Board',
      subtitle: 'International Baccalaureate & Cambridge',
      classes: 'Primary Years, MYP & IB Diploma',
      desc: 'Global curriculum tutors with expert assistance for Internal Assessments (IAs), Extended Essays, and Past Papers.',
      boardKey: 'IB/IGCSE' as BoardType,
      color: 'from-indigo-600 to-slate-800',
      badge: 'Global Standard'
    }
  ];

  return (
    <section id="boards" className="py-16 bg-white border-b border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider">
            All Boards & Curriculums Covered
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            Tailored Home Tuition for Every Educational Board
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            Whether your child is in CBSE, ICSE, JAC, or preparing for JEE/NEET, our tutors bring exact board-specific teaching expertise to your living room.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F2F4EF] rounded-2xl p-6 border border-[#E6E8E1] hover:border-[#D1D5CB] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E9EDDE] text-[#2C3317] border border-[#D1D5CB]">
                    {item.badge}
                  </span>
                  <BookOpen className="w-5 h-5 text-[#708238] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-lg font-black text-[#2C3317] mb-0.5">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-[#708238] mb-2">
                  {item.subtitle}
                </p>

                <div className="bg-white p-2.5 rounded-xl border border-[#E6E8E1] text-xs font-semibold text-[#3D441E] mb-3">
                  🎯 {item.classes}
                </div>

                <p className="text-xs text-[#5C6348] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E6E8E1] flex items-center justify-between">
                <button
                  onClick={() => onSelectBoardFilter(item.boardKey)}
                  className="text-xs font-extrabold text-[#708238] hover:text-[#5A692D] flex items-center gap-1 cursor-pointer"
                >
                  <span>Filter Tutors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onRequestTutor}
                  className="text-xs font-bold text-[#3D441E] hover:text-[#708238] cursor-pointer"
                >
                  Book Demo →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
