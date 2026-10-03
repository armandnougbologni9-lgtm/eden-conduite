import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound, Search, Download, Trash2, Edit3, MessageCircle, Phone, CheckCircle, Clock, AlertTriangle, Eye, ShieldCheck, LogOut, FileText } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Inscription, InscriptionStatut } from '../types';
import { EDEN_INFO } from '../data/edenData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Données du tableau de bord
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InscriptionStatut>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Inscription | null>(null);
  const [candidateNotes, setCandidateNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      const logged = StorageService.isAdminLogged();
      setIsLogged(logged);
      if (logged) {
        loadData();
      }
    }
  }, [isOpen]);

  const loadData = () => {
    const list = StorageService.getAll();
    setInscriptions(list);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setIsVerifying(true);
    setLoginError('');

    const res = await StorageService.verifyPin(pinInput);
    setIsVerifying(false);

    if (res.success) {
      setIsLogged(true);
      setPinInput('');
      loadData();
    } else {
      setLoginError(res.error || 'Code PIN incorrect');
    }
  };

  const handleLogout = () => {
    StorageService.logoutAdmin();
    setIsLogged(false);
    setSelectedCandidate(null);
  };

  const handleStatusChange = (id: string, newStatut: InscriptionStatut) => {
    StorageService.updateStatut(id, newStatut);
    loadData();
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate(prev => prev ? { ...prev, statut: newStatut } : null);
    }
  };

  const handleSaveNotes = (id: string) => {
    StorageService.updateStatut(id, selectedCandidate?.statut || 'nouvelle', candidateNotes);
    loadData();
    if (selectedCandidate) {
      setSelectedCandidate({ ...selectedCandidate, notes: candidateNotes });
    }
    alert("Note enregistrée avec succès !");
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Confirmez-vous la suppression du dossier ${id} ?`)) {
      StorageService.delete(id);
      loadData();
      if (selectedCandidate?.id === id) setSelectedCandidate(null);
    }
  };

  if (!isOpen) return null;

  // Filtrage
  const filteredList = inscriptions.filter(item => {
    const matchesSearch = 
      item.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.telephone.includes(searchQuery) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formuleNom.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPIs
  const totalInscriptions = inscriptions.length;
  const nouvellesCount = inscriptions.filter(i => i.statut === 'nouvelle').length;
  const enCoursCount = inscriptions.filter(i => i.statut === 'en_cours').length;
  const valideesCount = inscriptions.filter(i => i.statut === 'validee').length;
  const montantPrevisionnelTotal = inscriptions.reduce((acc, curr) => acc + (curr.montantTotal || 0), 0);

  const formatPrice = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';

  const getStatusBadge = (statut: InscriptionStatut) => {
    switch (statut) {
      case 'nouvelle':
        return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Nouvelle</span>;
      case 'contactee':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Contactée</span>;
      case 'en_cours':
        return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">En cours</span>;
      case 'validee':
        return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Validée</span>;
      case 'rejetee':
        return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Rejetée</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-heading">Espace Administration & Direction</h3>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  Sécurisé
                </span>
              </div>
              <p className="text-xs text-slate-400">Gestion des candidatures et suivi des dossiers ANaTT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLogged && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isLogged ? (
          /* LOGIN SCREEN */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-4">
                <KeyRound className="w-7 h-7" />
              </div>

              <h4 className="text-xl font-extrabold text-slate-900 font-heading">
                Authentification Direction
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Veuillez saisir votre code PIN administrateur pour accéder à la base de données.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Saisissez le code PIN (ex: Eden2026)"
                    className="w-full text-center p-3.5 rounded-2xl border border-slate-300 font-mono text-base tracking-widest outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <div className="text-[11px] text-slate-400 mt-1.5">
                    Code par défaut : <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-bold">Eden2026</code>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isVerifying ? 'Vérification...' : 'Accéder au tableau de bord'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 flex-shrink-0">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-semibold">Total Inscrits</div>
                <div className="text-2xl font-black text-slate-900 font-heading mt-1">{totalInscriptions}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-orange-600 font-semibold">À contacter</div>
                <div className="text-2xl font-black text-orange-600 font-heading mt-1">{nouvellesCount}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-amber-600 font-semibold">En cours</div>
                <div className="text-2xl font-black text-amber-600 font-heading mt-1">{enCoursCount}</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-emerald-600 font-semibold">Validées / Payées</div>
                <div className="text-2xl font-black text-emerald-600 font-heading mt-1">{valideesCount}</div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4 rounded-2xl border border-slate-800 shadow-xs">
                <div className="text-[11px] text-slate-400 font-semibold">Total Prévisionnel</div>
                <div className="text-lg font-black text-amber-400 font-heading mt-1 truncate">
                  {formatPrice(montantPrevisionnelTotal)}
                </div>
              </div>
            </div>

            {/* Action Bar (Search + Status + Export) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher nom, tél, dossier..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="nouvelle">Nouvelles demandes</option>
                  <option value="contactee">Contactées</option>
                  <option value="en_cours">En cours</option>
                  <option value="validee">Validées</option>
                  <option value="rejetee">Rejetées</option>
                </select>

                <button
                  onClick={() => StorageService.exportCSV()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter CSV / Excel</span>
                </button>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-3.5">N° Dossier</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Candidat</th>
                      <th className="p-3.5">Téléphone / WhatsApp</th>
                      <th className="p-3.5">Formule</th>
                      <th className="p-3.5">Montant</th>
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                          Aucun dossier ne correspond à votre recherche.
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{item.id}</td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap text-xs">
                            {new Date(item.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{item.nom} {item.prenom}</div>
                            <div className="text-[11px] text-slate-400">
                              {item.nationalite === 'etranger' ? 'Nationalité Étrangère' : 'Béninoise'}
                            </div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-slate-800">{item.telephone}</div>
                            {item.whatsapp && item.whatsapp !== item.telephone && (
                              <div className="text-[11px] text-emerald-600">WA: {item.whatsapp}</div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium text-slate-800">{item.formuleNom}</div>
                            <div className="text-[11px] text-slate-400">{item.preferenceCoaching}</div>
                          </td>
                          <td className="p-3.5 font-extrabold font-heading text-slate-900 whitespace-nowrap">
                            {formatPrice(item.montantTotal)}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={item.statut}
                              onChange={(e) => handleStatusChange(item.id, e.target.value as InscriptionStatut)}
                              className="text-xs p-1 rounded-lg border border-slate-200 bg-white font-semibold outline-none"
                            >
                              <option value="nouvelle">Nouvelle</option>
                              <option value="contactee">Contactée</option>
                              <option value="en_cours">En cours</option>
                              <option value="validee">Validée</option>
                              <option value="rejetee">Rejetée</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Direct WhatsApp button */}
                              <a
                                href={`https://wa.me/229${item.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${item.prenom}, c'est l'auto-école EDEN CONDUITE concernant votre dossier ${item.id}...`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                                title="Contacter par WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* View detail */}
                              <button
                                onClick={() => {
                                  setSelectedCandidate(item);
                                  setCandidateNotes(item.notes || '');
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                                title="Voir la fiche détaillée"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Candidate Detail Modal Popup */}
            {selectedCandidate && (
              <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono font-bold text-sm bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      {selectedCandidate.id}
                    </span>
                    {getStatusBadge(selectedCandidate.statut)}
                  </div>

                  <h4 className="text-xl font-extrabold text-slate-900 font-heading">
                    {selectedCandidate.nom} {selectedCandidate.prenom}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inscrit le {new Date(selectedCandidate.date).toLocaleDateString('fr-FR')} à {new Date(selectedCandidate.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Téléphone :</span>
                      <span className="font-bold font-mono">{selectedCandidate.telephone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">WhatsApp :</span>
                      <span className="font-bold font-mono text-emerald-700">{selectedCandidate.whatsapp}</span>
                    </div>
                    {selectedCandidate.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email :</span>
                        <span className="font-medium">{selectedCandidate.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Formation :</span>
                      <span className="font-bold text-slate-900">{selectedCandidate.formuleNom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total :</span>
                      <span className="font-extrabold text-orange-600">{formatPrice(selectedCandidate.montantTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Créneau Code :</span>
                      <span className="font-medium">{selectedCandidate.preferenceCoaching}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pratique :</span>
                      <span className="font-medium">{selectedCandidate.disponibilitePratique}</span>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Notes internes & suivi du secrétariat
                    </label>
                    <textarea
                      rows={3}
                      value={candidateNotes}
                      onChange={(e) => setCandidateNotes(e.target.value)}
                      placeholder="Ajouter des notes internes (ex: Acompte 50 000F versé, visite médicale prévue lundi...)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-orange-500"
                    />
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => handleSaveNotes(selectedCandidate.id)}
                        className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                      >
                        Enregistrer la note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
