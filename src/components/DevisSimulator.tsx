import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { EDEN_FORMATIONS, EDEN_RECYCLAGE, EDEN_INFO } from '../data/edenData';

interface DevisSimulatorProps {
  onProceedWithDevis: (data: {
    formuleId: string;
    formuleNom: string;
    nationalite: 'nationale' | 'etranger';
    recyclageId?: string;
    totalAmount: number;
  }) => void;
}

export const DevisSimulator: React.FC<DevisSimulatorProps> = ({ onProceedWithDevis }) => {
  const [selectedFormuleId, setSelectedFormuleId] = useState<string>('permis-b-complet');
  const [nationalite, setNationalite] = useState<'nationale' | 'etranger'>('nationale');
  const [selectedRecyclageId, setSelectedRecyclageId] = useState<string>('none');

  const selectedFormule = EDEN_FORMATIONS.find(f => f.id === selectedFormuleId) || EDEN_FORMATIONS[0];
  const selectedRecyclage = EDEN_RECYCLAGE.find(r => r.id === selectedRecyclageId);

  const fraisInscription = EDEN_INFO.fraisInscriptionBase; // 5000 FCFA
  const prixFormation = selectedFormule.prix;
  const majorationEtranger = nationalite === 'etranger' ? EDEN_INFO.majorationEtranger : 0;
  const prixRecyclage = selectedRecyclage ? selectedRecyclage.prix : 0;

  const totalGlobal = fraisInscription + prixFormation + majorationEtranger + prixRecyclage;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  const handleValidation = () => {
    onProceedWithDevis({
      formuleId: selectedFormule.id,
      formuleNom: selectedFormule.nom,
      nationalite,
      recyclageId: selectedRecyclageId !== 'none' ? selectedRecyclageId : undefined,
      totalAmount: totalGlobal,
    });
  };

  return (
    <section id="devis" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Calculator className="w-3.5 h-3.5 text-orange-600" />
            <span>Simulateur Interactif en Direct</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Calculez votre devis en 1 clic
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Ajustez votre formation et vos options pour obtenir immédiatement le montant exact en Francs CFA, prêt à être validé.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-50/80 rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options de Configuration (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Étape 1 : Formule de base */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Choisissez votre permis ou formation
              </label>
              <div className="space-y-2">
                {EDEN_FORMATIONS.map((f) => (
                  <label
                    key={f.id}
                    onClick={() => setSelectedFormuleId(f.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedFormuleId === f.id
                        ? 'bg-orange-50/90 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedFormuleId === f.id ? 'border-orange-600 bg-orange-600' : 'border-slate-300'
                      }`}>
                        {selectedFormuleId === f.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{f.nom}</div>
                        <div className="text-[11px] text-slate-500">{f.categorie}</div>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm font-heading">
                      {formatPrice(f.prix)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Étape 2 : Nationalité */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. Nationalité du candidat (Réglementation ANaTT)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNationalite('nationale')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    nationalite === 'nationale'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Nationalité Béninoise</div>
                  <div className="text-[11px] text-slate-500">Tarif standard légal</div>
                </button>

                <button
                  type="button"
                  onClick={() => setNationalite('etranger')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    nationalite === 'etranger'
                      ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Nationalité Étrangère</div>
                  <div className="text-[11px] text-amber-700 font-semibold">+20 000 FCFA quittance</div>
                </button>
              </div>
            </div>

            {/* Étape 3 : Option Recyclage */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Ajouter des heures de perfectionnement supplémentaires (Optionnel)
              </label>
              <select
                value={selectedRecyclageId}
                onChange={(e) => setSelectedRecyclageId(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              >
                <option value="none">Aucun ajout (Formation de base uniquement)</option>
                {EDEN_RECYCLAGE.map((r) => (
                  <option key={r.id} value={r.id}>
                    + {r.titre} ({formatPrice(r.prix)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Récapitulatif Devis (Right 5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 sticky top-28">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h3 className="font-extrabold text-lg font-heading">Votre Devis Estimatif</h3>
            </div>

            <div className="space-y-3 py-5 text-xs sm:text-sm">
              <div className="flex justify-between items-start text-slate-300">
                <span>{selectedFormule.nom}</span>
                <span className="font-bold text-white ml-2">{formatPrice(selectedFormule.prix)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Droits d'inscription officiels</span>
                <span className="font-bold text-white">{formatPrice(fraisInscription)}</span>
              </div>

              {nationalite === 'etranger' && (
                <div className="flex justify-between items-center text-amber-300">
                  <span>Quittance spéciale étranger (ANaTT)</span>
                  <span className="font-bold">+{formatPrice(EDEN_INFO.majorationEtranger)}</span>
                </div>
              )}

              {selectedRecyclage && (
                <div className="flex justify-between items-center text-emerald-300">
                  <span>{selectedRecyclage.titre}</span>
                  <span className="font-bold">+{formatPrice(selectedRecyclage.prix)}</span>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                Inclus : Dossier d'examen officiel, cours théoriques en salle climatisée, conduite pratique.
              </div>
            </div>

            {/* Total Global */}
            <div className="pt-4 pb-6 border-t border-slate-800">
              <div className="text-xs uppercase tracking-wider text-slate-400">Total Net à Régler</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading mt-1">
                {formatPrice(totalGlobal)}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" />
                Facilités de paiement par tranches acceptées
              </p>
            </div>

            {/* CTA Bouton */}
            <button
              onClick={handleValidation}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Valider ce devis & S'inscrire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
