import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ShieldCheck, MapPin, Menu, X, Sparkles, Lock, Clock, FileText, Award } from 'lucide-react';
import { EDEN_INFO } from '../data/edenData';

interface NavbarProps {
  onOpenInscription: (formuleId?: string) => void;
  onOpenAdmin: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInscription, onOpenAdmin, onOpenAssistant }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Formations & Tarifs', href: '#tarifs' },
    { name: 'Simulateur Devis', href: '#devis' },
    { name: 'Horaires des Cours', href: '#horaires' },
    { name: 'Dossier d’Examen', href: '#dossier' },
    { name: 'Test Code ANaTT', href: '#quiz' },
    { name: 'Contact & Accès', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Banner Officiel de l'État & Contact Rapide */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Agrément État Bénin : {EDEN_INFO.agrement}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-orange-500" />
              Zopah, Akassato (Abomey-Calavi)
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto text-[11px]">
            <a 
              href={`tel:${EDEN_INFO.phoneCallPrimary}`} 
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-orange-400" />
              <span className="font-semibold">{EDEN_INFO.telephones[0]}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href={`https://wa.me/${EDEN_INFO.whatsappPrimary}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-orange-400 transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-slate-800"
              title="Espace réservé à la direction"
            >
              <Lock className="w-3 h-3" />
              <span>Espace Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200' 
            : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Nom */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white p-0.5 flex-shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src="/assets/images/logo-eden-conduite.jpg" 
                alt="Logo Auto-école EDEN CONDUITE" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback élégant si l'image met du temps
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 to-emerald-600/10 pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-heading">
                  EDEN <span className="text-orange-600">CONDUITE</span>
                </span>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider hidden sm:inline-block">
                  Bénin
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                « {EDEN_INFO.slogan} »
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="hover:text-orange-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Assistant IA Gemini */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer"
              title="Poser une question sur le code ou les tarifs à notre Moniteur IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>Moniteur IA</span>
              <span className="bg-orange-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase">
                24/7
              </span>
            </button>

            {/* Inscription En Ligne */}
            <button
              onClick={() => onOpenInscription()}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              S'inscrire en Ligne
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenAssistant}
              className="sm:hidden p-2 text-orange-600 bg-orange-50 rounded-lg border border-orange-200"
              title="Moniteur IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAssistant();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Poser une question au Moniteur IA (Gemini)
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenInscription();
                  }}
                  className="w-full py-3 px-4 text-center text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-md"
                >
                  S'inscrire en Ligne (5 000 FCFA)
                </button>

                <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-500">
                  <a href={`tel:${EDEN_INFO.phoneCallPrimary}`} className="flex items-center gap-1 font-semibold text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    {EDEN_INFO.telephones[0]}
                  </a>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="flex items-center gap-1 text-slate-500 hover:text-orange-600"
                  >
                    <Lock className="w-3 h-3" />
                    Accès Direction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
