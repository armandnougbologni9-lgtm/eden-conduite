/**
 * EDEN CONDUITE — Logique du tableau de bord administrateur (admin.js)
 * Gère l'authentification sécurisée, la synchronisation Cloud, le calcul des KPIs,
 * le filtrage des inscriptions, l'affichage détaillé, la prise de notes et l'exportation CSV.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initDashboardEvents();
  initActivityTracker();
});

let currentOpenId = null;

/* ==========================================================================
   1. AUTHENTIFICATION & SESSION SÉCURISÉE
   ========================================================================== */
function initAdminAuth() {
  const loginScreen = document.getElementById('admin-login-screen');
  const dashboardWrapper = document.getElementById('admin-dashboard-wrapper');
  const loginForm = document.getElementById('admin-login-form');
  const pinInput = document.getElementById('admin-pin-input');
  const btnLogout = document.getElementById('btn-admin-logout');

  function checkSession() {
    const lock = EdenStorage.isLockedOut();
    if (lock.locked) {
      showToast(`Accès temporairement verrouillé (${lock.minutes} min restantes).`, "error");
    }

    if (EdenStorage.isAdminLoggedIn()) {
      if (loginScreen) loginScreen.style.display = 'none';
      if (dashboardWrapper) dashboardWrapper.classList.add('active');
      renderDashboard();
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (dashboardWrapper) dashboardWrapper.classList.remove('active');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = pinInput.value;
      
      try {
        await EdenStorage.loginAdmin(code);
        showToast("Connexion réussie à l'espace administrateur", "success");
        checkSession();
      } catch (err) {
        showToast(err.message || "Code PIN incorrect.", "error");
        pinInput.value = '';
        pinInput.focus();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      EdenStorage.logoutAdmin();
      showToast("Déconnexion sécurisée effectuée.", "info");
      checkSession();
    });
  }

  // Vérifier à l'ouverture
  checkSession();
}

// Surveillance de l'inactivité (Auto-logout après 20 min)
function initActivityTracker() {
  const resetTimer = () => {
    if (sessionStorage.getItem(EdenStorage.ADMIN_AUTH_KEY) === 'true') {
      sessionStorage.setItem(EdenStorage.ADMIN_AUTH_TIME_KEY, String(Date.now()));
    }
  };

  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetTimer, { passive: true });
  });

  // Vérification périodique toutes les minutes
  setInterval(() => {
    if (sessionStorage.getItem(EdenStorage.ADMIN_AUTH_KEY) === 'true') {
      if (!EdenStorage.isAdminLoggedIn()) {
        showToast("Session expirée pour inactivité. Veuillez vous reconnecter.", "info");
        const loginScreen = document.getElementById('admin-login-screen');
        const dashboardWrapper = document.getElementById('admin-dashboard-wrapper');
        if (loginScreen) loginScreen.style.display = 'flex';
        if (dashboardWrapper) dashboardWrapper.classList.remove('active');
      }
    }
  }, 60000);
}

/* ==========================================================================
   2. CHARGEMENT DU DASHBOARD & KPIS
   ========================================================================== */
async function renderDashboard() {
  // Synchroniser avec Cloud Firestore si disponible
  if (window.EdenFirebase && window.EdenFirebase.configured) {
    await EdenStorage.syncFromCloud();
  }

  const stats = EdenStorage.getStats();

  // Rendu des métriques KPIs
  const elTotal = document.getElementById('kpi-total');
  const elNouvelles = document.getElementById('kpi-nouvelles');
  const elEnCours = document.getElementById('kpi-encours');
  const elMontant = document.getElementById('kpi-montant');
  const badgeSidebar = document.getElementById('sidebar-badge-new');

  if (elTotal) elTotal.textContent = stats.total;
  if (elNouvelles) elNouvelles.textContent = stats.nouvelles;
  if (elEnCours) elEnCours.textContent = stats.enCours + stats.contactees;
  if (elMontant) elMontant.textContent = formatFCFA(stats.montantTotalEstime);
  
  if (badgeSidebar) {
    badgeSidebar.textContent = `${stats.nouvelles} nv`;
    badgeSidebar.style.display = stats.nouvelles > 0 ? 'inline-block' : 'none';
  }

  // Indicateur statut de synchronisation Cloud
  const cloudDot = document.getElementById('cloud-sync-dot');
  const cloudText = document.getElementById('cloud-sync-text');
  if (cloudDot && cloudText) {
    if (window.EdenFirebase && window.EdenFirebase.configured) {
      cloudDot.style.background = '#10B981';
      cloudText.textContent = "Cloud Firestore Connecté";
      cloudText.style.color = '#34D399';
    } else {
      cloudDot.style.background = '#F59E0B';
      cloudText.textContent = "Mode Sécurisé (Local)";
      cloudText.style.color = '#94A3B8';
    }
  }

  // Rendu de la table
  renderTable();
}

function formatFCFA(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + " FCFA";
}

