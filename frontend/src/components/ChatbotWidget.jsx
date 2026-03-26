import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function ChatbotWidget({ resumeData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm your Resume Assistant 🤖. I can help you improve your resume, suggest interview questions, or answer any questions about your analysis. How can I help?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const quickActions = [
    'How can I improve my resume?',
    'Suggest interview questions',
    'What keywords am I missing?',
  ];

  const generateBotResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('improve') || lower.includes('better')) {
      return "Based on your resume analysis, here are some key improvements:\n\n1. **Quantify achievements** — Add specific metrics and numbers to your experience section.\n2. **Add action verbs** — Start bullet points with strong action verbs like 'Led', 'Developed', 'Implemented'.\n3. **Tailor keywords** — Include industry-specific keywords that ATS systems look for.\n4. **Keep it concise** — Aim for 1-2 pages with clear, scannable formatting.";
    }
    if (lower.includes('interview') || lower.includes('question')) {
      return "Here are some interview questions tailored to your profile:\n\n1. **Tell me about yourself** — Prepare a 2-minute elevator pitch.\n2. **What's your greatest achievement?** — Use the STAR method.\n3. **Why are you interested in this role?** — Research the company beforehand.\n4. **Describe a challenging project** — Focus on problem-solving skills.\n5. **Where do you see yourself in 5 years?** — Show ambition and alignment.";
    }
    if (lower.includes('keyword') || lower.includes('missing') || lower.includes('ats')) {
      return "To improve your ATS compatibility:\n\n• **Use standard section headers** like 'Work Experience', 'Education', 'Skills'.\n• **Include relevant technical keywords** from the job description.\n• **Avoid graphics/tables** — ATS systems struggle with complex formatting.\n• **Use a clean, simple layout** with consistent formatting.";
    }
    if (lower.includes('score') || lower.includes('rating')) {
      return "Your resume score is based on several factors:\n\n• **Content completeness** — All sections filled out\n• **Keyword density** — Relevant industry terms\n• **ATS compatibility** — Parseable by automated systems\n• **Formatting** — Clean, professional layout\n• **Impact statements** — Quantified achievements";
    }
    return "That's a great question! I'd recommend focusing on:\n\n1. Making your resume ATS-friendly with clear formatting\n2. Quantifying your achievements with specific numbers\n3. Tailoring your resume for each application\n\nWould you like me to elaborate on any of these points?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const response = generateBotResponse(userMsg.text);
      setMessages((prev) => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-0'
            : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:shadow-violet-500/40 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5 text-white" />
            {/* Pulse animation */}
            <span className="absolute w-full h-full rounded-full bg-violet-400 animate-ping opacity-20" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Resume Assistant</h3>
                <p className="text-xs text-violet-200">Always here to help</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-violet-200">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80 min-h-[280px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-violet-100'
                    : 'bg-slate-100'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-violet-600" />
                    : <Bot className="w-3.5 h-3.5 text-slate-600" />
                  }
                </div>
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-700 rounded-bl-md'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(action);
                    setTimeout(handleSend, 50);
                    setInput(action);
                    const userMsg = { role: 'user', text: action };
                    setMessages((prev) => [...prev, userMsg]);
                    setIsTyping(true);
                    setTimeout(() => {
                      const response = generateBotResponse(action);
                      setMessages((prev) => [...prev, { role: 'bot', text: response }]);
                      setIsTyping(false);
                    }, 1200);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-700 placeholder-slate-400 border border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                id="chatbot-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95"
                id="chatbot-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <style>{`
            .animate-in {
              animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(16px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
