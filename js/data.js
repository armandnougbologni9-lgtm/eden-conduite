/**
 * EDEN CONDUITE — Données officielles de l'auto-école
 * Autorisation N° 2551/MIT/DC/SGM/ANaTT/DERC/SERC/SA
 * Abomey-Calavi, République du Bénin
 */

const EDEN_DATA = {
  info: {
    name: "EDEN CONDUITE",
    fullname: "Auto-école EDEN CONDUITE",
    slogan: "Votre savoir-faire est notre raison d'être",
    agrement: "N° 2551/MIT/DC/SGM/ANaTT/DERC/SERC/SA",
    ministere: "Ministère des Infrastructures et des Transports — ANaTT Bénin",
    adresse: "Sise à Zopah en face du Centre des Handicapés d'Akassato",
    ville: "Abomey-Calavi",
    pays: "République du Bénin",
    telephones: ["97 23 98 30", "94 07 91 45"],
    phoneCallPrimary: "+22997239830",
    phoneCallSecondary: "+22994079145",
    whatsappPrimary: "22997239830",
    whatsappSecondary: "22994079145",
    email: "contact@edenconduite-benin.com",
    mapsQuery: "Zopah Akassato Abomey-Calavi Bénin",
    mapsUrl: "https://maps.google.com/?q=6.492536,2.359913&entry=gps&g_st=aw",
    coordinates: { lat: 6.492536, lng: 2.359913 },
    fraisInscriptionBase: 5000,
    majorationEtranger: 20000,
    validiteInscriptionMois: 3
  },

  horaires: {
    coachingTheorique: {
      jours: "Lundi au Mercredi",
      sessions: [
        { nom: "Session Matinée", plage: "08h00 — 11h00", badge: "Matin" },
        { nom: "Session Soirée", plage: "18h00 — 20h00", badge: "Soir" }
      ],
      description: "Cours théoriques en salle climatisée : révision du code, signalisation, priorités, règles de sécurité routière et tests en conditions réelles d'examen ANaTT."
    },
    conduitePratique: {
      jours: "Jeudi, Vendredi et Samedi",
      description: "Pratique sur route et en circuit : créneaux flexibles aménagés sur mesure selon la disponibilité conjointe de l'apprenant et du moniteur certifié.",
      creneaux: "De 07h00 à 18h00 (sur réservation)"
    },
    accueilSecretariat: {
      jours: "Du Lundi au Samedi",
      plage: "08h00 — 19h00 (non-stop)",
      dimanche: "Fermé"
    }
  },

  dossierExamen: [
    {
      id: "photo",
      titre: "01 Photo d'identité récente",
      description: "Format standard officiel sur fond blanc ou uni neutre.",
      obligatoire: true
    },
    {
      id: "cip",
      titre: "Certificat d'Identification Personnelle (CIP) ou Carte Biométrique",
      description: "Délivré par l'ANIP ou pièce d'identité biométrique valide.",
      obligatoire: true
    },
    {
      id: "certificat_medical",
      titre: "Visite médicale ou Certificat d'Aptitude",
      description: "Certificat médical d'aptitude à la conduite délivré par un médecin agréé.",
      obligatoire: true
    },
    {
      id: "groupe_sanguin",
      titre: "Attestation de groupe sanguin",
      description: "Carte ou bulletin officiel d'analyse sanguine de laboratoire.",
      obligatoire: true
    },
    {
      id: "acte_mariage",
      titre: "Copie d'extrait d'acte de mariage",
      description: "Requis uniquement pour les femmes mariées (concordance d'état civil).",
      obligatoire: false,
      condition: "Pour les femmes mariées"
    }
  ],

  formations: [
    {
      id: "permis-b-complet",
      categorie: "B ou F",
      nom: "Permis B — Formation Complète",
      type: "auto",
      badge: "Le Plus Choisi",
      prix: 150000,
      droitInscription: 5000,
      description: "La formation de référence pour maîtriser la conduite automobile et réussir l'examen du permis avec sérénité.",
      inclus: [
        "Frais de constitution et suivi du dossier d'examen inclus",
        "Coaching théorique complet (cours matin ou soir)",
        "Séances de conduite pratique sur véhicules double commande",
        "Examens blancs conformes au barème ANaTT",
        "Accompagnement par des moniteurs diplômés",
        "Inscription valable 3 mois"
      ]
    },
    {
      id: "permis-b-accelere",
      categorie: "B ou F",
      nom: "Permis B — Formation Accélérée",
      type: "auto",
      badge: "Formule Intensive",
      prix: 200000,
      droitInscription: 5000,
      description: "Rythme condensé pour les apprenants pressés ou professionnels souhaitant obtenir leur permis rapidement.",
      inclus: [
        "Frais de dossier et démarche prioritaire inclus",
        "Programme de coaching théorique intensif",
        "Planification rapprochée des heures de conduite pratique",
        "Simulations régulières d'examen officiel",
        "Coaching personnalisé de gestion du stress au volant",
        "Inscription valable 3 mois"
      ]
    },
    {
      id: "permis-motos",
      categorie: "A1 — A2 — A3",
      nom: "Permis Motos & Deux-Roues",
      type: "moto",
      badge: "2 Roues",
      prix: 95000,
      droitInscription: 5000,
      description: "Apprentissage de la conduite sécuritaire moto toutes cylindrées, maîtrise de l'équilibre et circulation urbaine.",
      inclus: [
        "Frais de dossier d'examen inclus",
        "Cours de code théorique adaptés aux deux-roues",
        "Maniement plateau et maîtrise des trajectoires",
        "Sensibilisation au port d'équipements de protection",
        "Présentation à l'examen officiel"
      ]
    },
    {
      id: "permis-c",
      categorie: "Dr ou C",
      nom: "Permis Poids Lourds C / Dr",
      type: "lourd",
      badge: "Professionnel",
      prix: 120000,
      droitInscription: 5000,
      description: "Destiné au transport de marchandises, camions rigides et carrières professionnelles du transport routier.",
      inclus: [
        "Frais de constitution du dossier inclus",
        "Réglementation spécifique du transport de marchandises",
        "Prise en main des gabarits et manœuvres de précision",
        "Vérifications techniques et sécurité de chargement",
        "Validation pratique d'examen"
      ]
    },
    {
      id: "permis-c1",
      categorie: "C1",
      nom: "Permis Poids Lourds C1",
      type: "lourd",
      badge: "Transport Marchandises",
      prix: 150000,
      droitInscription: 5000,
      description: "Pour la conduite de véhicules utilitaires lourds et transport logistique intermédiaire.",
      inclus: [
        "Frais de dossier inclus",
        "Formation théorique avancée et pratique renforcée",
        "Manœuvres d'attelage et conduite économique",
        "Préparation directe aux épreuves ANaTT"
      ]
    },
    {
      id: "permis-d",
      categorie: "D Plein",
      nom: "Permis Transport en Commun D",
      type: "lourd",
      badge: "Transport Voyageurs",
      prix: 180000,
      droitInscription: 5000,
      description: "Formation de haut niveau pour le transport collectif de personnes, autocars et bus.",
      inclus: [
        "Dossier complet inclus",
        "Règles strictes de sécurité des passagers",
        "Conduite souple et anticipative",
        "Gestion des urgences et de la relation passager",
        "Examen officiel de qualification"
      ]
    }
  ],

  recyclage: [
    {
      id: "rec-4h",
      heures: 4,
      titre: "Perfectionnement 4 Heures",
      prix: 35000,
      description: "Idéal pour reprendre confiance en ville, se réhabituer aux démarrages en côte et aux manœuvres de stationnement."
    },
    {
      id: "rec-6h",
      heures: 6,
      titre: "Perfectionnement 6 Heures",
      prix: 45000,
      badge: "Populaire",
      description: "Parcours équilibré combinant révision des priorités, conduite fluide sur grands axes et manœuvres complexes."
    },
    {
      id: "rec-10h",
      heures: 10,
      titre: "Perfectionnement 10 Heures",
      prix: 70000,
      description: "Remise à niveau complète pour conducteurs n'ayant pas conduit depuis longtemps ou souhaitant maîtriser tout type de circulation."
    }
  ],

  statistiques: [
    { valeur: "96%", libelle: "Taux de réussite au permis", icone: "award" },
    { valeur: "1500+", libelle: "Conducteurs certifiés formés", icone: "users" },
    { valeur: "100%", libelle: "Moniteurs agréés d'État", icone: "shield-check" },
    { valeur: "3 Mois", libelle: "Durée optimale d'accompagnement", icone: "calendar" }
  ],

  avis: [
    {
      nom: "Benoît AGUESSY",
      quartier: "Akassato",
      permis: "Permis B — Réussi au 1er coup",
      note: 5,
      date: "Août 2026",
      commentaire: "Les cours de coaching le soir de 18h à 20h m'ont permis d'apprendre après le boulot. Les moniteurs sont d'une patience remarquable. Merci à EDEN CONDUITE !"
    },
    {
      nom: "Chantal HOUNDÉGNON",
      quartier: "Zopah",
      permis: "Permis B Accéléré",
      note: 5,
      date: "Septembre 2026",
      commentaire: "Auto-école très sérieuse et honnête sur les tarifs. Pas de frais cachés, le dossier d'examen a été suivi de A à Z. Je recommande vivement à Calavi !"
    },
    {
      nom: "Rodrigue TOSSOU",
      quartier: "Cotonou",
      permis: "Permis Poids Lourds C",
      note: 5,
      date: "Juillet 2026",
      commentaire: "Formation rigoureuse sur le camion. Les créneaux du jeudi au samedi sont très pratiques pour s'organiser. Moniteur très pédagogue."
    }
  ],

  faq: [
    {
      question: "Combien coûte l'inscription et la formation au permis B ?",
      reponse: "Le droit d'inscription est fixé à 5 000 FCFA. La formation complète avec dossier d'examen inclus est de 150 000 FCFA (ou 200 000 FCFA en formule accélérée). Pour les ressortissants étrangers, une quittance complémentaire de 20 000 FCFA s'applique selon la réglementation."
    },
    {
      question: "Quels sont les jours et horaires des cours théoriques (code) ?",
      reponse: "Les séances de coaching théorique ont lieu du Lundi au Mercredi sur deux créneaux au choix : le matin de 08h00 à 11h00 et en soirée de 18h00 à 20h00, pour s'adapter à votre emploi du temps."
    },
    {
      question: "Quand se déroulent les cours de conduite pratique ?",
      reponse: "La pratique au volant s'effectue les Jeudis, Vendredis et Samedis. Les créneaux horaires sont fixés en concertation directe entre l'apprenant et le moniteur afin d'assurer un apprentissage sans stress."
    },
    {
      question: "Combien de temps mon inscription est-elle valable ?",
      reponse: "Toute inscription à l'auto-école EDEN CONDUITE est valable pour une durée de 3 mois à compter de votre date de début de formation."
    },
    {
      question: "Quelles sont les pièces à fournir pour le dossier d'examen ?",
      reponse: "Le dossier d'examen comprend : 01 photo d'identité, votre Certificat d'Identification Personnelle (CIP) ou carte biométrique, une visite médicale d'aptitude, une attestation de groupe sanguin, et pour les femmes mariées, une copie de l'extrait d'acte de mariage."
    }
  ],

  // Exemples initiaux pour le tableau de bord administrateur
  inscriptionsInitiales: [
    {
      id: "EDEN-2026-0142",
      date: "2026-09-28T09:30:00",
      nom: "SOSSOU",
      prenom: "Junior Marius",
      telephone: "97 45 12 30",
      whatsapp: "97451230",
      email: "junior.sossou@gmail.com",
      nationalite: "nationale",
      formuleId: "permis-b-complet",
      formuleNom: "Permis B — Formation Complète",
      montantTotal: 155000,
      preferenceCoaching: "Soirée (18h-20h)",
      disponibilitePratique: "Vendredi & Samedi matin",
      statut: "nouvelle",
      notes: "Candidat étudiant à l'UAC, souhaite démarrer le lundi suivant.",
      piecesPretes: ["photo", "cip", "groupe_sanguin"]
    },
    {
      id: "EDEN-2026-0141",
      date: "2026-09-27T16:15:00",
      nom: "KPADONOU",
      prenom: "Fidèle",
      telephone: "95 18 29 44",
      whatsapp: "95182944",
      email: "fidele.kpad@yahoo.fr",
      nationalite: "nationale",
      formuleId: "permis-b-accelere",
      formuleNom: "Permis B — Formation Accélérée",
      montantTotal: 205000,
      preferenceCoaching: "Matinée (08h-11h)",
      disponibilitePratique: "Jeudi & Samedi",
      statut: "en_cours",
      notes: "Acompte versé au secrétariat, visite médicale programmée.",
      piecesPretes: ["photo", "cip", "certificat_medical", "groupe_sanguin"]
    },
    {
      id: "EDEN-2026-0139",
      date: "2026-09-25T11:00:00",
      nom: "DIOP",
      prenom: "Moustapha",
      telephone: "61 88 40 12",
      whatsapp: "61884012",
      email: "moustapha.diop@africom.sn",
      nationalite: "etranger",
      formuleId: "permis-c",
      formuleNom: "Permis Poids Lourds C",
      montantTotal: 145000,
      preferenceCoaching: "Soirée (18h-20h)",
      disponibilitePratique: "Jeudi & Vendredi après-midi",
      statut: "validee",
      notes: "Quittance étranger (+20 000F) réglée. Dossier complet transmis ANaTT.",
      piecesPretes: ["photo", "cip", "certificat_medical", "groupe_sanguin"]
    }
  ]
};

// Export global pour utilisation dans les scripts
if (typeof window !== 'undefined') {
  window.EDEN_DATA = EDEN_DATA;
}
