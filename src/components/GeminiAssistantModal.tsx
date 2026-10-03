import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { askGeminiAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';
import { EDEN_INFO } from '../data/edenData';

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInscription: () => void;
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenInscription,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Bonjour ! 🚗 Je suis le **Moniteur Virtuel d'EDEN CONDUITE**.\n\nJe suis là pour répondre à toutes vos questions sur les règles du **Code de la Route au Bénin**, nos tarifs, nos horaires ou la constitution de votre dossier d'examen ANaTT.\n\nComment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Quels sont les tarifs officiels ?",
    "Quelles pièces pour le dossier ANaTT ?",
    "Quels sont les horaires des cours du soir ?",
    "Priorité sur les rond-points au Bénin ?",
    "Vitesse autorisée en agglomération ?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const reply = await askGeminiAssistant(textToSend, history);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: "Désolé, je rencontre une petite difficulté momentanée. N'hésitez pas à joindre directement notre secrétariat sur WhatsApp au (+229) 97 23 98 30 !",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base font-heading">Moniteur Virtuel EDEN</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.2 rounded-full">
                  Gemini IA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Assistance 24/7 Code de la route & Tarifs Bénin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[88%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.sender === 'user' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-orange-400'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-none shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className={`text-[10px] text-slate-400 mt-1 px-1 ${m.sender === 'user' ? 'text-right' : ''}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-orange-400 flex items-center justify-center flex-shrink-0 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 rounded-tl-none shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span className="font-medium">Le moniteur réfléchit...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2 flex-shrink-0 scrollbar-none">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 px-3 py-1.5 rounded-full font-medium transition-colors border border-slate-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question sur le code ou les cours..."
              className="flex-1 p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-2xl transition-all cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>EDEN CONDUITE · Akassato, Calavi</span>
            <button
              onClick={() => {
                onClose();
                onOpenInscription();
              }}
              className="text-orange-600 hover:underline font-bold flex items-center gap-1"
            >
              <span>S'inscrire en ligne</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
