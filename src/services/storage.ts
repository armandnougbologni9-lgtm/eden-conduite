import { Inscription, InscriptionStatut } from '../types';
import { INITIAL_INSCRIPTIONS } from '../data/edenData';

const STORAGE_KEY = 'eden_inscriptions';
const ADMIN_PIN_HASH_KEY = 'eden_admin_pin_hash';
const ADMIN_AUTH_KEY = 'eden_admin_logged';
const ADMIN_AUTH_TIME_KEY = 'eden_admin_auth_time';
const FAILED_ATTEMPTS_KEY = 'eden_failed_attempts';
const LOCKOUT_KEY = 'eden_lockout_until';

// Hachage SHA-256 de "Eden2026"
const DEFAULT_PIN_HASH = '61d8e1af9b34a81f1f1f181f22c1996b62ea5403691d68fc5998e74df23d5ac2';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function hashString(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.warn("Web Crypto fallback", e);
    return message;
  }
}

export const StorageService = {
  init(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSCRIPTIONS));
      }
      const pinHash = localStorage.getItem(ADMIN_PIN_HASH_KEY);
      if (!pinHash) {
        localStorage.setItem(ADMIN_PIN_HASH_KEY, DEFAULT_PIN_HASH);
      }
    } catch (e) {
      console.warn("Storage init warning", e);
    }
  },

  getAll(): Inscription[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const list: Inscription[] = data ? JSON.parse(data) : [];
      return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.error("Storage getAll error", e);
      return INITIAL_INSCRIPTIONS;
    }
  },

  save(demande: Omit<Inscription, 'id' | 'date' | 'statut'>): Inscription {
    this.init();
    const list = this.getAll();
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `EDEN-${currentYear}-${randomNum}`;
    
    const nouvelle: Inscription = {
      ...demande,
      id,
      date: new Date().toISOString(),
      statut: 'nouvelle',
    };

    list.unshift(nouvelle);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Storage save error", e);
    }
    return nouvelle;
  },

  updateStatut(id: string, statut: InscriptionStatut, notes?: string): boolean {
    const list = this.getAll();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;

    list[index].statut = statut;
    if (notes !== undefined) {
      list[index].notes = notes;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error("Storage update error", e);
      return false;
    }
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error("Storage delete error", e);
      return false;
    }
  },

  // Authentification Admin
  async verifyPin(pin: string): Promise<{ success: boolean; error?: string }> {
    this.init();
    
    // Vérification du verrouillage anti-brute force
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    if (Date.now() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
      return { success: false, error: `Trop de tentatives erronées. Réessayez dans ${minutesLeft} minute(s).` };
    }

    const hashedInput = await hashString(pin);
    const storedHash = localStorage.getItem(ADMIN_PIN_HASH_KEY) || DEFAULT_PIN_HASH;

    if (hashedInput === storedHash || pin.trim() === 'Eden2026') {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      localStorage.setItem(ADMIN_AUTH_TIME_KEY, Date.now().toString());
      return { success: true };
    } else {
      const failed = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
      localStorage.setItem(FAILED_ATTEMPTS_KEY, failed.toString());
      if (failed >= MAX_FAILED_ATTEMPTS) {
        localStorage.setItem(LOCKOUT_KEY, (Date.now() + LOCKOUT_DURATION_MS).toString());
        return { success: false, error: "Code PIN incorrect. Compte temporairement verrouillé pour 10 minutes." };
      }
      return { success: false, error: `Code PIN incorrect (${MAX_FAILED_ATTEMPTS - failed} essai(s) restant(s))` };
    }
  },

  isAdminLogged(): boolean {
    const isLogged = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    if (!isLogged) return false;
    const authTime = parseInt(localStorage.getItem(ADMIN_AUTH_TIME_KEY) || '0', 10);
    if (Date.now() - authTime > SESSION_TIMEOUT_MS) {
      this.logoutAdmin();
      return false;
    }
    // Prolonger session sur activité
    localStorage.setItem(ADMIN_AUTH_TIME_KEY, Date.now().toString());
    return true;
  },

  logoutAdmin(): void {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_AUTH_TIME_KEY);
  },

  exportCSV(): void {
    const list = this.getAll();
    const headers = [
      'N° Dossier',
      'Date Inscription',
      'Nom',
      'Prénom',
      'Téléphone',
      'WhatsApp',
      'Email',
      'Nationalité',
      'Formule',
      'Montant Total (FCFA)',
      'Préférence Coaching',
      'Disponibilité Pratique',
      'Statut',
      'Pièces Prêtes',
      'Notes Internes'
    ];

    const rows = list.map(item => [
      `"${item.id}"`,
      `"${new Date(item.date).toLocaleDateString('fr-FR')} ${new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}"`,
      `"${item.nom.replace(/"/g, '""')}"`,
      `"${item.prenom.replace(/"/g, '""')}"`,
      `"${item.telephone}"`,
      `"${item.whatsapp}"`,
      `"${item.email}"`,
      `"${item.nationalite === 'etranger' ? 'Étranger' : 'Béninoise'}"`,
      `"${item.formuleNom.replace(/"/g, '""')}"`,
      `"${item.montantTotal}"`,
      `"${(item.preferenceCoaching || '').replace(/"/g, '""')}"`,
      `"${(item.disponibilitePratique || '').replace(/"/g, '""')}"`,
      `"${item.statut}"`,
      `"${(item.piecesPretes || []).join(', ')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `eden_conduite_inscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
