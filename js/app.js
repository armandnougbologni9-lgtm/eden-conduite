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
  initDevisSimulator();
  initChecklist();
  initQuiz();
  initAssistantModal();
  initFAQ();
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

/* ==========================================================================
   7. SIMULATEUR DE DEVIS EN DIRECT (FCFA)
   ========================================================================== */
function initDevisSimulator() {
  const formFormule = document.getElementById('sim-formule');
  const formNat = document.getElementById('sim-nationalite');
  const formRec = document.getElementById('sim-recyclage');
  const displayTotal = document.getElementById('sim-total-display');
  const btnValider = document.getElementById('sim-btn-valider');

  if (!formFormule || !displayTotal) return;

  function recalculate() {
    const prixBase = Number(formFormule.options[formFormule.selectedIndex]?.getAttribute('data-prix')) || 150000;
    const fraisInscription = 5000;
    const majoration = (formNat && formNat.value === 'etranger') ? 20000 : 0;
    const prixRec = Number(formRec?.options[formRec.selectedIndex]?.getAttribute('data-prix')) || 0;

    const total = prixBase + fraisInscription + majoration + prixRec;
    displayTotal.textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
  }

  formFormule.addEventListener('change', recalculate);
  if (formNat) formNat.addEventListener('change', recalculate);
  if (formRec) formRec.addEventListener('change', recalculate);

  if (btnValider) {
    btnValider.addEventListener('click', () => {
      const selectedId = formFormule.value || 'permis-b-complet';
      if (typeof window.openInscriptionModal === 'function') {
        window.openInscriptionModal(selectedId);
      }
    });
  }

  recalculate();
}

/* ==========================================================================
   8. CHECKLIST DU DOSSIER ANaTT (PROGRESSION %)
   ========================================================================== */
function initChecklist() {
  const items = document.querySelectorAll('.checklist-item');
  const fill = document.getElementById('checklist-fill');
  const countText = document.getElementById('checklist-count');

  if (!items.length || !fill) return;

  function updateProgress() {
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    const total = items.length;
    const percent = Math.round((checked / total) * 100);

    fill.style.width = `${percent}%`;
    if (countText) {
      countText.textContent = `${checked} sur ${total} pièces prêtes (${percent}%)`;
    }
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateProgress();
    });
  });

  updateProgress();
}

/* ==========================================================================
   9. TEST DU CODE DE LA ROUTE (QUIZ INTERACTIF)
   ========================================================================== */
const QUIZ_DATA = [
  {
    q: "À une intersection sans signalisation ni panneau au Bénin, qui a la priorité ?",
    options: ["Le véhicule venant de la droite", "Le véhicule roulant le plus vite", "Le véhicule venant de la gauche", "Le véhicule le plus lourd"],
    correct: 0,
    exp: "En l'absence de toute signalisation (feux, stop, cédez-le-passage), la règle fondamentale du Code de la route est la priorité à droite."
  },
  {
    q: "En agglomération (Akassato, Calavi, Cotonou) au Bénin, quelle est la vitesse maximale autorisée ?",
    options: ["30 km/h", "50 km/h", "70 km/h", "90 km/h"],
    correct: 1,
    exp: "En agglomération au Bénin, la vitesse est limitée à 50 km/h pour garantir la sécurité de tous les usagers."
  },
  {
    q: "Sur un carrefour à sens giratoire (rond-point) doté du panneau 'Cédez le passage', qui a la priorité ?",
    options: ["Les véhicules qui entrent", "Les véhicules déjà engagés sur l'anneau", "Le premier qui klaxonne", "Toujours les transports en commun"],
    correct: 1,
    exp: "Sur un rond-point giratoire standard avec cédez-le-passage, la priorité absolue revient aux usagers qui circulent déjà sur l'anneau."
  },
  {
    q: "Quelle est la durée de validité officielle de votre dossier d'inscription chez EDEN CONDUITE ?",
    options: ["1 mois", "3 mois", "6 mois", "1 an"],
    correct: 1,
    exp: "Conformément au règlement officiel d'EDEN CONDUITE, l'inscription est valable pendant 3 mois d'accompagnement rigoureux."
  },
  {
    q: "Hors agglomération en rase campagne sur route standard, quelle est la vitesse maximale de référence ?",
    options: ["70 km/h", "90 km/h", "110 km/h", "130 km/h"],
    correct: 1,
    exp: "Hors agglomération sur chaussée standard bidirectionnelle, la vitesse maximale autorisée est de 90 km/h par temps sec."
  }
];

