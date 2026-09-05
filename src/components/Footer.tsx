import React from 'react';
import { GraduationCap, Phone, MessageSquare, Mail, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onRequestTutor: () => void;
  onBecomeTutor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRequestTutor, onBecomeTutor }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Teachers At Home Logo" className="h-12 w-auto object-contain bg-white rounded-xl px-2 py-1 shadow-md" />
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              India's premier 1-on-1 home tuition platform connecting students with verified mentors across Ranchi, Patna, Jamshedpur, Dhanbad, Bokaro, Ramgarh & pan-India for CBSE, ICSE, JAC, BSEB & Competitive Exams.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="tel:+918340543395"
                className="px-3.5 py-2 bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-700/50 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 83405 43395</span>
              </a>

              <a
                href="https://wa.me/918340543395?text=Hello%20Teachers%20At%20Home"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={onRequestTutor} className="hover:text-white transition-colors">Request a Home Tutor</button></li>
              <li><button onClick={onBecomeTutor} className="hover:text-white transition-colors">Join as Home Tutor</button></li>
              <li><a href="#fee-calculator" className="hover:text-white transition-colors">Monthly Fee Calculator</a></li>
              <li><a href="#tutors" className="hover:text-white transition-colors">Verified Tutors Directory</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Col 3: Boards & Classes */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Boards Covered</h4>
            <ul className="space-y-2">
              <li>CBSE Board (Class 1-12)</li>
              <li>ICSE / ISC Board</li>
              <li>JAC Board (Jharkhand Academic Council)</li>
              <li>BSEB Board (Bihar School Board)</li>
              <li>IIT-JEE Main & Advanced</li>
              <li>NEET Medical Preparation</li>
              <li>IB / IGCSE International</li>
            </ul>
          </div>

          {/* Col 4: Major Cities */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Coverage Cities</h4>
            <ul className="space-y-2">
              <li>Ranchi (Lalpur, Harmu, Kanke, Bariatu)</li>
              <li>Patna (Boring Rd, Kankerbagh, Bailey Rd)</li>
              <li>Jamshedpur (Bistupur, Sakchi, Telco)</li>
              <li>Dhanbad (Bank More, Saraidhela)</li>
              <li>Bokaro Steel City (Sector 4, Chas)</li>
              <li>Ramgarh & Hazaribagh</li>
              <li>Kolkata & Delhi NCR</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>Teachers At Home</strong>. All rights reserved and designed and developed by TirkeyTrix Tech Solutions.
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Building student confidence across India with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>

    </footer>
  );
};
