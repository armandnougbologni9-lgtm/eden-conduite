import { GoogleGenAI } from '@google/genai';
import { EDEN_INFO, EDEN_FORMATIONS, EDEN_HORAIRES, EDEN_DOSSIER } from '../data/edenData';

const SYSTEM_INSTRUCTION = `
Tu es le Moniteur Virtuel et Assistant IA Officiel de l'auto-école EDEN CONDUITE au Bénin.
Informations officielles de l'auto-école :
- Nom : EDEN CONDUITE (Slogan : "Votre savoir-faire est notre raison d'être")
- Agrément d'État : Autorisation N° 2551/MIT/DC/SGM/ANaTT/DERC/SERC/SA délivrée par le Ministère des Infrastructures et des Transports (ANaTT Bénin)
- Localisation : Sise à Zopah en face du Centre des Handicapés d'Akassato, Abomey-Calavi, Bénin
- Téléphones / WhatsApp : (+229) 97 23 98 30 et (+229) 94 07 91 45
- Tarifs officiels en FCFA :
  * Droits d'inscription de base : 5 000 FCFA (valable 3 mois)
  * Permis B complet (voiture) : 150 000 FCFA (Total : 155 000 FCFA avec inscription)
  * Permis B accéléré (intensif) : 200 000 FCFA (Total : 205 000 FCFA avec inscription)
  * Permis Motos (A1-A2-A3) : 95 000 FCFA (Total : 100 000 FCFA)
  * Permis C / Dr (Poids lourds) : 120 000 FCFA (Total : 125 000 FCFA)
  * Permis C1 : 150 000 FCFA | Permis D (transport commun) : 180 000 FCFA
  * Perfectionnement / Recyclage : 4h (35 000 FCFA), 6h (45 000 FCFA), 10h (70 000 FCFA)
  * Quittance spéciale ressortissants étrangers : +20 000 FCFA
- Horaires des cours :
  * Coaching théorique (Code) : Lundi au Mercredi en matinée (08h00 - 11h00) ou en soirée (18h00 - 20h00)
  * Conduite pratique : Jeudi, Vendredi et Samedi (créneaux sur mesure de 07h00 à 18h00)
  * Secrétariat : Lundi au Samedi de 08h00 à 19h00 non-stop
- Pièces requises dossier ANaTT : 1 photo d'identité, CIP ou carte biométrique ANIP, certificat médical d'aptitude, attestation groupe sanguin, acte de mariage pour femmes mariées.

Règles de conduite au Bénin :
- Vitesse max agglomération : 50 km/h
- Vitesse max rase campagne : 90 km/h
- Priorité de base : Priorité à droite en l'absence de signalisation
- Rond-point : Priorité aux usagers déjà engagés sur l'anneau lorsque panneau cédez-le-passage
- Port du casque obligatoire pour moto, ceinture obligatoire pour auto.

Consignes de ton :
- Sois très chaleureux, courtois, pédagogue, encourageant et professionnel.
- Réponds en français clair, précis et synthétique.
- Invite toujours l'utilisateur à s'inscrire en ligne ou à contacter le secrétariat sur WhatsApp (+229 97 23 98 30).
`;

// Helper pour récupérer la clé API
function getApiKey(): string | null {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  return null;
}