let quizCurrentIdx = 0;
let quizScore = 0;
let quizAnswered = false;

function initQuiz() {
  const container = document.getElementById('quiz-box');
  if (!container) return;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-box');
  if (!container) return;

  if (quizCurrentIdx >= QUIZ_DATA.length) {
    // Écran final
    container.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🏆</div>
        <div style="font-size: 0.85rem; font-weight: 700; color: #F59E0B; text-transform: uppercase;">Résultat officiel du test</div>
        <h3 style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 1rem 0;">Votre Score : ${quizScore} / ${QUIZ_DATA.length}</h3>
        <p style="font-size: 0.95rem; color: #CBD5E1; max-width: 480px; margin: 0 auto 1.75rem auto;">
          ${quizScore >= 4 
            ? "🎉 Excellent réflexe ! Vous avez le profil idéal pour décrocher votre code chez EDEN CONDUITE dès le premier passage." 
            : "👍 Très encourageant ! Grâce à nos séances de coaching en salle climatisée, vous maîtriserez tous les pièges de l'examen."}
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" onclick="restartQuiz()" class="btn btn-secondary btn-sm" style="color: #FFFFFF; border-color: rgba(255,255,255,0.2);">
            ↺ Recommencer le test
          </button>
          <button type="button" onclick="openInscriptionModal('permis-b-complet')" class="btn btn-primary btn-sm">
            S'inscrire chez EDEN CONDUITE →
          </button>
        </div>
      </div>
    `;
    return;
  }

  const q = QUIZ_DATA[quizCurrentIdx];
  quizAnswered = false;

  let optionsHtml = '';
  q.options.forEach((opt, idx) => {
    optionsHtml += `
      <button type="button" class="quiz-option-btn" onclick="selectQuizAnswer(${idx})">
        <span><strong>${String.fromCharCode(65 + idx)}.</strong> ${opt}</span>
        <span class="quiz-check-icon"></span>
      </button>
    `;
  });

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
      <span style="font-size: 0.8rem; font-weight: 700; color: #F59E0B; text-transform: uppercase; background: rgba(245,158,11,0.15); padding: 0.2rem 0.6rem; border-radius: 999px;">Code de la Route Bénin</span>
      <span style="font-size: 0.85rem; font-family: monospace; color: #94A3B8;">Question ${quizCurrentIdx + 1} / ${QUIZ_DATA.length}</span>
    </div>
    <h3 style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF; line-height: 1.45; margin-bottom: 1.25rem;">${q.q}</h3>
    <div id="quiz-options-list">${optionsHtml}</div>
    <div id="quiz-exp-container"></div>
    <div id="quiz-next-container" style="text-align: right; margin-top: 1.25rem; display: none;">
      <button type="button" onclick="nextQuizQuestion()" class="btn btn-primary btn-sm">
        ${quizCurrentIdx + 1 < QUIZ_DATA.length ? 'Question suivante →' : 'Voir mon résultat →'}
      </button>
    </div>
  `;
}

window.selectQuizAnswer = function(selectedIdx) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q = QUIZ_DATA[quizCurrentIdx];
  const buttons = document.querySelectorAll('.quiz-option-btn');

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) {
      btn.classList.add('correct');
      btn.querySelector('.quiz-check-icon').innerHTML = '✓';
    } else if (idx === selectedIdx) {
      btn.classList.add('wrong');
      btn.querySelector('.quiz-check-icon').innerHTML = '✗';
    }
  });

  if (selectedIdx === q.correct) {
    quizScore++;
  }

  const expBox = document.getElementById('quiz-exp-container');
  if (expBox) {
    expBox.innerHTML = `
      <div class="quiz-explanation-box">
        <strong>💡 Explication de l'instructeur :</strong><br>${q.exp}
      </div>
    `;
  }

  const nextBox = document.getElementById('quiz-next-container');
  if (nextBox) {
    nextBox.style.display = 'block';
  }
};

window.nextQuizQuestion = function() {
  quizCurrentIdx++;
  renderQuizQuestion();
};

window.restartQuiz = function() {
  quizCurrentIdx = 0;
  quizScore = 0;
  quizAnswered = false;
  renderQuizQuestion();
};

/* ==========================================================================
   14. MONITEUR VIRTUEL IA (ASSISTANT CHAT)
   ========================================================================== */
