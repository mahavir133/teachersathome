import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, X, Lightbulb } from 'lucide-react';
import { AIChatMessage } from '../types';

interface AITutorAdvisorProps {
  onClose?: () => void;
  onRequestTutor?: () => void;
}

export const AITutorAdvisor: React.FC<AITutorAdvisorProps> = ({ onClose, onRequestTutor }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! 🙏 I am your Teachers At Home AI Tuition & Study Advisor. How can I help you today? You can ask me about recommended tuition hours, board exam strategies (CBSE, ICSE, JAC, BSEB), fee estimates, or tutor selection advice!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'How many home tuition hours per week are recommended for Class 10 CBSE Math & Science?',
    'What should parents look for when hiring a home tutor for ICSE Class 10 Java & Science?',
    'Suggest a weekly study timetable for JAC Board Class 10 student in Ranchi.',
    'Is a 1-on-1 female home tutor better for primary school foundation development?'
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      const data = await response.json();
      const botReply = data.text || 'I am here to guide you with your home tuition needs! Would you like to request a Free Demo Class with one of our top verified mentors?';

      const botMsg: AIChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: AIChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        text: 'Our AI Advisor is experiencing high traffic right now. Feel free to request a callback from our senior Academic Counselor for instant human guidance!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8E1] shadow-2xl flex flex-col h-[520px] max-w-2xl mx-auto overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#2C3317] text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#708238] text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-2 text-white">
              <span>AI Home Tuition Advisor</span>
              <span className="text-[10px] bg-[#3D441E] text-[#E9EDDE] px-2 py-0.5 rounded-full uppercase">Powered by Gemini</span>
            </h3>
            <p className="text-[11px] text-[#E9EDDE]">Instant expert advice for parents & students</p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-[#3D441E] rounded-lg text-[#E9EDDE]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF9F6] text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#708238] text-white flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-3.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-[#708238] text-white rounded-tr-none font-medium'
                  : 'bg-white text-[#2C3317] border border-[#E6E8E1] shadow-xs rounded-tl-none whitespace-pre-line leading-relaxed font-normal'
              }`}
            >
              <div>{msg.text}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-[#E9EDDE]' : 'text-[#5C6348]'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#2C3317] text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-[#708238] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-[#E6E8E1] text-[#5C6348] font-medium animate-pulse">
              Consulting AI Advisor knowledge base...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#F2F4EF] border-t border-[#E6E8E1] flex items-center gap-1.5 overflow-x-auto text-[11px] text-[#2C3317] shrink-0 scrollbar-none">
        <Lightbulb className="w-3.5 h-3.5 text-[#708238] shrink-0" />
        <span className="font-bold text-[#5C6348] shrink-0">Quick Prompts:</span>
        {samplePrompts.map((sp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sp)}
            className="whitespace-nowrap bg-white hover:bg-[#E9EDDE] border border-[#D1D5CB] hover:border-[#708238] text-[#2C3317] px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
          >
            {sp}
          </button>
        ))}
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-white border-t border-[#E6E8E1] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Advisor about tuition hours, board tips, fees, subjects..."
          className="flex-1 bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 bg-[#708238] hover:bg-[#5A692D] disabled:bg-[#D1D5CB] text-white rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>

        {onRequestTutor && (
          <button
            onClick={onRequestTutor}
            className="px-4 py-2.5 bg-[#708238] hover:bg-[#5A692D] text-white text-xs font-black rounded-full transition-colors shrink-0 whitespace-nowrap"
          >
            Book Free Demo
          </button>
        )}
      </div>

    </div>
  );
};
