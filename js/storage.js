/**
 * EDEN CONDUITE — Moteur de Données & Stockage Sécurisé
 * Supporte :
 * 1. La synchronisation Cloud sécurisée (Firebase Firestore & Auth)
 * 2. Le stockage local sécurisé avec protection anti-XSS et hachage cryptographique SHA-256
 * 3. La protection anti-brute force et déconnexion automatique d'inactivité
 */

const EdenStorage = {
  STORAGE_KEY: 'eden_inscriptions',
  ADMIN_PIN_HASH_KEY: 'eden_admin_pin_hash',
  ADMIN_AUTH_KEY: 'eden_admin_logged',
  ADMIN_AUTH_TIME_KEY: 'eden_admin_auth_time',
  FAILED_ATTEMPTS_KEY: 'eden_failed_attempts',
  LOCKOUT_KEY: 'eden_lockout_until',

  // Hachage SHA-256 du PIN par défaut "eden2026"
  DEFAULT_PIN_HASH: 'b7941cb904a4ee312d46e27a92548cb490890fbaaa7cb02c7bb3101ebc6314f8',
  SESSION_TIMEOUT_MS: 20 * 60 * 1000, // Déconnexion après 20 min d'inactivité
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 10 * 60 * 1000, // 10 minutes de blocage

  // Sécurisation Anti-XSS : Échappe les caractères HTML dangereux
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Calcul du hachage SHA-256 via l'API standard Web Crypto
  async hashString(message) {
    try {
      const msgBuffer = new TextEncoder().encode(message.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn("Web Crypto non disponible, fallback hash simple", e);
      return message;
    }
  },

  // Initialisation du stockage sécurisé
  init() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        const initiales = (window.EDEN_DATA && window.EDEN_DATA.inscriptionsInitiales) 
          ? window.EDEN_DATA.inscriptionsInitiales 
          : [];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initiales));
      }
      if (!localStorage.getItem(this.ADMIN_PIN_HASH_KEY)) {
        localStorage.setItem(this.ADMIN_PIN_HASH_KEY, this.DEFAULT_PIN_HASH);
      }
    } catch (e) {
      console.warn("Storage non disponible", e);
    }
  },

  // Récupérer toutes les demandes (triées par date décroissante)
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

  // Synchronisation avec Cloud Firestore (si configuré)
  async syncFromCloud() {
    if (window.EdenFirebase && window.EdenFirebase.configured) {
      try {
        const cloudData = await window.EdenFirebase.loadInscriptions();
        if (Array.isArray(cloudData)) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cloudData));
          return cloudData;
        }
      } catch (err) {
        console.warn("Impossible de synchroniser avec le cloud :", err);
      }
    }
    return this.getAll();
  },

  // Récupérer une demande spécifique par son identifiant
  getById(id) {
    const list = this.getAll();
    return list.find(item => item.id === id) || null;
  },

  // Générer un numéro de dossier unique EDEN-YYYY-XXXX
  generateId() {
    const annee = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `EDEN-${annee}-${randomNum}`;
  },

  // Ajouter une nouvelle demande d'inscription (Local + Cloud Firestore)
  async create(candidat) {
    this.init();
    const list = this.getAll();
    const nouvelId = this.generateId();

    const nouvelleDemande = {
      id: nouvelId,
      date: new Date().toISOString(),
      nom: this.escapeHTML((candidat.nom || "").trim().toUpperCase()),
      prenom: this.escapeHTML((candidat.prenom || "").trim()),
      telephone: this.escapeHTML((candidat.telephone || "").trim()),
      whatsapp: this.escapeHTML((candidat.whatsapp || candidat.telephone || "").trim().replace(/\s+/g, '')),
      email: this.escapeHTML((candidat.email || "").trim().toLowerCase()),
      quartier: this.escapeHTML((candidat.quartier || "").trim()),
      nationalite: candidat.nationalite === 'etranger' ? 'etranger' : 'nationale',
      formuleId: this.escapeHTML(candidat.formuleId || "permis-b-complet"),
      formuleNom: this.escapeHTML(candidat.formuleNom || "Permis B — Formation Complète"),
      montantTotal: Number(candidat.montantTotal) || 155000,
      preferenceCoaching: this.escapeHTML(candidat.preferenceCoaching || "Soirée (18h-20h)"),
      disponibilitePratique: this.escapeHTML(candidat.disponibilitePratique || "Selon accord avec coach"),
      piecesPretes: Array.isArray(candidat.piecesPretes) ? candidat.piecesPretes : [],
      statut: "nouvelle",
      notes: this.escapeHTML(candidat.notes || "Demande déposée en ligne."),
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
      console.error("Erreur sauvegarde locale", e);
    }

    // Synchronisation en tâche de fond avec Cloud Firestore
    if (window.EdenFirebase && window.EdenFirebase.configured) {
      try {
        await window.EdenFirebase.saveInscription(nouvelleDemande);
      } catch (cloudErr) {
        console.warn("Sauvegarde cloud en attente de réseau :", cloudErr);
      }
    }

    return nouvelleDemande;
  },

  // Mettre à jour le statut d'une demande
  async updateStatut(id, nouveauStatut) {
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

      if (window.EdenFirebase && window.EdenFirebase.configured) {
        window.EdenFirebase.updateStatut(id, nouveauStatut);
      }
      return list[index];
    }
    return null;
  },

  // Mettre à jour les notes administratives
  async updateNotes(id, notes) {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      const escapedNotes = this.escapeHTML(notes);
      list[index].notes = escapedNotes;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));

      if (window.EdenFirebase && window.EdenFirebase.configured) {
        window.EdenFirebase.updateNotes(id, escapedNotes);
      }
      return list[index];
    }
    return null;
  },

  // Supprimer une demande
  async delete(id) {
    const list = this.getAll();
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));

    if (window.EdenFirebase && window.EdenFirebase.configured) {
      window.EdenFirebase.deleteInscription(id);
    }
    return true;
  },

  // Statistiques pour le tableau de bord
  getStats() {
    const list = this.getAll();
    return {
      total: list.length,
      nouvelles: list.filter(i => i.statut === 'nouvelle').length,
      contactees: list.filter(i => i.statut === 'contactee').length,
      enCours: list.filter(i => i.statut === 'en_cours').length,
      validees: list.filter(i => i.statut === 'validee').length,
      rejetees: list.filter(i => i.statut === 'rejetee').length,
      montantTotalEstime: list.reduce((sum, item) => sum + (Number(item.montantTotal) || 0), 0)
    };
  },

  // Exportation CSV formaté pour Excel avec encodage UTF-8 BOM
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
      `"${String(item.nom || '').replace(/"/g, '""')}"`,
      `"${String(item.prenom || '').replace(/"/g, '""')}"`,
      `"${item.telephone || ''}"`,
      `"${item.whatsapp || ''}"`,
      `"${item.email || ''}"`,
      `"${item.nationalite === 'etranger' ? 'Ressortissant Étranger' : 'Béninois / National'}"`,
      `"${String(item.formuleNom || '').replace(/"/g, '""')}"`,
      `"${item.montantTotal || 0}"`,
      `"${String(item.preferenceCoaching || '').replace(/"/g, '""')}"`,
      `"${String(item.disponibilitePratique || '').replace(/"/g, '""')}"`,
      `"${item.statut || ''}"`,
      `"${String(item.notes || '').replace(/"/g, '""')}"`
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

  // Authentification de l'administrateur avec vérification d'inactivité
  isAdminLoggedIn() {
    const isLogged = sessionStorage.getItem(this.ADMIN_AUTH_KEY) === 'true';
    if (!isLogged) return false;

    // Vérification du délai d'expiration de session (Auto-logout)
    const lastActive = Number(sessionStorage.getItem(this.ADMIN_AUTH_TIME_KEY)) || 0;
    if (Date.now() - lastActive > this.SESSION_TIMEOUT_MS) {
      this.logoutAdmin();
      return false;
    }
    // Mise à jour de la dernière activité
    sessionStorage.setItem(this.ADMIN_AUTH_TIME_KEY, String(Date.now()));
    return true;
  },

  // Vérifier si le compte est temporairement bloqué (Anti-Brute Force)
  isLockedOut() {
    const lockoutUntil = Number(localStorage.getItem(this.LOCKOUT_KEY)) || 0;
    if (Date.now() < lockoutUntil) {
      const minutesRemaining = Math.ceil((lockoutUntil - Date.now()) / 60000);
      return { locked: true, minutes: minutesRemaining };
    }
    return { locked: false, minutes: 0 };
  },

  // Connexion Admin sécurisée (Vérification Hash SHA-256 + Anti-brute force)
  async loginAdmin(codePin) {
    this.init();

    // 1. Contrôle anti-brute force
    const lockStatus = this.isLockedOut();
    if (lockStatus.locked) {
      throw new Error(`Accès temporairement verrouillé par mesure de sécurité. Réessayez dans ${lockStatus.minutes} min.`);
    }

    // 2. Vérification cryptographique
    const pinHashEnregistre = localStorage.getItem(this.ADMIN_PIN_HASH_KEY) || this.DEFAULT_PIN_HASH;
    const pinHashSaisi = await this.hashString(codePin);

    // Compatibilité temporaire si l'ancien PIN en clair était présent
    const oldPlainPin = localStorage.getItem('eden_admin_pin');
    const isMatch = (pinHashSaisi === pinHashEnregistre) || (oldPlainPin && codePin === oldPlainPin);

    if (isMatch) {
      // Succès : Réinitialiser les tentatives échouées
      localStorage.removeItem(this.FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(this.LOCKOUT_KEY);
      // Supprimer l'ancien PIN en clair s'il existait
      localStorage.removeItem('eden_admin_pin');

      sessionStorage.setItem(this.ADMIN_AUTH_KEY, 'true');
      sessionStorage.setItem(this.ADMIN_AUTH_TIME_KEY, String(Date.now()));
      return true;
    } else {
      // Échec : Incrémenter le compteur de tentatives
      const attempts = (Number(localStorage.getItem(this.FAILED_ATTEMPTS_KEY)) || 0) + 1;
      localStorage.setItem(this.FAILED_ATTEMPTS_KEY, String(attempts));

      if (attempts >= this.MAX_FAILED_ATTEMPTS) {
        localStorage.setItem(this.LOCKOUT_KEY, String(Date.now() + this.LOCKOUT_DURATION_MS));
        throw new Error("Trop de tentatives incorrectes. Votre accès est bloqué pendant 10 minutes.");
      }

      const restants = this.MAX_FAILED_ATTEMPTS - attempts;
      throw new Error(`Code PIN incorrect. Il vous reste ${restants} tentative(s) avant verrouillage.`);
    }
  },

  // Déconnexion Admin
  logoutAdmin() {
    sessionStorage.removeItem(this.ADMIN_AUTH_KEY);
    sessionStorage.removeItem(this.ADMIN_AUTH_TIME_KEY);
    if (window.EdenFirebase && window.EdenFirebase.configured) {
      window.EdenFirebase.logoutAdmin();
    }
  },

  // Modification sécurisée du code PIN administrateur
  async changePin(ancienPin, nouveauPin) {
    if (!nouveauPin || nouveauPin.length < 6) {
      throw new Error("Le nouveau code PIN doit comporter au moins 6 caractères.");
    }
    const ancienHashSaisi = await this.hashString(ancienPin);
    const pinHashEnregistre = localStorage.getItem(this.ADMIN_PIN_HASH_KEY) || this.DEFAULT_PIN_HASH;

    if (ancienHashSaisi !== pinHashEnregistre) {
      throw new Error("L'ancien code PIN est incorrect.");
    }

    const nouveauHash = await this.hashString(nouveauPin);
    localStorage.setItem(this.ADMIN_PIN_HASH_KEY, nouveauHash);
    return true;
  },

  // Réinitialiser les données aux valeurs de démo
  resetToDemo() {
    const initiales = (window.EDEN_DATA && window.EDEN_DATA.inscriptionsInitiales) 
      ? window.EDEN_DATA.inscriptionsInitiales 
      : [];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initiales));
    localStorage.setItem(this.ADMIN_PIN_HASH_KEY, this.DEFAULT_PIN_HASH);
    localStorage.removeItem(this.FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(this.LOCKOUT_KEY);
    return true;
  }
};

// Initialisation globale
if (typeof window !== 'undefined') {
  window.EdenStorage = EdenStorage;
  EdenStorage.init();
}