function initAssistantModal() {
  const modal = document.getElementById('assistant-modal');
  const chatBody = document.getElementById('assistant-chat-body');
  const chatInput = document.getElementById('assistant-chat-input');
  const chatForm = document.getElementById('assistant-chat-form');

  window.openAssistantModal = function() {
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('no-scroll');
      chatInput?.focus();
    }
  };

  window.closeAssistantModal = function() {
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  };

  if (chatForm && chatInput && chatBody) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      appendChatMessage('user', text);
      chatInput.value = '';

      // Réponse automatique
      setTimeout(() => {
        const reply = generateAssistantReply(text);
        appendChatMessage('bot', reply);
      }, 500);
    });
  }
}

function appendChatMessage(sender, text) {
  const chatBody = document.getElementById('assistant-chat-body');
  if (!chatBody) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;

  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function generateAssistantReply(query) {
  const q = query.toLowerCase();

  if (q.includes('prix') || q.includes('tarif') || q.includes('cout') || q.includes('coût') || q.includes('combien')) {
    return "🚗 Tarifs officiels chez EDEN CONDUITE :\n\n• Permis B Complet : 150 000 FCFA (+ 5 000F inscription = 155 000 FCFA)\n• Permis B Accéléré : 200 000 FCFA (+ 5 000F)\n• Permis Motos : 95 000 FCFA (+ 5 000F)\n• Permis Poids Lourds C : 120 000 FCFA (+ 5 000F)\n• Recyclage : dès 35 000 FCFA (4h), 45 000 FCFA (6h), 70 000 FCFA (10h).\n\n(Quittance spéciale étranger ANaTT : +20 000 FCFA).";
  }

  if (q.includes('horaire') || q.includes('heure') || q.includes('quand') || q.includes('cours')) {
    return "🕒 Horaires de formation chez EDEN CONDUITE :\n\n• Coaching théorique (Code) : Lundi au Mercredi\n  - Session Matin : 08h00 — 11h00\n  - Session Soir : 18h00 — 20h00 (idéal travailleurs)\n• Conduite pratique : Jeudi, Vendredi, Samedi (07h00 à 18h00 sur rendez-vous).\n• Secrétariat : Lun au Sam (08h00 — 19h00 non-stop).";
  }

  if (q.includes('piece') || q.includes('pièce') || q.includes('document') || q.includes('dossier')) {
    return "📋 Pièces du dossier officiel ANaTT Bénin :\n\n1. 01 Photo d'identité récente\n2. CIP ou Carte Biométrique ANIP\n3. Visite médicale d'aptitude\n4. Attestation officielle de groupe sanguin\n5. Copie acte de mariage (si femme mariée).\n\nVous pouvez vous inscrire dès aujourd'hui même si le dossier n'est pas encore complet !";
  }

  if (q.includes('vitesse') || q.includes('km/h')) {
    return "🚦 Limitations de vitesse au Bénin :\n\n• En agglomération (ville, Calavi, Cotonou) : 50 km/h maximum.\n• En rase campagne sur route ordinaire : 90 km/h maximum.\nAdaptez toujours votre vitesse à l'état de la route et à la météo.";
  }

  if (q.includes('priorite') || q.includes('priorité') || q.includes('rond point') || q.includes('rond-point')) {
    return "🚸 Règles de priorité au Bénin :\n\n• Intersection sans panneau : Priorité absolue à droite.\n• Rond-point avec 'Cédez le passage' : Priorité aux usagers déjà engagés sur l'anneau.";
  }

  if (q.includes('contact') || q.includes('adresse') || q.includes('ou') || q.includes('où')) {
    return "📍 Nous sommes situés à Zopah en face du Centre des Handicapés d'Akassato, Abomey-Calavi.\nTéléphones : (+229) 97 23 98 30 / 94 07 91 45\nWhatsApp direct : +229 97 23 98 30";
  }

  return "Bonjour ! Je suis le Moniteur Virtuel d'EDEN CONDUITE. Vous pouvez me poser des questions sur les tarifs, les horaires de code (matin ou soir), les pièces du dossier ANaTT ou les règles de priorité au Bénin.";
}

window.askQuickQuestion = function(text) {
  appendChatMessage('user', text);
  setTimeout(() => {
    appendChatMessage('bot', generateAssistantReply(text));
  }, 400);
};

/* ==========================================================================
   15. FAQ ACCORDÉON
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      const answer = item.querySelector('.faq-answer');
      if (answer) {
        answer.style.display = isOpen ? 'block' : 'none';
      }
    });
  });
}

