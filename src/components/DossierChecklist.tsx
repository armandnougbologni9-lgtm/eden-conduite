import React, { useState } from 'react';
import { FileCheck2, CheckCircle2, Circle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { EDEN_DOSSIER, EDEN_INFO } from '../data/edenData';

interface DossierChecklistProps {
  onStartRegistrationWithPieces?: (pieces: string[]) => void;
}

export const DossierChecklist: React.FC<DossierChecklistProps> = ({ onStartRegistrationWithPieces }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>(['photo', 'cip']);

  const toggleItem = (id: string) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const obligatoireCount = EDEN_DOSSIER.filter(d => d.obligatoire).length;
  const readyObligatoire = EDEN_DOSSIER.filter(d => d.obligatoire && checkedItems.includes(d.id)).length;
  const progressPercent = Math.round((readyObligatoire / obligatoireCount) * 100);

  return (
    <section id="dossier" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Examen ANaTT Bénin</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Pièces requises pour le dossier d'examen
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Cochez les pièces dont vous disposez déjà. Si certaines pièces vous manquent encore (visite médicale, groupe sanguin), 
            <strong> notre secrétariat vous oriente dès votre inscription !</strong>
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
          {/* Progress Header */}
          <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Progression de votre dossier
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {readyObligatoire} sur {obligatoireCount} pièces obligatoires prêtes ({progressPercent}%)
              </div>
            </div>

            <div className="w-full sm:w-48 bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {EDEN_DOSSIER.map((piece) => {
              const isChecked = checkedItems.includes(piece.id);
              return (
                <div
                  key={piece.id}
                  onClick={() => toggleItem(piece.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button type="button" className="mt-0.5 flex-shrink-0 text-emerald-600">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-bold text-sm ${isChecked ? 'text-emerald-950' : 'text-slate-900'}`}>
                        {piece.titre}
                      </span>
                      {piece.obligatoire ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                          Obligatoire
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {piece.condition || 'Facultatif'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {piece.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reassurance Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-orange-50/80 border border-orange-200/60 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-orange-900 leading-relaxed">
              <strong>Pas d'inquiétude :</strong> Vous n'avez pas besoin d'avoir toutes les pièces aujourd'hui pour vous inscrire. Vous pouvez valider vos droits d'inscription de 5 000 FCFA dès maintenant et compléter le dossier durant vos premières semaines de cours.
            </div>
          </div>

          {/* Action Button */}
          {onStartRegistrationWithPieces && (
            <div className="mt-6 text-center">
              <button
                onClick={() => onStartRegistrationWithPieces(checkedItems)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Continuer vers l'inscription avec ces pièces</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