/* ==========================================================================
   3. TABLEAU DES CANDIDATURES & FILTRAGE (AVEC PROTECTION ANTI-XSS)
   ========================================================================== */
function renderTable() {
  const tableBody = document.getElementById('admin-inscriptions-tbody');
  if (!tableBody) return;

  const searchVal = (document.getElementById('table-search')?.value || '').toLowerCase().trim();
  const filterStatut = document.getElementById('filter-statut')?.value || 'all';
  const filterFormule = document.getElementById('filter-formule')?.value || 'all';

  const list = EdenStorage.getAll();

  const filtered = list.filter(item => {
    const nomStr = String(item.nom || '').toLowerCase();
    const prenomStr = String(item.prenom || '').toLowerCase();
    const telStr = String(item.telephone || '');
    const idStr = String(item.id || '').toLowerCase();

    const matchSearch = !searchVal || 
      nomStr.includes(searchVal) ||
      prenomStr.includes(searchVal) ||
      telStr.includes(searchVal) ||
      idStr.includes(searchVal);

    const matchStatut = filterStatut === 'all' || item.statut === filterStatut;
    const matchFormule = filterFormule === 'all' || item.formuleId === filterFormule;

    return matchSearch && matchStatut && matchFormule;
  });

  if (!filtered.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: #64748B;">
          Aucune demande d'inscription trouvée avec ces critères.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    const safeId = EdenStorage.escapeHTML(item.id);
    const safeNom = EdenStorage.escapeHTML(item.nom);
    const safePrenom = EdenStorage.escapeHTML(item.prenom);
    const safeQuartier = EdenStorage.escapeHTML(item.quartier || 'Calavi');
    const safeTelephone = EdenStorage.escapeHTML(item.telephone);
    const safeWhatsapp = EdenStorage.escapeHTML(item.whatsapp);
    const safeFormule = EdenStorage.escapeHTML(item.formuleNom);
    const safeStatut = EdenStorage.escapeHTML(item.statut);

    const dateFormatted = new Date(item.date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const statutLabels = {
      nouvelle: "Nouvelle",
      contactee: "Contactée",
      en_cours: "Dossier en cours",
      validee: "Validée",
      rejetee: "Rejetée"
    };

    return `
      <tr>
        <td>
          <strong style="font-family: monospace; color: var(--admin-sidebar);">${safeId}</strong>
        </td>
        <td style="color: #64748B; font-size: 0.85rem;">${dateFormatted}</td>
        <td>
          <div style="font-weight: 700; color: var(--admin-sidebar);">${safeNom} ${safePrenom}</div>
          <div style="font-size: 0.78rem; color: #64748B;">${safeQuartier} • ${item.nationalite === 'etranger' ? 'Étranger' : 'Béninois'}</div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span>${safeTelephone}</span>
            ${safeWhatsapp ? `
              <a href="https://wa.me/229${encodeURIComponent(safeWhatsapp.replace(/\s+/g, ''))}?text=Bonjour%20${encodeURIComponent(item.prenom || '')},%20auto-%C3%A9cole%20EDEN%20CONDUITE%20vous%20contacte%20concernant%20votre%20dossier%20${encodeURIComponent(item.id)}." target="_blank" rel="noopener noreferrer" title="Contacter sur WhatsApp" style="color: #25D366; font-size: 1.1rem; line-height: 1;">
                💬
              </a>
            ` : ''}
          </div>
        </td>
        <td>
          <div style="font-weight: 600;">${safeFormule}</div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--admin-primary);">${formatFCFA(item.montantTotal)}</div>
        </td>
        <td>
          <span class="status-pill ${safeStatut}">${statutLabels[item.statut] || safeStatut}</span>
        </td>
        <td>
          <div class="table-actions-cell">
            <button class="btn-icon-action" data-id="${safeId}" onclick="openDetailModal(this.getAttribute('data-id'))" title="Voir la fiche détaillée">
              👁️
            </button>
            <button class="btn-icon-action" data-id="${safeId}" onclick="deleteDemande(this.getAttribute('data-id'))" title="Supprimer cette demande" style="color: #EF4444;">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
   4. MODAL DETAIL CANDIDAT (TEXTCONTENT SÉCURISÉ)
   ========================================================================== */
function openDetailModal(id) {
  const item = EdenStorage.getById(id);
  if (!item) return;

  currentOpenId = id;
  const modal = document.getElementById('admin-detail-modal');

  const piecesLabels = {
    photo: "01 Photo d'identité",
    cip: "CIP ou Carte biométrique",
    certificat_medical: "Visite médicale",
    groupe_sanguin: "Attestation groupe sanguin"
  };

  // Remplissage sécurisé sans injection
  document.getElementById('modal-dossier-id').textContent = item.id;
  document.getElementById('modal-candidat-nom').textContent = `${item.nom} ${item.prenom}`;
  document.getElementById('modal-telephone').textContent = item.telephone;
  document.getElementById('modal-whatsapp').textContent = item.whatsapp || item.telephone;
  document.getElementById('modal-email').textContent = item.email || 'Non renseigné';
  document.getElementById('modal-quartier').textContent = item.quartier || 'Non renseigné';
  document.getElementById('modal-nationalite').textContent = item.nationalite === 'etranger' ? 'Ressortissant Étranger (+20 000F)' : 'Béninois / National';
  document.getElementById('modal-formule').textContent = item.formuleNom;
  document.getElementById('modal-montant').textContent = formatFCFA(item.montantTotal);
  document.getElementById('modal-coaching').textContent = item.preferenceCoaching || 'Non spécifié';
  
  // Pièces fournies (construction DOM propre)
  const piecesEl = document.getElementById('modal-pieces');
  if (piecesEl) {
    piecesEl.innerHTML = '';
    if (Array.isArray(item.piecesPretes) && item.piecesPretes.length) {
      item.piecesPretes.forEach(p => {
        const div = document.createElement('div');
        div.textContent = `✓ ${piecesLabels[p] || p}`;
        piecesEl.appendChild(div);
      });
    } else {
      piecesEl.textContent = 'Aucune pièce cochée';
    }
  }

  const selectStatut = document.getElementById('modal-select-statut');
  if (selectStatut) selectStatut.value = item.statut;

  const notesInput = document.getElementById('modal-notes');
  if (notesInput) notesInput.value = item.notes || '';

  // Liens d'action rapide
  const btnAppel = document.getElementById('modal-btn-call');
  if (btnAppel) btnAppel.href = `tel:+229${encodeURIComponent((item.telephone || '').replace(/\s+/g, ''))}`;

  const btnWa = document.getElementById('modal-btn-whatsapp');
  if (btnWa) {
    const msg = encodeURIComponent(
      `Bonjour ${item.prenom} ${item.nom},\n` +
      `Auto-école EDEN CONDUITE à Abomey-Calavi vous contacte concernant votre demande d'inscription réf : *${item.id}* (${item.formuleNom}).\n\n` +
      `Votre dossier est actuellement : *${item.statut.toUpperCase()}*.\n` +
      `Pourriez-vous nous préciser quand vous souhaitez passer au secrétariat pour finaliser votre inscription ?`
    );
    btnWa.href = `https://wa.me/229${encodeURIComponent((item.whatsapp || item.telephone || '').replace(/\s+/g, ''))}?text=${msg}`;
    btnWa.rel = "noopener noreferrer";
  }

  modal.classList.add('active');
}

