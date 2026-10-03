import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft, MessageCircle, ShieldCheck, FileText, CheckCircle2, AlertCircle, Copy, Phone, User, Calendar } from 'lucide-react';
import { EDEN_FORMATIONS, EDEN_RECYCLAGE, EDEN_INFO, EDEN_DOSSIER } from '../data/edenData';
import { StorageService } from '../services/storage';
import { Inscription } from '../types';

interface InscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialFormuleId?: string;
  initialNationalite?: 'nationale' | 'etranger';
  initialPieces?: string[];
}

export const InscriptionWizard: React.FC<InscriptionWizardProps> = ({
  isOpen,
  onClose,
  initialFormuleId = 'permis-b-complet',
  initialNationalite = 'nationale',
  initialPieces = ['photo', 'cip'],
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Données du formulaire
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [nationalite, setNationalite] = useState<'nationale' | 'etranger'>(initialNationalite);

  const [formuleId, setFormuleId] = useState(initialFormuleId);
  const [preferenceCoaching, setPreferenceCoaching] = useState('Soirée (18h-20h)');
  const [disponibilitePratique, setDisponibilitePratique] = useState('Jeudi & Vendredi');
  const [piecesPretes, setPiecesPretes] = useState<string[]>(initialPieces);

  // Résultat après enregistrement
  const [savedInscription, setSavedInscription] = useState<Inscription | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialFormuleId) setFormuleId(initialFormuleId);
    if (initialNationalite) setNationalite(initialNationalite);
    if (initialPieces && initialPieces.length > 0) setPiecesPretes(initialPieces);
  }, [initialFormuleId, initialNationalite, initialPieces]);

  if (!isOpen) return null;

  // Calcul des montants
  const selectedFormule = EDEN_FORMATIONS.find(f => f.id === formuleId) 
    || EDEN_RECYCLAGE.find(r => r.id === formuleId);
  
  const isRecyclage = EDEN_RECYCLAGE.some(r => r.id === formuleId);
  const formationPrix = selectedFormule ? selectedFormule.prix : 150000;
  const formationNom = selectedFormule ? ('nom' in selectedFormule ? selectedFormule.nom : selectedFormule.titre) : 'Permis B';
  
  const fraisInscription = isRecyclage ? 0 : EDEN_INFO.fraisInscriptionBase;
  const majorationEtranger = nationalite === 'etranger' && !isRecyclage ? EDEN_INFO.majorationEtranger : 0;
  const totalAmount = formationPrix + fraisInscription + majorationEtranger;

  const formatPrice = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';

  const togglePiece = (id: string) => {
    setPiecesPretes(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !telephone.trim()) {
      alert("Veuillez renseigner votre nom, prénom et numéro de téléphone.");
      return;
    }
    if (!whatsapp.trim()) {
      setWhatsapp(telephone.trim());
    }
    setStep(2);
  };

  const handleFinalSubmit = () => {
    const inscription = StorageService.save({
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      whatsapp: whatsapp.trim() || telephone.trim(),
      email: email.trim(),
      nationalite,
      formuleId,
      formuleNom: formationNom,
      montantTotal: totalAmount,
      preferenceCoaching,
      disponibilitePratique,
      notes: "Demande enregistrée via le formulaire en ligne.",
      piecesPretes,
    });

    setSavedInscription(inscription);
    setStep(4);
  };

  // WhatsApp Message
  const buildWhatsAppMessage = (ins: Inscription) => {
    const cleanPhone = ins.whatsapp.replace(/\D/g, '');
    const text = `*NOUVELLE INSCRIPTION EN LIGNE — EDEN CONDUITE*\n\n` +
      `📌 *N° Dossier :* ${ins.id}\n` +
      `👤 *Candidat :* ${ins.nom} ${ins.prenom}\n` +
      `📞 *Téléphone :* ${ins.telephone}\n` +
      `🌍 *Nationalité :* ${ins.nationalite === 'etranger' ? 'Étrangère (+20 000F)' : 'Béninoise'}\n` +
      `🚗 *Formule choisie :* ${ins.formuleNom}\n` +
      `🕒 *Créneau Code :* ${ins.preferenceCoaching}\n` +
      `📅 *Disponibilité Pratique :* ${ins.disponibilitePratique}\n` +
      `💰 *Montant Total :* ${formatPrice(ins.montantTotal)}\n\n` +
      `Bonjour, je viens de finaliser ma demande d'inscription sur le site. Merci de me confirmer la validation !`;
    return `https://wa.me/${EDEN_INFO.whatsappPrimary}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Inscription en Ligne</h3>
              <p className="text-xs text-slate-400">Auto-école EDEN CONDUITE · Agrément N° {EDEN_INFO.agrement}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-orange-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 1 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>1</span>
            <span className="hidden sm:inline">Identité</span>
          </div>

          <span className="text-slate-300">›</span>

          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-orange-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 2 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>2</span>
            <span className="hidden sm:inline">Formation</span>
          </div>

          <span className="text-slate-300">›</span>

          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-orange-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 3 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>3</span>
            <span className="hidden sm:inline">Pièces</span>
          </div>

          <span className="text-slate-300">›</span>

          <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>4</span>
            <span className="hidden sm:inline">Validation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: IDENTITÉ */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: AGUESSY"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Prénom(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Ex: Benoît"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Téléphone d'appel * (Bénin)
                  </label>
                  <input
                    type="tel"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Ex: 97 23 98 30"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: 97 23 98 30 (si différent)"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Adresse Email (Facultatif)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: benoit.aguessy@gmail.com"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nationalité (Réglementation ANaTT)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNationalite('nationale')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer transition-all ${
                      nationalite === 'nationale'
                        ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Béninoise (Tarif Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNationalite('etranger')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer transition-all ${
                      nationalite === 'etranger'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Étrangère (+20 000 FCFA ANaTT)
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all"
                >
                  <span>Continuer : Choix formation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: FORMATION & HORAIRES */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Sélectionnez votre formule
                </label>
                <select
                  value={formuleId}
                  onChange={(e) => setFormuleId(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 outline-none focus:border-orange-500"
                >
                  <optgroup label="Permis Véhicules">
                    {EDEN_FORMATIONS.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.nom} — {formatPrice(f.prix)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Recyclage / Perfectionnement">
                    {EDEN_RECYCLAGE.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.titre} — {formatPrice(r.prix)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Préférence pour le Coaching Théorique (Code)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferenceCoaching('Matinée (08h00 - 11h00)')}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold cursor-pointer transition-all ${
                      preferenceCoaching.includes('Matinée')
                        ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">Session Matinée</div>
                    <div className="text-slate-500 text-[11px]">08h00 — 11h00 (Lun au Mer)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferenceCoaching('Soirée (18h00 - 20h00)')}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold cursor-pointer transition-all ${
                      preferenceCoaching.includes('Soirée')
                        ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">Session Soirée (Populaire)</div>
                    <div className="text-slate-500 text-[11px]">18h00 — 20h00 (Lun au Mer)</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Disponibilité pour la Conduite Pratique (Volant)
                </label>
                <select
                  value={disponibilitePratique}
                  onChange={(e) => setDisponibilitePratique(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-800 outline-none"
                >
                  <option value="Jeudi & Vendredi matin">Jeudi & Vendredi matin</option>
                  <option value="Jeudi & Vendredi après-midi">Jeudi & Vendredi après-midi</option>
                  <option value="Samedi matin (Spécial travailleurs)">Samedi matin (Spécial travailleurs)</option>
                  <option value="Jeudi, Vendredi & Samedi (Intensif)">Jeudi, Vendredi & Samedi (Intensif)</option>
                  <option value="À convenir avec le moniteur">À convenir avec le moniteur</option>
                </select>
              </div>

              {/* Total Preview */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Montant estimatif total :</div>
                  <div className="text-xs text-slate-600">Frais d'inscription (5 000 F) inclus</div>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-heading">
                  {formatPrice(totalAmount)}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all"
                >
                  <span>Continuer : Pièces dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PIÈCES DOSSIER */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Indiquez les pièces dont vous disposez déjà
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ce n'est pas bloquant : vous pouvez tout à fait débuter vos cours de code et fournir le certificat médical plus tard.
                </p>
              </div>

              <div className="space-y-2.5">
                {EDEN_DOSSIER.map((piece) => {
                  const isChecked = piecesPretes.includes(piece.id);
                  return (
                    <div
                      key={piece.id}
                      onClick={() => togglePiece(piece.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{piece.titre}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {piece.obligatoire ? 'Requis' : 'Si mariée'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/70 text-xs text-orange-900">
                Droits d'inscription de <strong>5 000 FCFA</strong> payables au secrétariat ou par MoMo/Flooz à la validation. Valables 3 mois.
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  <span>Confirmer ma pré-inscription</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION & WHATSAPP SHARE */}
          {step === 4 && savedInscription && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-2xl font-black text-slate-900 font-heading">
                Pré-inscription enregistrée avec succès !
              </h4>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Votre numéro de dossier officiel a été généré. Veuillez le transmettre directement au secrétariat sur WhatsApp pour valider votre place.
              </p>

              {/* Dossier Badge */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-900 text-white inline-flex flex-col items-center justify-center border border-slate-700 max-w-sm w-full">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">
                  Numéro de Dossier Officiel
                </span>
                <span className="text-2xl font-black font-mono tracking-wider mt-1 text-white">
                  {savedInscription.id}
                </span>

                <div className="mt-3 pt-3 border-t border-slate-800 w-full flex justify-between text-xs text-slate-300">
                  <span>Candidat :</span>
                  <span className="font-bold text-white">{savedInscription.nom} {savedInscription.prenom}</span>
                </div>
                <div className="mt-1 w-full flex justify-between text-xs text-slate-300">
                  <span>Formation :</span>
                  <span className="font-bold text-white">{savedInscription.formuleNom}</span>
                </div>
                <div className="mt-1 w-full flex justify-between text-xs text-slate-300">
                  <span>Total prévisionnel :</span>
                  <span className="font-bold text-amber-400">{formatPrice(savedInscription.montantTotal)}</span>
                </div>
              </div>

              {/* Big Action: WhatsApp */}
              <div className="mt-6 flex flex-col gap-3 max-w-md mx-auto">
                <a
                  href={buildWhatsAppMessage(savedInscription)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Transmettre mon dossier par WhatsApp</span>
                </a>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href={`tel:${EDEN_INFO.phoneCallPrimary}`}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>Appeler le secrétariat ({EDEN_INFO.telephones[0]})</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="text-xs text-slate-500 hover:text-slate-800 py-2 px-3"
                  >
                    Fermer la fenêtre
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
