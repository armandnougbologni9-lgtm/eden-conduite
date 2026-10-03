import React from 'react';
import { Star, Quote, Award, ThumbsUp, ShieldCheck } from 'lucide-react';
import { EDEN_AVIS } from '../data/edenData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Témoignages & Avis Vérifiés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Ce que nos diplômés disent de nous
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Découvrez les retours d'expérience authentiques d'anciens apprenants ayant décroché leur permis chez EDEN CONDUITE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EDEN_AVIS.map((avis, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(avis.note)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Commentaire */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  « {avis.commentaire} »
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-slate-200/70">
                <div className="font-extrabold text-sm text-slate-900 font-heading">
                  {avis.nom}
                </div>
                <div className="text-xs text-orange-600 font-semibold mt-0.5">
                  {avis.permis}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                  <span>{avis.quartier}</span>
                  <span>{avis.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Guarantee */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-200/60 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 font-heading">
                96% de réussite aux épreuves officielles ANaTT
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Une méthode pédagogique rigoureuse basée sur l'anticipation, le calme et la maîtrise technique.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-xs flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Moniteurs diplômés d'État</span>
          </div>
        </div>
      </div>
    </section>
  );
};