function closeDetailModal() {
  const modal = document.getElementById('admin-detail-modal');
  if (modal) modal.classList.remove('active');
  currentOpenId = null;
}

async function saveModalChanges() {
  if (!currentOpenId) return;

  const selectStatut = document.getElementById('modal-select-statut');
  const notesInput = document.getElementById('modal-notes');

  if (selectStatut) {
    await EdenStorage.updateStatut(currentOpenId, selectStatut.value);
  }
  if (notesInput) {
    await EdenStorage.updateNotes(currentOpenId, notesInput.value);
  }

  showToast("Fiche candidat mise à jour avec succès !", "success");
  closeDetailModal();
  renderDashboard();
}

async function deleteDemande(id) {
  if (confirm(`Confirmez-vous la suppression sécurisée de la demande ${id} ?`)) {
    await EdenStorage.delete(id);
    showToast(`Demande ${id} supprimée.`, "info");
    renderDashboard();
  }
}

/* ==========================================================================
   5. ÉVÉNEMENTS GLOBAUX & EXPORT CSV
   ========================================================================== */
function initDashboardEvents() {
  const searchInput = document.getElementById('table-search');
  if (searchInput) searchInput.addEventListener('input', renderTable);

  const filterStatut = document.getElementById('filter-statut');
  const filterFormule = document.getElementById('filter-formule');
  if (filterStatut) filterStatut.addEventListener('change', renderTable);
  if (filterFormule) filterFormule.addEventListener('change', renderTable);

  const btnExport = document.getElementById('btn-export-csv');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const ok = EdenStorage.exportToCSV();
      if (ok) {
        showToast("Exportation Excel/CSV générée avec succès !", "success");
      } else {
        showToast("Aucune donnée à exporter.", "error");
      }
    });
  }

  const btnResetDemo = document.getElementById('btn-reset-demo');
  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', () => {
      if (confirm("Réinitialiser les demandes avec les données de démonstration ?")) {
        EdenStorage.resetToDemo();
        showToast("Données de démo réinitialisées !", "info");
        renderDashboard();
      }
    });
  }

  const modalClose = document.getElementById('modal-close-btn');
  if (modalClose) modalClose.addEventListener('click', closeDetailModal);

  const btnSaveModal = document.getElementById('modal-btn-save');
  if (btnSaveModal) btnSaveModal.addEventListener('click', saveModalChanges);
}

// Rendre accessible aux handlers inline
window.openDetailModal = openDetailModal;
window.deleteDemande = deleteDemande;
window.closeDetailModal = closeDetailModal;