// Réponses intelligentes intégrées si aucune clé API n'est fournie
function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('prix') || q.includes('tarif') || q.includes('cout') || q.includes('coût') || q.includes('combien')) {
    return `🚗 **Tarifs officiels chez EDEN CONDUITE :**\n\n• **Permis B Complet (Voiture) :** 150 000 FCFA (+ 5 000 FCFA inscription = 155 000 FCFA)\n• **Permis B Accéléré :** 200 000 FCFA (+ 5 000 FCFA inscription = 205 000 FCFA)\n• **Permis Motos (A1-A2-A3) :** 95 000 FCFA (+ 5 000 FCFA inscription = 100 000 FCFA)\n• **Permis Poids Lourds C :** 120 000 FCFA (+ 5 000 FCFA)\n• **Recyclage / Perfectionnement :** à partir de 35 000 FCFA (4h), 45 000 FCFA (6h) ou 70 000 FCFA (10h).\n\n*Note : Pour les candidats étrangers, une quittance légale de 20 000 FCFA s'applique.*\n\nVous pouvez lancer votre inscription en ligne dès maintenant !`;
  }

  if (q.includes('horaire') || q.includes('heure') || q.includes('cours') || q.includes('quand') || q.includes('jour')) {
    return `🕒 **Organisation des cours chez EDEN CONDUITE :**\n\n1. **Cours de Code (Théorie) :** Lundi au Mercredi\n   • Session Matinée : **08h00 — 11h00**\n   • Session Soirée : **18h00 — 20h00** (idéal pour travailleurs et étudiants)\n\n2. **Conduite Pratique au volant :** Jeudi, Vendredi et Samedi\n   • Créneaux souples de 07h00 à 18h00 fixés directement avec votre moniteur attitré.\n\n3. **Secrétariat & Inscriptions :** Lundi au Samedi de 08h00 à 19h00 sans interruption.`;
  }

  if (q.includes('piece') || q.includes('pièce') || q.includes('document') || q.includes('dossier') || q.includes('anatt')) {
    return `📋 **Dossier d'examen officiel ANaTT Bénin :**\n\n1. **01 Photo d'identité récente** (fond blanc ou neutre)\n2. **CIP** (Certificat d'Identification Personnelle délivré par l'ANIP) ou carte d'identité biométrique\n3. **Certificat médical d'aptitude à la conduite** (délivré par un médecin agréé)\n4. **Attestation officielle de groupe sanguin**\n5. *(Pour les femmes mariées)* : Extrait d'acte de mariage pour la concordance de nom.\n\nNotre secrétariat vous accompagne dans le montage complet de votre dossier !`;
  }

  if (q.includes('vitesse') || q.includes('limitation') || q.includes('km/h')) {
    return `🚦 **Règles de limitation de vitesse au Bénin :**\n\n• **En agglomération (ville, Akassato, Calavi, Cotonou...) :** **50 km/h** maximum pour préserver les piétons et deux-roues.\n• **Hors agglomération (rase campagne, routes inter-états) :** **90 km/h** maximum sur chaussée standard.\n\nAdaptez toujours votre vitesse aux intempéries (pluie tropicale) et à l'état de la chaussée.`;
  }

  if (q.includes('priorite') || q.includes('priorité') || q.includes('droite') || q.includes('rond point') || q.includes('rond-point') || q.includes('carrefour')) {
    return `🚸 **Règles de priorité au Bénin :**\n\n• **Carrefour sans panneau :** Règle stricte de la **priorité à droite**.\n• **Rond-point / Giratoire avec 'Cédez le passage' :** La priorité absolue appartient aux véhicules déjà engagés sur l'anneau.\n• **Feux tricolores :** Le feu vert donne le passage, le feu orange avertit de l'arrêt imminent, le feu rouge impose l'arrêt absolu.`;
  }

  if (q.includes('contact') || q.includes('adresse') || q.includes('ou') || q.includes('où') || q.includes('situe') || q.includes('téléphone') || q.includes('whatsapp')) {
    return `📍 **Comment joindre ou visiter EDEN CONDUITE :**\n\n• **Adresse :** Sise à Zopah en face du Centre des Handicapés d'Akassato, Abomey-Calavi, Bénin.\n• **Téléphones :** (+229) 97 23 98 30 / (+229) 94 07 91 45\n• **WhatsApp direct :** +229 97 23 98 30\n• **Agrément d'État :** Autorisation N° 2551/MIT/DC/SGM/ANaTT/DERC/SERC/SA\n\nNous sommes ouverts du Lundi au Samedi de 08h00 à 19h00 !`;
  }

  return `Bonjour et bienvenue chez **EDEN CONDUITE** ! 🚗\n\nJe suis votre moniteur virtuel. Je peux vous renseigner sur :\n• Nos formules et tarifs officiels (Permis B, Accéléré, Motos, Poids Lourds)\n• Les horaires de cours (matin 8h-11h ou soir 18h-20h)\n• Les pièces du dossier d'examen ANaTT\n• Les règles du code de la route au Bénin (panneaux, priorités, vitesses)\n• Votre démarche d'inscription en ligne.\n\nQue souhaitez-vous savoir pour débuter votre formation ?`;
}

export async function askGeminiAssistant(prompt: string, conversationHistory: { role: 'user' | 'model'; text: string }[] = []): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    // Mode local haute précision
    await new Promise(resolve => setTimeout(resolve, 600)); // Simuler réflexion fluide
    return getFallbackResponse(prompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construction de l'historique
    const contents = [
      ...conversationHistory.map(item => ({
        role: item.role,
        parts: [{ text: item.text }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return response.text;
    }
    return getFallbackResponse(prompt);
  } catch (error) {
    console.warn("Gemini API call failed, using high-quality local fallback", error);
    return getFallbackResponse(prompt);
  }
}
