export type FormationType = 'auto' | 'moto' | 'lourd';

export interface Formation {
  id: string;
  categorie: string;
  nom: string;
  type: FormationType;
  badge?: string;
  prix: number; // en FCFA
  droitInscription: number; // 5000 FCFA
  description: string;
  inclus: string[];
}

export interface RecyclageOption {
  id: string;
  heures: number;
  titre: string;
  prix: number; // en FCFA
  badge?: string;
  description: string;
}

export interface DossierPiece {
  id: string;
  titre: string;
  description: string;
  obligatoire: boolean;
  condition?: string;
}

export interface CoachingSession {
  nom: string;
  plage: string;
  badge: string;
}

export interface CoachingHoraire {
  jours: string;
  sessions: CoachingSession[];
  description: string;
}

export interface ConduiteHoraire {
  jours: string;
  description: string;
  creneaux: string;
}

export interface SecretariatHoraire {
  jours: string;
  plage: string;
  dimanche: string;
}

export interface AvisItem {
  nom: string;
  quartier: string;
  permis: string;
  note: number;
  date: string;
  commentaire: string;
}

export interface FAQItem {
  question: string;
  reponse: string;
}

export interface StatItem {
  valeur: string;
  libelle: string;
  icone: string;
}

export type InscriptionStatut = 'nouvelle' | 'contactee' | 'en_cours' | 'validee' | 'rejetee';

export interface Inscription {
  id: string; // Ex: EDEN-2026-0143
  date: string;
  nom: string;
  prenom: string;
  telephone: string;
  whatsapp: string;
  email: string;
  nationalite: 'nationale' | 'etranger';
  formuleId: string;
  formuleNom: string;
  montantTotal: number;
  preferenceCoaching: string;
  disponibilitePratique: string;
  statut: InscriptionStatut;
  notes: string;
  piecesPretes: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explication: string;
  category: 'Priorités' | 'Signalisation' | 'Vitesse & Sécurité' | 'Règles ANaTT';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
