import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, Clock, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 bg-[#2C3317] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black text-[#E9EDDE] bg-[#708238]/20 border border-[#708238]/40 px-3 py-1 rounded-full uppercase tracking-wider">
              Need Assistance? Reach Us Anytime
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Get in Touch with Our Academic Counselors
            </h2>

            <p className="text-sm text-[#D1D5CB] leading-relaxed font-normal">
              Have questions about tutor availability in your locality, fee structure, or board syllabus? Call or WhatsApp us directly.
            </p>

            <div className="space-y-4 pt-2">
              
              <a
                href="tel:+919334349207"
                className="flex items-center gap-4 p-4 bg-[#3D441E]/60 hover:bg-[#3D441E] rounded-2xl border border-[#5C6348] transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#708238] text-white flex items-center justify-center font-bold shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#D1D5CB]">Direct Phone Support</div>
                  <div className="text-lg font-black text-white group-hover:text-[#E9EDDE] transition-colors">
                    +91 93343 49207
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/919334349207?text=Hello%20Teachers%20At%20Home,%20I%20have%20an%20inquiry%20regarding%20home%20tuition."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#708238]/20 hover:bg-[#708238]/30 rounded-2xl border border-[#708238]/40 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#708238] text-white flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#E9EDDE]">Instant WhatsApp Chat</div>
                  <div className="text-lg font-black text-white group-hover:text-[#E9EDDE] transition-colors">
                    +91 93343 49207
                  </div>
                </div>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="flex items-center gap-2 text-[#D1D5CB] font-medium">
                  <Clock className="w-4 h-4 text-[#708238] shrink-0" />
                  <span>Working Hours: 9 AM to 9 PM (7 Days a Week)</span>
                </div>

                <div className="flex items-center gap-2 text-[#D1D5CB] font-medium">
                  <Mail className="w-4 h-4 text-[#708238] shrink-0" />
                  <span>Email: support@teachersathome.in</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Message Box */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF9F6] text-[#2C3317] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#E6E8E1]">
              <h3 className="text-xl font-extrabold text-[#2C3317] mb-1">
                Send a Quick Callback Message
              </h3>
              <p className="text-xs text-[#5C6348] mb-5">
                We respond within hours, 7 days a week.
              </p>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#708238] mx-auto" />
                  <h4 className="text-lg font-extrabold text-[#2C3317]">Message Received!</h4>
                  <p className="text-xs text-[#5C6348]">
                    Thank you {name}. Our Academic Counselor will call you shortly at +91 {phone}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#708238] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#3D441E] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-[#D1D5CB] rounded-xl px-3.5 py-2.5 font-semibold text-[#2C3317] focus:outline-none focus:ring-2 focus:ring-[#708238]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D441E] mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-[#D1D5CB] rounded-xl px-3.5 py-2.5 font-semibold text-[#2C3317] focus:outline-none focus:ring-2 focus:ring-[#708238]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#3D441E] mb-1">How can we help you?</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Need a Class 10 CBSE Math home tutor in Lalpur, Ranchi..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white border border-[#D1D5CB] rounded-xl px-3.5 py-2.5 font-semibold text-[#2C3317] focus:outline-none focus:ring-2 focus:ring-[#708238]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-xs rounded-full shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request Quick Callback</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
