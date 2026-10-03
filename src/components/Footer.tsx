import React from 'react';
import { ShieldCheck, MapPin, Phone, MessageCircle, Mail, Lock, Heart, Award } from 'lucide-react';
import { EDEN_INFO, EDEN_HORAIRES } from '../data/edenData';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenInscription: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenInscription }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1120] text-slate-400 text-xs border-t border-slate-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1 : Brand & Accréditation */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-slate-700 flex-shrink-0">
              <img
                src="/assets/images/logo-eden-conduite.jpg"
                alt="Logo EDEN CONDUITE"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="font-extrabold text-base text-white font-heading tracking-tight">
                EDEN <span className="text-orange-500">CONDUITE</span>
              </div>
              <div className="text-[11px] text-slate-400">
                « {EDEN_INFO.slogan} »
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Auto-école de référence au Bénin, agréée par le Ministère des Infrastructures et des Transports (ANaTT). Formations au permis de conduire toutes catégories avec un taux de réussite de 96%.
          </p>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <div className="font-bold text-emerald-400 flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Agrément officiel de l'État :
            </div>
            <div className="font-mono text-slate-400 text-[10px] break-all">
              {EDEN_INFO.agrement}
            </div>
          </div>
        </div>

        {/* Col 2 : Formations & Tarifs */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Formations Permis
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#tarifs" className="hover:text-orange-400 transition-colors">
                Permis B — Formation Complète (150 000 FCFA)
              </a>
            </li>
            <li>
              <a href="#tarifs" className="hover:text-orange-400 transition-colors">
                Permis B — Formule Accélérée (200 000 FCFA)
              </a>
            </li>
            <li>
              <a href="#tarifs" className="hover:text-orange-400 transition-colors">
                Permis Motos A1, A2, A3 (95 000 FCFA)
              </a>
            </li>
            <li>
              <a href="#tarifs" className="hover:text-orange-400 transition-colors">
                Permis Poids Lourds C / Dr (120 000 FCFA)
              </a>
            </li>
            <li>
              <a href="#tarifs" className="hover:text-orange-400 transition-colors">
                Permis Poids Lourds C1 & Transport D
              </a>
            </li>
            <li>
              <a href="#tarifs" className="hover:text-orange-400 transition-colors">
                Séances de recyclage / perfectionnement
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 : Liens Rapides & Horaires */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Informations Pratiques
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#devis" className="hover:text-orange-400 transition-colors">
                Simulateur de Devis en direct (FCFA)
              </a>
            </li>
            <li>
              <a href="#horaires" className="hover:text-orange-400 transition-colors">
                Horaires des cours théoriques (matin & soir)
              </a>
            </li>
            <li>
              <a href="#dossier" className="hover:text-orange-400 transition-colors">
                Checklist des pièces du dossier ANaTT
              </a>
            </li>
            <li>
              <a href="#quiz" className="hover:text-orange-400 transition-colors">
                Test d'entraînement au Code de la Route
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-orange-400 transition-colors">
                Localisation à Zopah Akassato
              </a>
            </li>
          </ul>

          <div className="pt-2 text-[11px] text-slate-500">
            <div>Secrétariat : Lun - Sam (08h - 19h)</div>
            <div>Code : Lun - Mer (8h-11h / 18h-20h)</div>
          </div>
        </div>

        {/* Col 4 : Contact & Inscription */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Contact Direct
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>Sise à Zopah en face du Centre des Handicapés d'Akassato, Abomey-Calavi</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <a href={`tel:${EDEN_INFO.phoneCallPrimary}`} className="font-mono text-slate-300 hover:text-white">
                (+229) {EDEN_INFO.telephones.join(' / ')}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a
                href={`https://wa.me/${EDEN_INFO.whatsappPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                WhatsApp Direct Secrétariat
              </a>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenInscription}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
            >
              S'inscrire en Ligne (5 000 FCFA)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
          <div>
            © {currentYear} <strong>Auto-école EDEN CONDUITE</strong>. Tous droits réservés. République du Bénin.
          </div>

          <div className="flex items-center gap-4">
            <span>Agrément N° 2551/MIT/DC/SGM/ANaTT/DERC/SERC/SA</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Accès Administration</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
