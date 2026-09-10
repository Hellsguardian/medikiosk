import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

interface AIHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConsultation: () => void;
}

export const AIHelpModal: React.FC<AIHelpModalProps> = ({
  isOpen,
  onClose,
  onStartConsultation,
}) => {
  const [messages, setMessages] = useState<
    { sender: 'assistant' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'assistant',
      text: 'Hello Ramesh! I am your MediKiosk Health Assistant. How can I assist you with your health records, current jaundice treatment, or doctor appointments today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickQuestions = [
    'What does my bilirubin level mean?',
    'When is my next appointment?',
    'What foods should I avoid for Jaundice?',
    'How do I start a new consultation?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Responsive intelligent answers tailored to Ramesh Kumar's health records
    setTimeout(() => {
      let reply =
        "I'm here to help navigate your records. Your attending doctor Dr. Anjali Sharma can review your clinical findings during your scheduled follow-up.";

      const lower = query.toLowerCase();
      if (lower.includes('bilirubin')) {
        reply =
          'In your latest Liver Function Test on 05 Sep 2026, your Total Bilirubin decreased to 1.6 mg/dL from a peak of 5.4 mg/dL in June. This indicates substantial clinical recovery and positive response to your current hepatoprotective therapy.';
      } else if (lower.includes('appointment')) {
        reply =
          'You have an upcoming consultation with Dr. Anjali Sharma (Gastroenterology OPD) on Saturday, 12 September 2026 at 10:30 AM in Room 204, OPD Block B.';
      } else if (lower.includes('food') || lower.includes('diet') || lower.includes('eat')) {
        reply =
          'For your jaundice recovery: Eat light, easily digestible foods such as boiled porridge, fruits (papaya, apples), and drink plenty of water or coconut water. Strictly avoid deep-fried foods, heavy oils, raw street foods, and alcohol.';
      } else if (lower.includes('consultation')) {
        reply =
          'You can start a guided medical interview by clicking "+ Start New Consultation" on your home dashboard. You can speak, type, or touch your symptom area.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="ai-help-modal"
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-mk-surface-tint border-b border-mk-border-light flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-mk-lavender-pale text-mk-primary-dark flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-mk-text-primary">Talk to MediKiosk</h3>
              <p className="text-xs text-mk-text-secondary">Your friendly health records navigator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-mk-text-muted hover:text-mk-text-primary flex items-center justify-center border border-mk-border transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-mk-lavender-pale text-mk-primary-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-mk-primary text-white rounded-tr-xs'
                    : 'bg-mk-surface-secondary text-mk-text-primary border border-mk-border-light rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="px-5 py-2 bg-mk-surface-secondary border-t border-mk-border-light">
          <div className="text-[10px] uppercase font-bold text-mk-text-muted mb-1.5">
            Suggested questions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white text-mk-text-secondary hover:bg-mk-lavender-very-pale border border-mk-border transition text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="p-3.5 px-5 bg-white border-t border-mk-border-light flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question about records, medicines..."
            className="flex-1 px-4 py-2 text-xs rounded-full border border-mk-border focus:border-mk-primary focus:outline-none text-mk-text-primary"
          />
          <button
            onClick={() => handleSend()}
            className="w-8 h-8 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white flex items-center justify-center transition shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
