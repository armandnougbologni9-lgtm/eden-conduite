import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { EDEN_INFO, EDEN_HORAIRES } from '../data/edenData';

export const ContactSection: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !telephone || !message) return;

    // Redirige vers WhatsApp avec le message pré-rempli
    const text = `*MESSAGE VIA LE SITE WEB — EDEN CONDUITE*\n\n` +
      `👤 *Nom :* ${nom}\n` +
      `📞 *Téléphone :* ${telephone}\n` +
      `💬 *Message :* ${message}`;
    
    window.open(`https://wa.me/${EDEN_INFO.whatsappPrimary}?text=${encodeURIComponent(text)}`, '_blank');
    setFormSent(true);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide uppercase mb-3">
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>Localisation & Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Venez nous rencontrer à Akassato
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Notre secrétariat vous accueille avec le sourire du lundi au samedi. Vous pouvez aussi nous contacter directement par WhatsApp ou téléphone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coordonnées & GPS (Left 6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-6 flex items-center gap-2">
                <span>Coordonnées Officielles</span>
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Adresse physique */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Adresse de l'agence</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">
                      {EDEN_INFO.adresse}, {EDEN_INFO.ville}, {EDEN_INFO.pays}.
                    </div>
                    <a
                      href={EDEN_INFO.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 mt-2"
                    >
                      <span>Ouvrir sur Google Maps (GPS : 6.492536, 2.359913)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Téléphones d'appel */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Appels téléphoniques</div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <a
                        href={`tel:${EDEN_INFO.phoneCallPrimary}`}
                        className="font-mono font-bold text-slate-800 hover:text-orange-600 underline"
                      >
                        (+229) {EDEN_INFO.telephones[0]}
                      </a>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`tel:${EDEN_INFO.phoneCallSecondary}`}
                        className="font-mono font-bold text-slate-800 hover:text-orange-600 underline"
                      >
                        (+229) {EDEN_INFO.telephones[1]}
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">WhatsApp Secrétariat</div>
                    <div className="text-slate-600 text-xs mt-0.5">
                      Réponse rapide du lundi au samedi
                    </div>
                    <a
                      href={`https://wa.me/${EDEN_INFO.whatsappPrimary}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 mt-1"
                    >
                      <span>Discuter immédiatement (+229 97 23 98 30)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Horaires secrétariat */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Horaires d'accueil physique</div>
                    <div className="text-slate-600 mt-0.5">
                      {EDEN_HORAIRES.accueilSecretariat.jours} : <strong>{EDEN_HORAIRES.accueilSecretariat.plage}</strong>
                    </div>
                    <div className="text-rose-600 text-xs mt-0.5">
                      Dimanche : {EDEN_HORAIRES.accueilSecretariat.dimanche}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Visual Box */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 relative group h-48 sm:h-56 flex flex-col justify-end p-5">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                alt="Carte GPS Akassato Abomey-Calavi"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-20 text-white">
                <div className="text-xs uppercase font-bold tracking-wider text-orange-400">Position GPS Exacte</div>
                <div className="text-sm font-bold mt-0.5">Zopah, face Centre des Handicapés d'Akassato</div>
                <a
                  href={EDEN_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Itinéraire Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire de Contact Rapide (Right 6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
              Envoyez-nous un message direct
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Remplissez ce formulaire et notre responsable vous recontactera rapidement par appel ou WhatsApp.
            </p>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-emerald-950">Message transmis avec succès !</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Votre message a été transmis au secrétariat. Nous vous répondrons dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSent(false)}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Benoît AGUESSY"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Numéro de téléphone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Ex: 97 23 98 30"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Votre message ou question *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Bonjour, je souhaite avoir des précisions sur le permis B en formule accélérée et les dates de la prochaine session..."
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer mon message au secrétariat</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
