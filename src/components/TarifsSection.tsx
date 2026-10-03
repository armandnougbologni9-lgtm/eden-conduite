import React, { useState } from 'react';
import { Check, Star, ArrowRight, Car, Bike, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { EDEN_FORMATIONS, EDEN_RECYCLAGE, EDEN_INFO } from '../data/edenData';
import { Formation } from '../types';

interface TarifsSectionProps {
  onSelectFormation: (formationId: string) => void;
}

export const TarifsSection: React.FC<TarifsSectionProps> = ({ onSelectFormation }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'auto' | 'moto' | 'lourd' | 'recyclage'>('all');

  const filteredFormations = activeTab === 'all' 
    ? EDEN_FORMATIONS 
    : activeTab === 'recyclage'
      ? []
      : EDEN_FORMATIONS.filter(f => f.type === activeTab);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  return (
    <section id="tarifs" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Star className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
            <span>Grille Tarifaire Officielle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Des tarifs transparents, sans frais cachés
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Constitution et suivi du dossier d'examen inclus dans toutes les formations. Droits d'inscription officiels fixés à{' '}
            <strong className="text-slate-900 font-semibold">{formatPrice(EDEN_INFO.fraisInscriptionBase)}</strong>, valables 3 mois.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              Toutes les Formations
            </button>
            <button
              onClick={() => setActiveTab('auto')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'auto'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Automobile (Permis B)</span>
            </button>
            <button
              onClick={() => setActiveTab('moto')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'moto'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Deux-Roues (Motos)</span>
            </button>
            <button
              onClick={() => setActiveTab('lourd')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'lourd'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Poids Lourds (C, C1, D)</span>
            </button>
            <button
              onClick={() => setActiveTab('recyclage')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'recyclage'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recyclage & Perfectionnement</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {activeTab !== 'recyclage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFormations.map((formation) => {
              const isHighlight = formation.id === 'permis-b-complet';
              const isAccelere = formation.id === 'permis-b-accelere';
              const totalAmount = formation.prix + formation.droitInscription;

              return (
                <div
                  key={formation.id}
                  className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    isHighlight
                      ? 'bg-white border-2 border-orange-500 shadow-xl shadow-orange-500/10 scale-100 lg:scale-[1.03] z-10'
                      : isAccelere
                      ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white border border-slate-800 shadow-lg'
                      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {formation.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs ${
                        isHighlight
                          ? 'bg-orange-600 text-white'
                          : isAccelere
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {formation.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Catégorie & Titre */}
                    <div className="text-center pb-5 border-b border-slate-100 dark:border-slate-800">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        isAccelere ? 'text-amber-400' : 'text-orange-600'
                      }`}>
                        {formation.categorie}
                      </span>
                      <h3 className={`text-xl sm:text-2xl font-extrabold font-heading mt-1 ${
                        isAccelere ? 'text-white' : 'text-slate-900'
                      }`}>
                        {formation.nom}
                      </h3>
                      <p className={`mt-2 text-xs leading-relaxed ${
                        isAccelere ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {formation.description}
                      </p>
                    </div>

                    {/* Prix */}
                    <div className="py-6 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-3xl sm:text-4xl font-extrabold font-heading tracking-tight ${
                          isAccelere ? 'text-white' : 'text-slate-900'
                        }`}>
                          {new Intl.NumberFormat('fr-FR').format(formation.prix)}
                        </span>
                        <span className={`text-xs font-semibold uppercase ${
                          isAccelere ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          FCFA
                        </span>
                      </div>
                      <div className={`mt-1.5 text-xs font-medium ${
                        isAccelere ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        + 5 000 FCFA frais d'inscription = <strong className={isAccelere ? 'text-amber-400' : 'text-slate-900'}>{formatPrice(totalAmount)}</strong>
                      </div>
                    </div>

                    {/* Inclus */}
                    <div className="space-y-3 pt-2">
                      <span className={`text-xs font-bold uppercase tracking-wider block ${
                        isAccelere ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Ce qui est inclus :
                      </span>
                      <ul className="space-y-2.5">
                        {formation.inclus.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                            <span className={`rounded-full p-0.5 mt-0.5 flex-shrink-0 ${
                              isAccelere 
                                ? 'bg-amber-400/20 text-amber-400' 
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            <span className={isAccelere ? 'text-slate-200' : 'text-slate-700'}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bouton Inscription */}
                  <div className="pt-8">
                    <button
                      onClick={() => onSelectFormation(formation.id)}
                      className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isHighlight
                          ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-orange-500/25'
                          : isAccelere
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>Choisir cette formule</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Section Recyclage / Perfectionnement */}
        {(activeTab === 'all' || activeTab === 'recyclage') && (
          <div className="mt-14 pt-10 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Remise à niveau & Perfectionnement
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-2">
                Séances de recyclage à la carte
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Idéal si vous possédez déjà votre permis mais souhaitez reprendre confiance sur les axes encombrés de Calavi ou Cotonou.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EDEN_RECYCLAGE.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {rec.heures} Heures au volant
                      </span>
                      {rec.badge && (
                        <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {rec.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 font-heading mt-3">
                      {rec.titre}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 font-heading">
                        {formatPrice(rec.prix)}
                      </span>
                      <span className="block text-[11px] text-slate-400">Net sans frais cachés</span>
                    </div>
                    <button
                      onClick={() => onSelectFormation(rec.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note Réglementaire Ressortissants Étrangers */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Information réglementaire ANaTT :</strong> Pour les apprenants de nationalité étrangère résidant au Bénin, une quittance spéciale légale de <strong>20 000 FCFA</strong> est requise par l'Agence Nationale des Transports Terrestres lors du dépôt du dossier d'examen officiel.
          </div>
        </div>
      </div>
    </section>
  );
};
