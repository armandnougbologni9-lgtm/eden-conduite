/**
 * EDEN CONDUITE — Gestionnaire de Stockage Local et Données
 * Permet la persistance des demandes d'inscription et des actions administrateur
 */

const EdenStorage = {
  STORAGE_KEY: 'eden_inscriptions',
  ADMIN_PIN_KEY: 'eden_admin_pin',
  ADMIN_AUTH_KEY: 'eden_admin_logged',
  DEFAULT_PIN: 'eden2026',

  // Initialisation du stockage avec données de démonstration si vide
  init() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        const initiales = (window.EDEN_DATA && window.EDEN_DATA.inscriptionsInitiales) 
          ? window.EDEN_DATA.inscriptionsInitiales 
          : [];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initiales));
      }
      if (!localStorage.getItem(this.ADMIN_PIN_KEY)) {
        localStorage.setItem(this.ADMIN_PIN_KEY, this.DEFAULT_PIN);
      }
    } catch (e) {
      console.warn("Storage non disponible, utilisation mémoire locale", e);
    }
  },

  // Récupérer toutes les demandes d'inscription triées par date décroissante
  getAll() {
    this.init();
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const list = data ? JSON.parse(data) : [];
      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
      console.error("Erreur lecture storage", e);
      return [];
    }
  },

  // Récupérer une demande spécifique par son identifiant
  getById(id) {
    const list = this.getAll();
    return list.find(item => item.id === id) || null;
  },

  // Générer un numéro de dossier unique EDEN-2026-XXXX
  generateId() {
    const annee = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `EDEN-${annee}-${randomNum}`;
  },

  // Ajouter une nouvelle demande d'inscription
  create(candidat) {
    this.init();
    const list = this.getAll();
    const nouvelId = this.generateId();

    const nouvelleDemande = {
      id: nouvelId,
      date: new Date().toISOString(),
      nom: (candidat.nom || "").trim().toUpperCase(),
      prenom: (candidat.prenom || "").trim(),
      telephone: (candidat.telephone || "").trim(),
      whatsapp: (candidat.whatsapp || candidat.telephone || "").trim().replace(/\s+/g, ''),
      email: (candidat.email || "").trim().toLowerCase(),
      quartier: (candidat.quartier || "").trim(),
      nationalite: candidat.nationalite || "nationale",
      formuleId: candidat.formuleId || "permis-b-complet",
      formuleNom: candidat.formuleNom || "Permis B — Formation Complète",
      montantTotal: Number(candidat.montantTotal) || 155000,
      preferenceCoaching: candidat.preferenceCoaching || "Soirée (18h-20h)",
      disponibilitePratique: candidat.disponibilitePratique || "Selon accord avec coach",
      piecesPretes: Array.isArray(candidat.piecesPretes) ? candidat.piecesPretes : [],
      statut: "nouvelle", // nouvelle, contactee, en_cours, validee, rejetee
      notes: candidat.notes || "Demande déposée en ligne.",
      historique: [
        {
          date: new Date().toISOString(),
          action: "Création de la demande d'inscription en ligne"
        }
      ]
    };

    list.unshift(nouvelleDemande);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Erreur sauvegarde demande", e);
    }
    return nouvelleDemande;
  },

  // Mettre à jour le statut d'une demande
  updateStatut(id, nouveauStatut) {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index].statut = nouveauStatut;
      if (!list[index].historique) list[index].historique = [];
      list[index].historique.push({
        date: new Date().toISOString(),
        action: `Statut modifié : ${nouveauStatut}`
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  // Mettre à jour les notes administratives
  updateNotes(id, notes) {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index].notes = notes;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  // Supprimer une demande
  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Statistiques pour le tableau de bord
  getStats() {
    const list = this.getAll();
    const stats = {
      total: list.length,
      nouvelles: list.filter(i => i.statut === 'nouvelle').length,
      contactees: list.filter(i => i.statut === 'contactee').length,
      enCours: list.filter(i => i.statut === 'en_cours').length,
      validees: list.filter(i => i.statut === 'validee').length,
      rejetees: list.filter(i => i.statut === 'rejetee').length,
      montantTotalEstime: list.reduce((sum, item) => sum + (Number(item.montantTotal) || 0), 0)
    };
    return stats;
  },

  // Exportation CSV formaté pour Excel avec encodage UTF-8 (avec BOM)
  exportToCSV() {
    const list = this.getAll();
    if (!list.length) return false;

    const entetes = [
      "Numéro Dossier",
      "Date Inscription",
      "Nom",
      "Prénom",
      "Téléphone",
      "WhatsApp",
      "Email",
      "Nationalité",
      "Formule",
      "Montant Total (FCFA)",
      "Coaching Choisi",
      "Dispo Conduite",
      "Statut",
      "Notes Internes"
    ];

    const lignes = list.map(item => [
      `"${item.id}"`,
      `"${new Date(item.date).toLocaleDateString('fr-FR')} ${new Date(item.date).toLocaleTimeString('fr-FR')}"`,
      `"${item.nom.replace(/"/g, '""')}"`,
      `"${item.prenom.replace(/"/g, '""')}"`,
      `"${item.telephone}"`,
      `"${item.whatsapp}"`,
      `"${item.email}"`,
      `"${item.nationalite === 'etranger' ? 'Ressortissant Étranger' : 'Béninois / National'}"`,
      `"${(item.formuleNom || '').replace(/"/g, '""')}"`,
      `"${item.montantTotal || 0}"`,
      `"${(item.preferenceCoaching || '').replace(/"/g, '""')}"`,
      `"${(item.disponibilitePratique || '').replace(/"/g, '""')}"`,
      `"${item.statut}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [entetes.join(";"), ...lignes.map(l => l.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inscriptions_eden_conduite_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  },

  // Authentification de l'administrateur
  isAdminLoggedIn() {
    return sessionStorage.getItem(this.ADMIN_AUTH_KEY) === 'true';
  },

  loginAdmin(codePin) {
    this.init();
    const pinEnregistre = localStorage.getItem(this.ADMIN_PIN_KEY) || this.DEFAULT_PIN;
    if (codePin && codePin.trim() === pinEnregistre.trim()) {
      sessionStorage.setItem(this.ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  },

  logoutAdmin() {
    sessionStorage.removeItem(this.ADMIN_AUTH_KEY);
  },

  // Réinitialiser les données aux valeurs de démo
  resetToDemo() {
    const initiales = (window.EDEN_DATA && window.EDEN_DATA.inscriptionsInitiales) 
      ? window.EDEN_DATA.inscriptionsInitiales 
      : [];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initiales));
    localStorage.setItem(this.ADMIN_PIN_KEY, this.DEFAULT_PIN);
    return true;
  }
};

// Initialisation globale
if (typeof window !== 'undefined') {
  window.EdenStorage = EdenStorage;
  EdenStorage.init();
}
