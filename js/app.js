/**
 * EDEN CONDUITE — Logique applicative Frontend (app.js)
 * Optimisé Mobile-First : navigation tactile, filtrage formations,
 * carousel des avis avec support swipe et modal d'inscription rapide.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatusBadge();
  initFormationsFilter();
  initReviewsCarousel();
  initInscriptionModal();
});

/* ==========================================================================
   1. NAVIGATION & MENU MOBILE
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const burgerBtn = document.getElementById('burger-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  // Élévation de l'en-tête au scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Menu burger tactile
  if (burgerBtn && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = burgerBtn.classList.toggle('open');
      mobileDrawer.classList.toggle('open', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    };

    burgerBtn.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/* ==========================================================================
   2. BADGE STATUT D'OUVERTURE
   ========================================================================== */
function initStatusBadge() {
  const badgeDot = document.getElementById('nav-status-dot');
  const badgeText = document.getElementById('nav-status-text');
  if (!badgeText) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  const hour = now.getHours();

  // Ouvert du Lundi au Samedi de 08h à 19h
  const isOpen = (day >= 1 && day <= 6) && (hour >= 8 && hour < 19);

  if (isOpen) {
    if (badgeDot) badgeDot.style.background = '#10B981';
    badgeText.textContent = "Accueil Ouvert (8h - 19h)";
  } else {
    if (badgeDot) badgeDot.style.background = '#F59E0B';
    badgeText.textContent = "Accueil fermé — Réouverture 8h";
  }
}

/* ==========================================================================
   3. FILTRAGE RAPIDE DES FORMATIONS (PAR CATÉGORIE)
   ========================================================================== */
function initFormationsFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.formation-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. CAROUSEL TACTILE DES AVIS (SUPPORT DU SWIPE MOBILE)
   ========================================================================== */
function initReviewsCarousel() {
  const carousel = document.getElementById('reviews-carousel');
  const dotsContainer = document.getElementById('reviews-dots');
  if (!carousel || !dotsContainer) return;

  const cards = carousel.querySelectorAll('.review-card');
  if (!cards.length) return;

  // Création des points de pagination
  dotsContainer.innerHTML = '';
  cards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Voir témoignage ${index + 1}`);
    dot.addEventListener('click', () => {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.review-dot');

  // Détection du scroll pour mettre à jour les points actifs
  let scrollTimeout;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollPos = carousel.scrollLeft;
      const cardWidth = cards[0].offsetWidth;
      const activeIndex = Math.round(scrollPos / (cardWidth + 20));

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === Math.min(activeIndex, dots.length - 1));
      });
    }, 50);
  }, { passive: true });
}

/* ==========================================================================
   5. MODALE D'INSCRIPTION RAPIDE (3 ÉTAPES CLAIRES)
   ========================================================================== */
let activeModalStep = 1;

function initInscriptionModal() {
  const modalOverlay = document.getElementById('inscription-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const btnPrev = document.getElementById('wiz-btn-prev');
  const btnNext = document.getElementById('wiz-btn-next');
  const form = document.getElementById('quick-inscription-form');

  if (!modalOverlay) return;

  // Ouverture avec sélection de formation
  window.openInscriptionModal = function(formuleId = 'permis-b-complet') {
    modalOverlay.classList.add('active');
    document.body.classList.add('no-scroll');

    const select = document.getElementById('modal-input-formule');
    if (select && formuleId) {
      select.value = formuleId;
      updateFormulePricePreview();
    }
    setModalStep(1);
  };

  // Fermeture
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Changement de formule
  const selectFormule = document.getElementById('modal-input-formule');
  if (selectFormule) {
    selectFormule.addEventListener('change', updateFormulePricePreview);
  }

  // Navigation étapes
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateModalStep(activeModalStep)) {
        if (activeModalStep < 3) {
          setModalStep(activeModalStep + 1);
        } else {
          submitInscription();
        }
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (activeModalStep > 1) {
        setModalStep(activeModalStep - 1);
      }
    });
  }
}

function updateFormulePricePreview() {
  const select = document.getElementById('modal-input-formule');
  const preview = document.getElementById('modal-price-preview');
  if (!select || !preview) return;

  const selectedOpt = select.options[select.selectedIndex];
  const prix = Number(selectedOpt?.getAttribute('data-prix')) || 150000;
  const fraisInscription = 5000;
  const total = prix + fraisInscription;

  preview.textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA (dont 5 000 FCFA d'inscription)`;
}

function setModalStep(step) {
  activeModalStep = step;
  const stepBlocks = document.querySelectorAll('.modal-step-block');
  const dots = document.querySelectorAll('.stepper-dot');
  const btnPrev = document.getElementById('wiz-btn-prev');
  const btnNext = document.getElementById('wiz-btn-next');

  stepBlocks.forEach((block, idx) => {
    block.style.display = (idx + 1 === step) ? 'block' : 'none';
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx + 1 === step);
  });

  if (btnPrev) {
    btnPrev.style.display = step > 1 ? 'inline-flex' : 'none';
  }

  if (btnNext) {
    btnNext.textContent = step === 3 ? "Confirmer mon inscription" : "Suivant →";
  }

  if (step === 3) {
    renderModalSummary();
  }
}

function validateModalStep(step) {
  if (step === 1) return true;

  if (step === 2) {
    const nom = document.getElementById('modal-input-nom');
    const prenom = document.getElementById('modal-input-prenom');
    const tel = document.getElementById('modal-input-tel');

    if (!nom || !nom.value.trim()) {
      showToast("Veuillez renseigner votre nom de famille.", "error");
      nom?.focus();
      return false;
    }
    if (!prenom || !prenom.value.trim()) {
      showToast("Veuillez renseigner votre prénom.", "error");
      prenom?.focus();
      return false;
    }
    if (!tel || !tel.value.trim() || tel.value.trim().length < 8) {
      showToast("Veuillez entrer un numéro de téléphone valide (8 chiffres min).", "error");
      tel?.focus();
      return false;
    }
  }

  return true;
}

