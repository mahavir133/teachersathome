import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export const VidyaMitraChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Namaste! I am VidyaMitra, your AI study assistant. How can I help you with your studies, exam preparation, or finding a tutor today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/vidyamitra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 p-4 bg-[#708238] hover:bg-[#5A692D] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
        title="Chat with VidyaMitra"
      >
        <Bot className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E6E8E1]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2C3317] to-[#3D441E] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#E9EDDE]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">VidyaMitra</h3>
                <p className="text-[10px] text-[#E9EDDE]">AI Study Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-[#708238] text-white rounded-tr-sm' 
                    : 'bg-white border border-[#E6E8E1] text-[#2C3317] shadow-sm rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E6E8E1] p-3 rounded-2xl rounded-tl-sm flex items-center gap-2 text-[#5C6348] shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">VidyaMitra is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#E6E8E1]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about studies or tutors..."
                className="flex-1 bg-[#F2F4EF] border border-[#D1D5CB] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#708238] text-[#2C3317]"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-[#708238] hover:bg-[#5A692D] disabled:opacity-50 text-white rounded-full transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
