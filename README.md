# 🚗 Site Web Officiel & Espace Administration — EDEN CONDUITE

> **Auto-école EDEN CONDUITE** — *« Votre savoir-faire est notre raison d'être »*  
> **Agrément d'État :** Autorisation N° 2551/MIT/DC/SGM/ANaTT/DERC/SERC/SA  
> **Adresse :** Sise à Zopah en face du Centre des Handicapés d'Akassato, Abomey-Calavi, République du Bénin  
> **Position GPS / Google Maps :** [Localiser sur Google Maps](https://maps.google.com/?q=6.492536,2.359913&entry=gps&g_st=aw) (6.492536, 2.359913)  
> **Téléphones & WhatsApp :** (+229) 97 23 98 30 / (+229) 94 07 91 45  

---

## 🎯 Présentation du Projet

Ce projet est une solution web complète, ultra-rapide, moderne et 100% responsive développée pour l'auto-école **EDEN CONDUITE**.

Elle comprend :
1. **Un site vitrine moderne pour les visiteurs et candidats (`index.html`)** :
   - Présentation de l'auto-école et de ses valeurs
   - Grille officielle des tarifs en Francs CFA (Permis B complet, accéléré, recyclage, motos A1-A2-A3, poids lourds C, C1, D)
   - Simulateur de devis interactif en direct
   - Horaires précis des cours de coaching théorique (Lundi au Mercredi : 08h-11h et 18h-20h) et de conduite pratique (Jeudi, Vendredi, Samedi)
   - Checklist interactive des pièces du dossier d'examen (CIP, certificat médical, groupe sanguin, photos)
   - Galerie photos avec visionneuse grand écran (Lightbox)
   - Formulaire d'inscription en ligne en 4 étapes avec attribution automatique de numéro de dossier (`EDEN-2026-XXXX`) et bouton de partage direct par WhatsApp
   - Section contact avec géolocalisation et bouton d'appel direct
2. **Un Espace Administrateur sécurisé (`admin.html`)** :
   - Authentification par code PIN sécurisé (Code par défaut : `Eden2026`)
   - Tableau de bord avec indicateurs clés (Total inscriptions, nouvelles demandes à contacter, dossiers en cours, montant prévisionnel total généré)
   - Tableau dynamique filtrable par statut (*Nouvelle*, *Contactée*, *En cours*, *Validée*, *Rejetée*) et par formule
   - Recherche instantanée par nom, téléphone, numéro de dossier
   - Fiche détaillée du candidat avec modification de statut, prise de notes internes et bouton direct WhatsApp pré-rempli
   - Exportation en 1 clic de l'ensemble des données au format **CSV / Excel** (avec encodage UTF-8 BOM pour une ouverture parfaite dans Microsoft Excel).

---

## 📂 Structure des Fichiers

```
e:\eden-conduite\
├── index.html                   # Site principal pour le grand public et les candidats
├── admin.html                   # Espace administrateur sécurisé
├── README.md                    # Guide du projet et documentation de déploiement
├── SECURITY.md                  # Guide de sécurité et règles Cloud Firestore
├── firestore.rules              # Règles de sécurité Firestore de production
├── firebase.json                # Configuration Firebase
├── css\
│   ├── style.css                # Styles globaux, charte graphique officielle, responsive
│   ├── components.css           # Cartes tarifs FCFA, simulateur, stepper wizard, lightbox, toasts
│   └── admin.css                # Interface d'administration, dashboard KPIs, tableau et modale
├── js\
│   ├── data.js                  # Données officielles de l'auto-école (tarifs, horaires, pièces)
│   ├── firebase-config.js       # Connecteur Cloud Firestore et Auth
│   ├── storage.js               # Moteur de persistance (localStorage, export CSV, auth PIN)
│   ├── app.js                   # Logique front-end interactive du site public
│   └── admin.js                 # Logique du tableau de bord administrateur
└── assets\
    └── images\
        └── logo-eden-conduite.jpg       # Logo officiel de l'auto-école EDEN CONDUITE
```

---

## 🚀 Comment Lancer et Tester le Site Immédiatement

Le site est conçu en technologies web modernes standard (HTML5 / CSS3 / JavaScript ES6+) sans aucune dépendance lourde obligatoire :

1. **Test direct dans le navigateur** :
   - Double-cliquez simplement sur `index.html` pour ouvrir le site public dans Chrome, Edge ou Firefox.
   - Double-cliquez sur `admin.html` pour tester l'espace d'administration.

2. **Accès Administrateur** :
   - Rendez-vous sur `admin.html` (ou cliquez sur le lien discret en bas de page du site).
   - Code PIN par défaut : **`Eden2026`**

3. **Avec un serveur local (Optionnel)** :
   - Si vous utilisez VS Code : clic droit sur `index.html` > *Open with Live Server*.
   - Ou avec Python si disponible : `python -m http.server 3000`
   - Ou avec n'importe quel serveur HTTP local.

---

## 🌐 Guide de Déploiement en Ligne (Gratuit & Rapide)

Le site est 100% prêt à être déployé en production :

### Option 1 : Déploiement sur Netlify (Recommandé - Moins de 2 minutes)
1. Rendez-vous sur [netlify.com](https://www.netlify.com/)
2. Glissez-déposez simplement le dossier `eden-conduite` dans la zone **"Deploy your site"**.
3. Votre site est immédiatement en ligne avec une adresse HTTPS sécurisée (ex: `https://eden-conduite.netlify.app`). Vous pouvez ensuite y relier votre propre nom de domaine personnalisé.

### Option 2 : Déploiement sur GitHub Pages
1. Créez un dépôt GitHub `eden-conduite`.
2. Poussez les fichiers du dossier `e:\eden-conduite\` sur la branche `main`.
3. Dans **Settings > Pages**, sélectionnez la branche `main` et enregistrez.

### Option 3 : Déploiement sur un hébergeur classique (cPanel / Apache / Nginx)
1. Connectez-vous par FTP ou via le gestionnaire de fichiers de votre hébergeur.
2. Téléversez l'ensemble des fichiers du dossier dans `public_html`.
3. Le site est immédiatement opérationnel.
