# 🔒 Architecture & Guide de Sécurité — EDEN CONDUITE

Ce document détaille l'ensemble des mesures de sécurité mises en place sur le projet **EDEN CONDUITE** pour garantir l'intégrité de la plateforme et la stricte confidentialité des données personnelles des candidats (conformité APDP Bénin & RGPD).

---

## 🛡️ 1. Mesures de Sécurité Applicatives Implémentées

### A. Protection Anti-XSS (Cross-Site Scripting)
- Tous les champs soumis par les utilisateurs (`nom`, `prenom`, `telephone`, `quartier`, `notes`, etc.) sont systématiquement assainis via la fonction `EdenStorage.escapeHTML()` avant tout enregistrement ou insertion DOM.
- Utilisation stricte de `textContent` pour l'injection des données sensibles dans les modales et fiches candidats.

### B. Hachage Cryptographique du Code PIN Administrateur (SHA-256)
- Le mot de passe / code PIN administrateur n'est **jamais stocké en texte clair**.
- L'authentification calcule l'empreinte cryptographique **SHA-256** via l'API native standard `crypto.subtle.digest`.
- L'empreinte par défaut correspond à : `b7941cb904a4ee312d46e27a92548cb490890fbaaa7cb02c7bb3101ebc6314f8` (`eden2026`).

### C. Protection Anti-Brute Force (Rate Limiting & Lockout)
- Limitation stricte à **5 tentatives consécutives** de saisie du code PIN.
- En cas de 5 échecs consécutifs, l'accès à l'espace administration est **automatiquement verrouillé pendant 10 minutes**.

### D. Déconnexion Automatique d'Inactivité (Auto-Logout)
- Toute session administrateur est automatiquement fermée après **20 minutes d'inactivité** (souris, clavier, tactile).

### E. En-têtes de Sécurité HTTP & Anti-Clickjacking
- Balises META intégrées dans `index.html` et `admin.html` :
  - `X-Frame-Options: DENY` (interdit l'intégration dans des iframes malveillantes / clickjacking).
  - `X-Content-Type-Options: nosniff` (empêche l'usurpation de type MIME).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - Liens externes WhatsApp et Google Maps sécurisés avec `rel="noopener noreferrer"`.

---

## ☁️ 2. Sécurisation Cloud & Règles Firestore (`firestore.rules`)

Le projet intègre une synchronisation avec **Google Cloud Firestore**. Les règles de sécurité déployées dans `firestore.rules` appliquent le **principe du moindre privilège** et de **refus par défaut (Default Deny)** :

```javascript
// Extrait des règles firestore.rules
match /inscriptions/{inscriptionId} {
  // 1. Les candidats peuvent créer leur inscription (avec validation stricte)
  allow create: if isValidInscriptionCreation(request.resource.data);

  // 2. Seul l'administrateur authentifié peut lire, modifier ou supprimer
  allow read, update, delete: if isAdmin();
}
```

### Avantages majeurs pour l'auto-école :
1. **Confidentialité totale des candidats** : Aucun visiteur ne peut espionner les noms, numéros de téléphone ou adresses des autres inscrits.
2. **Intégrité des données** : Un candidat ne peut pas falsifier son statut (forcé à `nouvelle`) ni modifier les notes internes du secrétariat.
3. **Persistance multi-appareils** : Les inscriptions faites sur le téléphone d'un candidat arrivent instantanément sur le tableau de bord de l'administrateur, même sur un autre ordinateur.

---

## 🚀 3. Comment Activer Votre Base Cloud Firebase (En 3 étapes simples)

L'utilisation de Firebase est **100% gratuite** pour le volume d'une auto-école (Plan Spark gratuit).

### Étape 1 : Créer le projet Firebase
1. Rendez-vous sur la console Google : **[https://console.firebase.google.com](https://console.firebase.google.com)**.
2. Cliquez sur **« Ajouter un projet »** et nommez-le : `eden-conduite`.
3. Désactivez Google Analytics (optionnel) et cliquez sur **« Créer le projet »**.

### Étape 2 : Activer Firestore et copier les règles
1. Dans le menu de gauche, cliquez sur **Build > Firestore Database**, puis sur **« Créer une base de données »**.
2. Choisissez la localisation (par ex: `europe-west1` ou `nam5`) et validez.
3. Allez dans l'onglet **Règles (Rules)** de Firestore et copiez-collez l'intégralité du contenu du fichier [`firestore.rules`](file:///e:/eden-conduite/firestore.rules) présent à la racine de votre projet.
4. Cliquez sur **« Publier »**.

### Étape 3 : Activer Firebase Auth (Email/Mot de passe)
1. Dans le menu de gauche, allez dans **Build > Authentication**, cliquez sur **« Commencer »**.
2. Activez le fournisseur **Adresse e-mail/Mot de passe**.
3. Dans l'onglet **Users (Utilisateurs)**, ajoutez votre compte administrateur avec l'email `edenconduite01@gmail.com` et un mot de passe fort.

### Étape 4 : Renseigner les identifiants dans le code
1. Allez dans les **Paramètres du projet** (icône d'engrenage ⚙️ en haut à gauche).
2. Sous *Vos applications*, cliquez sur l'icône Web **`</>`**, donnez le nom `eden-conduite-web` et enregistrez.
3. Copiez le bloc `firebaseConfig` affiché et collez-le dans le fichier [`js/firebase-config.js`](file:///e:/eden-conduite/js/firebase-config.js).

Dès que ce fichier est renseigné, le tableau de bord affichera automatiquement :  
🟢 **Cloud Firestore Connecté**.
