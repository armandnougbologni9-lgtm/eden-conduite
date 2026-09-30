/**
 * EDEN CONDUITE — Configuration & Connecteur Cloud Firebase
 * Permet la synchronisation sécurisée des inscriptions avec Cloud Firestore
 * et l'authentification sécurisée de l'administrateur avec Firebase Auth.
 */

// 1. Remplacez ces valeurs par celles de votre projet Firebase
// (disponibles gratuitement sur https://console.firebase.google.com)
const FIREBASE_CONFIG = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "eden-conduite.firebaseapp.com",
  projectId: "eden-conduite",
  storageBucket: "eden-conduite.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Vérifie si la configuration Firebase a été complétée
function isFirebaseConfigured() {
  return (
    FIREBASE_CONFIG.apiKey && 
    FIREBASE_CONFIG.apiKey !== "VOTRE_API_KEY" && 
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.projectId !== "eden-conduite"
  );
}

window.EdenFirebase = {
  configured: isFirebaseConfigured(),
  db: null,
  auth: null,

  async init() {
    if (!this.configured) {
      console.info("ℹ️ Firebase en attente de configuration. Utilisation du stockage sécurisé local.");
      return false;
    }

    try {
      // Import dynamique des modules Firebase 10 via CDN ES Modules
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      const { getFirestore, doc, setDoc, getDocs, updateDoc, deleteDoc, collection, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
      const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");

      const app = initializeApp(FIREBASE_CONFIG);
      this.db = getFirestore(app);
      this.auth = getAuth(app);
      this.firestoreMethods = { doc, setDoc, getDocs, updateDoc, deleteDoc, collection, query, orderBy };
      this.authMethods = { signInWithEmailAndPassword, signOut, onAuthStateChanged };

      console.log("✅ Firebase connecté avec succès à Cloud Firestore !");
      return true;
    } catch (err) {
      console.error("Erreur d'initialisation Firebase :", err);
      return false;
    }
  },

  // Enregistrer une demande d'inscription dans Cloud Firestore
  async saveInscription(candidat) {
    if (!this.db) return false;
    try {
      const { doc, setDoc } = this.firestoreMethods;
      const ref = doc(this.db, "inscriptions", candidat.id);
      await setDoc(ref, candidat);
      return true;
    } catch (err) {
      console.error("Erreur sauvegarde Firestore :", err);
      return false;
    }
  },

  // Charger toutes les inscriptions (Réservé à l'Admin connecté)
  async loadInscriptions() {
    if (!this.db) return null;
    try {
      const { collection, getDocs, query, orderBy } = this.firestoreMethods;
      const q = query(collection(this.db, "inscriptions"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data());
      });
      return list;
    } catch (err) {
      console.error("Erreur lecture Firestore (droits insuffisants ou non connecté) :", err);
      return null;
    }
  },

  // Mettre à jour le statut
  async updateStatut(id, nouveauStatut) {
    if (!this.db) return false;
    try {
      const { doc, updateDoc } = this.firestoreMethods;
      const ref = doc(this.db, "inscriptions", id);
      await updateDoc(ref, {
        statut: nouveauStatut
      });
      return true;
    } catch (err) {
      console.error("Erreur mise à jour statut Firestore :", err);
      return false;
    }
  },

  // Mettre à jour les notes
  async updateNotes(id, notes) {
    if (!this.db) return false;
    try {
      const { doc, updateDoc } = this.firestoreMethods;
      const ref = doc(this.db, "inscriptions", id);
      await updateDoc(ref, { notes });
      return true;
    } catch (err) {
      console.error("Erreur mise à jour notes Firestore :", err);
      return false;
    }
  },

  // Supprimer une inscription
  async deleteInscription(id) {
    if (!this.db) return false;
    try {
      const { doc, deleteDoc } = this.firestoreMethods;
      const ref = doc(this.db, "inscriptions", id);
      await deleteDoc(ref);
      return true;
    } catch (err) {
      console.error("Erreur suppression Firestore :", err);
      return false;
    }
  },

  // Connexion Admin via Firebase Auth (Email/Mot de passe sécurisé)
  async loginAdmin(email, password) {
    if (!this.auth) return false;
    try {
      const { signInWithEmailAndPassword } = this.authMethods;
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error("Échec authentification Firebase Auth :", err);
      throw err;
    }
  },

  // Déconnexion Admin
  async logoutAdmin() {
    if (!this.auth) return;
    const { signOut } = this.authMethods;
    await signOut(this.auth);
  }
};

// Initialisation dès le chargement
if (typeof window !== "undefined") {
  window.EdenFirebase.init();
}