function renderModalSummary() {
  const nom = (document.getElementById('modal-input-nom')?.value || '').trim();
  const prenom = (document.getElementById('modal-input-prenom')?.value || '').trim();
  const tel = (document.getElementById('modal-input-tel')?.value || '').trim();
  const select = document.getElementById('modal-input-formule');
  const selectedOpt = select?.options[select.selectedIndex];
  const formuleNom = selectedOpt?.text || "Permis B";
  const prix = Number(selectedOpt?.getAttribute('data-prix')) || 150000;
  const coaching = document.getElementById('modal-input-coaching')?.value || "Session Soirée (18h-20h)";

  const total = prix + 5000;

  const recapEl = document.getElementById('modal-recap-content');
  if (recapEl) {
    recapEl.innerHTML = `
      <div class="receipt-row"><span>Candidat :</span><strong>${prenom} ${nom.toUpperCase()}</strong></div>
      <div class="receipt-row"><span>Téléphone :</span><strong>${tel}</strong></div>
      <div class="receipt-row"><span>Formation :</span><strong>${formuleNom}</strong></div>
      <div class="receipt-row"><span>Créneau théorique :</span><strong>${coaching}</strong></div>
      <div class="receipt-row"><span>Inscription simple :</span><strong>5 000 FCFA</strong></div>
      <div class="receipt-row"><span>Total prévisionnel :</span><strong>${new Intl.NumberFormat('fr-FR').format(total)} FCFA</strong></div>
    `;
  }
}

async function submitInscription() {
  const nom = (document.getElementById('modal-input-nom')?.value || '').trim();
  const prenom = (document.getElementById('modal-input-prenom')?.value || '').trim();
  const tel = (document.getElementById('modal-input-tel')?.value || '').trim();
  const whatsapp = (document.getElementById('modal-input-whatsapp')?.value || tel).trim();
  const quartier = (document.getElementById('modal-input-quartier')?.value || 'Abomey-Calavi').trim();
  const select = document.getElementById('modal-input-formule');
  const selectedOpt = select?.options[select.selectedIndex];
  const formuleId = select?.value || 'permis-b-complet';
  const formuleNom = selectedOpt?.getAttribute('data-nom') || selectedOpt?.text || "Permis B Formation Complète";
  const prix = Number(selectedOpt?.getAttribute('data-prix')) || 150000;
  const coaching = document.getElementById('modal-input-coaching')?.value || "Session Soirée (18h-20h)";

  const candidat = {
    nom,
    prenom,
    telephone: tel,
    whatsapp,
    quartier,
    nationalite: 'nationale',
    formuleId,
    formuleNom,
    montantTotal: prix + 5000,
    preferenceCoaching: coaching,
    disponibilitePratique: "Jeudi, Vendredi, Samedi",
    piecesPretes: [],
    notes: "Demande rapide déposée en ligne."
  };

  // Enregistrement sécurisé
  let record;
  if (window.EdenStorage) {
    record = await window.EdenStorage.create(candidat);
  } else {
    record = candidat;
    record.id = `EDEN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  showReceiptScreen(record);
  showToast("Votre demande a été enregistrée avec succès !", "success");
}

function showReceiptScreen(record) {
  const modalBody = document.querySelector('.modal-body');
  const modalFooter = document.querySelector('.modal-footer');
  const stepperDots = document.querySelector('.modal-stepper-dots');

  if (modalFooter) modalFooter.style.display = 'none';
  if (stepperDots) stepperDots.style.display = 'none';

  const msgWa = encodeURIComponent(
    `Bonjour Auto-école EDEN CONDUITE,\n` +
    `Je viens de soumettre mon inscription en ligne.\n\n` +
    `*Dossier N° :* ${record.id}\n` +
    `*Candidat :* ${record.prenom} ${record.nom}\n` +
    `*Téléphone :* ${record.telephone}\n` +
    `*Formule :* ${record.formuleNom}\n` +
    `*Coaching :* ${record.preferenceCoaching}\n` +
    `*Montant total :* ${new Intl.NumberFormat('fr-FR').format(record.montantTotal)} FCFA (dont 5 000F inscription)\n\n` +
    `Merci de m'indiquer quand passer au secrétariat.`
  );

  modalBody.innerHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <div style="width: 52px; height: 52px; border-radius: 50%; background: #ECFDF5; color: #065F46; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">✓</div>
      <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 0.5rem;">Demande enregistrée !</h3>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
        Bienvenue chez <strong>EDEN CONDUITE</strong>. Votre numéro officiel est généré :
      </p>
      
      <div style="display: inline-block; padding: 0.6rem 1.25rem; background: var(--color-primary-light); border: 1.5px dashed var(--color-primary); border-radius: var(--radius-md); font-family: monospace; font-size: 1.2rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1.5rem;">
        ${record.id}
      </div>

      <div style="margin-bottom: 1.5rem;">
        <a href="https://wa.me/22997239830?text=${msgWa}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-block btn-lg">
          💬 Transmettre mon dossier par WhatsApp
        </a>
      </div>

      <button type="button" onclick="location.reload()" class="btn btn-secondary btn-block">
        Fermer
      </button>
    </div>
  `;
}

/* ==========================================================================
   6. FEEDBACK TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

window.showToast = showToast;
