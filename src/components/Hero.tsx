import React from 'react';
import { ShieldCheck, Award, Users, Calendar, ArrowRight, Calculator, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { EDEN_INFO, EDEN_STATS } from '../data/edenData';

interface HeroProps {
  onOpenInscription: () => void;
  onOpenDevis: () => void;
  onOpenQuiz: () => void;
  onOpenAssistant: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInscription, onOpenDevis, onOpenQuiz, onOpenAssistant }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-[#FBFBFC]">
      {/* Decorative background glow elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-orange-400/15 via-amber-300/10 to-emerald-400/10 blur-3xl -z-10 rounded-full pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge d'Agrément d'État */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-sm text-xs font-semibold text-emerald-900 mb-6 animate-pulse-subtle">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Agrément d'État Officiel</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-700 truncate font-mono text-[11px]">{EDEN_INFO.agrement}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-heading">
            Votre permis de conduire réussi au{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
              Bénin
            </span>{' '}
            du premier coup.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Auto-école <strong className="text-slate-900 font-semibold">EDEN CONDUITE</strong> à Abomey-Calavi (Zopah / Akassato). 
            Formation rigoureuse, moniteurs certifiés et accompagnement de A à Z jusqu'à l'obtention officielle de votre permis ANaTT.
          </p>

          {/* Key Value Points Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
            <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Droits d'inscription : <strong>5 000 FCFA</strong></span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cours Code Matin & Soirée (18h-20h)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dossier d'examen ANaTT inclus</span>
            </div>
          </div>

          {/* CTAs Group */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenInscription}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-orange-600 via-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>S'inscrire en Ligne</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDevis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-orange-600" />
              <span>Simuler mon Devis (FCFA)</span>
            </button>

            <button
              onClick={onOpenAssistant}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-orange-800 bg-orange-100/70 hover:bg-orange-100 rounded-xl transition-all cursor-pointer border border-orange-200/60"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Moniteur Virtuel IA</span>
            </button>
          </div>

          {/* Localisation Rapide */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span>Sise à <strong>Zopah</strong> en face du Centre des Handicapés d'Akassato, Calavi</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {EDEN_STATS.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                {idx === 0 && <Award className="w-5 h-5" />}
                {idx === 1 && <Users className="w-5 h-5" />}
                {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                {idx === 3 && <Calendar className="w-5 h-5" />}
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
                {stat.valeur}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {stat.libelle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
