import React from 'react';
import { Clock, BookOpen, Car, Building2, Sun, Moon, CalendarCheck, PhoneCall } from 'lucide-react';
import { EDEN_HORAIRES, EDEN_INFO } from '../data/edenData';

export const HorairesSection: React.FC = () => {
  return (
    <section id="horaires" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>Organisation des Séances</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Des horaires flexibles adaptés à votre emploi du temps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Que vous soyez travailleur, étudiant à l'UAC ou commerçant, nos créneaux matin et soir vous garantissent un apprentissage continu sans stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 1. Coaching Théorique */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Code de la route
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                Coaching Théorique
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-orange-600" />
                {EDEN_HORAIRES.coachingTheorique.jours}
              </p>

              <div className="mt-6 space-y-3">
                {EDEN_HORAIRES.coachingTheorique.sessions.map((sess, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {idx === 0 ? (
                        <Sun className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      )}
                      <div>
                        <div className="font-bold text-xs text-slate-800">{sess.nom}</div>
                        <div className="text-[11px] font-mono text-orange-600 font-semibold">{sess.plage}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {sess.badge}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs text-slate-500 leading-relaxed">
                {EDEN_HORAIRES.coachingTheorique.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-medium text-emerald-700 bg-emerald-50/60 p-2.5 rounded-xl">
              ✓ Salle climatisée & projecteur haute définition
            </div>
          </div>

          {/* 2. Conduite Pratique */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-5">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Sur la route & circuit
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                Conduite Pratique
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                {EDEN_HORAIRES.conduitePratique.jours}
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-500">Créneaux de conduite</div>
                <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                  {EDEN_HORAIRES.conduitePratique.creneaux}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Planification sur-mesure hebdomadaire directement avec votre moniteur attitré.
                </div>
              </div>

              <p className="mt-5 text-xs text-slate-500 leading-relaxed">
                {EDEN_HORAIRES.conduitePratique.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-medium text-emerald-700 bg-emerald-50/60 p-2.5 rounded-xl">
              ✓ Véhicules récents avec double commande sécurisée
            </div>
          </div>

          {/* 3. Secrétariat & Accueil */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Accueil & Inscriptions
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-1">
                Secrétariat Général
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
                {EDEN_HORAIRES.accueilSecretariat.jours}
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-700">Ouverture non-stop</div>
                  <div className="text-sm font-bold text-indigo-600 font-mono mt-0.5">
                    {EDEN_HORAIRES.accueilSecretariat.plage}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">Dimanche</span>
                  <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {EDEN_HORAIRES.accueilSecretariat.dimanche}
                  </span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-orange-50/80 border border-orange-200/60 text-xs text-orange-900">
                <div className="font-bold flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                  Assistance téléphonique directe :
                </div>
                <div className="mt-1 font-mono font-bold text-slate-900">
                  {EDEN_INFO.telephones.join(' / ')}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              ✓ Situé à Zopah en face du Centre des Handicapés d'Akassato
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
