import React from 'react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import { EDEN_INFO } from '../data/edenData';

interface FloatingActionsProps {
  onOpenAssistant: () => void;
  onOpenInscription: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenAssistant }) => {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5">
      {/* Bouton Moniteur IA */}
      <button
        onClick={onOpenAssistant}
        className="group flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-orange-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        title="Poser une question au Moniteur Virtuel IA"
      >
        <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
        <span className="text-xs font-bold hidden sm:inline">
          Moniteur IA (Code Bénin)
        </span>
      </button>

      {/* Bouton WhatsApp Direct */}
      <a
        href={`https://wa.me/${EDEN_INFO.whatsappPrimary}?text=${encodeURIComponent("Bonjour EDEN CONDUITE, je souhaite me renseigner pour une inscription au permis de conduire.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-emerald-500/40 transition-all transform hover:scale-105 active:scale-95"
        title="Contacter le secrétariat sur WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
        <span className="text-xs font-bold hidden sm:inline">
          WhatsApp Secrétariat
        </span>
      </a>
    </div>
  );
};
