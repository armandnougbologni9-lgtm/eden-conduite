/**
 * EDEN CONDUITE — Logique applicative publique (app.js)
 * Gère la navigation, les onglets tarifs, le simulateur FCFA, la checklist,
 * la galerie photo, la visionneuse Lightbox et le wizard d'inscription en ligne.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initStatusBadge();
  initTarifsTabs();
  initSimulator();
  initChecklist();
  initGallery();
  initWizard();
  initFAQ();
  initContactForm();
});

/* ==========================================================================
   1. NAVIGATION & HEADER
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.main-header');
  const burgerBtn = document.querySelector('.burger-btn');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Effet d'élévation au défilement
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Mise à jour du lien actif selon la section visible
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Menu mobile (burger)
  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/* ==========================================================================
   2. BADGE DYNAMIQUE D'OUVERTURE
   ========================================================================== */
function initStatusBadge() {
  const badgeDot = document.querySelector('.floating-status-badge .status-dot');
  const badgeText = document.querySelector('.floating-status-badge .status-text');
  if (!badgeText) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  const hour = now.getHours();

  // Ouvert du Lundi au Samedi de 08h à 19h
  const isOpen = (day >= 1 && day <= 6) && (hour >= 8 && hour < 19);

  if (isOpen) {
    if (badgeDot) badgeDot.style.background = '#10B981';
    badgeText.textContent = "Accueil Ouvert (08h - 19h)";
  } else {
    if (badgeDot) badgeDot.style.background = '#F59E0B';
    badgeText.textContent = "Accueil fermé — Réouverture à 08h";
  }
}

/* ==========================================================================
   3. ONGLETS DE TARIFS DYNAMIQUES
   ========================================================================== */
function formatFCFA(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + " FCFA";
}

function initTarifsTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.tarif-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInStep 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Action rapide : "Choisir ce pack"
  const selectBtns = document.querySelectorAll('.btn-select-pack');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const formulaId = e.currentTarget.getAttribute('data-id');
      prefillAndScrollToWizard(formulaId);
    });
  });
}

function prefillAndScrollToWizard(formulaId) {
  const wizardSection = document.getElementById('inscription');
  if (wizardSection) {
    wizardSection.scrollIntoView({ behavior: 'smooth' });
    
    // Cocher la formule correspondante dans le wizard
    const radio = document.querySelector(`input[name="wizard-formule"][value="${formulaId}"]`);
    if (radio) {
      radio.checked = true;
      document.querySelectorAll('.radio-card').forEach(rc => rc.classList.remove('selected'));
      const card = radio.closest('.radio-card');
      if (card) card.classList.add('selected');
      updateWizardRecap();
    }
  }
}

/* ==========================================================================
   4. SIMULATEUR DE TARIF EN DIRECT
   ========================================================================== */
function initSimulator() {
  const selectFormule = document.getElementById('sim-formule');
  const checkEtranger = document.getElementById('sim-etranger');
  const inputExtraHours = document.getElementById('sim-extra-hours');
  
  const elBase = document.getElementById('sim-result-base');
  const elDroit = document.getElementById('sim-result-droit');
  const elEtranger = document.getElementById('sim-result-etranger');
  const elExtra = document.getElementById('sim-result-extra');
  const elTotal = document.getElementById('sim-total-price');
  const btnApply = document.getElementById('btn-apply-simulation');

  if (!selectFormule) return;

  function recalculate() {
    const selectedOption = selectFormule.options[selectFormule.selectedIndex];
    const basePrice = Number(selectedOption.getAttribute('data-prix')) || 150000;
    const droitInscription = 5000;
    const isEtranger = checkEtranger ? checkEtranger.checked : false;
    const extraHours = Number(inputExtraHours ? inputExtraHours.value : 0) || 0;

    const coutEtranger = isEtranger ? 20000 : 0;
    const coutExtra = extraHours * 10000; // 10 000 FCFA l'heure supplémentaire
    const total = basePrice + droitInscription + coutEtranger + coutExtra;

    if (elBase) elBase.textContent = formatFCFA(basePrice);
    if (elDroit) elDroit.textContent = formatFCFA(droitInscription);
    if (elEtranger) elEtranger.textContent = isEtranger ? "+20 000 FCFA" : "0 FCFA";
    if (elExtra) elExtra.textContent = extraHours > 0 ? `+${formatFCFA(coutExtra)} (${extraHours}h)` : "0 FCFA";
    if (elTotal) elTotal.textContent = formatFCFA(total);
  }

  selectFormule.addEventListener('change', recalculate);
  if (checkEtranger) checkEtranger.addEventListener('change', recalculate);
  if (inputExtraHours) inputExtraHours.addEventListener('input', recalculate);

  if (btnApply) {
    btnApply.addEventListener('click', () => {
      const formVal = selectFormule.value;
      const isEtranger = checkEtranger ? checkEtranger.checked : false;
      
      prefillAndScrollToWizard(formVal);
      
      // Cocher statut étranger dans le wizard
      const radioNat = document.querySelector(`input[name="wizard-nationalite"][value="${isEtranger ? 'etranger' : 'nationale'}"]`);
      if (radioNat) radioNat.checked = true;

      showToast("Simulation appliquée à votre formulaire d'inscription !", "info");
    });
  }

  // Calcul initial
  recalculate();
}

/* ==========================================================================
   5. CHECKLIST INTERACTIVE DES PIECES DU DOSSIER
   ========================================================================== */
function initChecklist() {
  const items = document.querySelectorAll('.checklist-item');
  const countDisplay = document.getElementById('pieces-checked-count');
  const totalDisplay = document.getElementById('pieces-total-count');
  const progressBar = document.getElementById('pieces-progress-fill');
  const btnPrint = document.getElementById('btn-print-checklist');

  if (!items.length) return;

  function updateProgress() {
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    const total = items.length;
    
    if (countDisplay) countDisplay.textContent = checked;
    if (totalDisplay) totalDisplay.textContent = total;
    if (progressBar) {
      const pct = Math.round((checked / total) * 100);
      progressBar.style.width = `${pct}%`;
    }
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateProgress();
    });
  });

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  updateProgress();
}

/* ==========================================================================
   6. GALERIE PHOTOS & LIGHTBOX
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImgWrapper = document.getElementById('lightbox-wrapper');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Filtres
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title') || "EDEN CONDUITE";
      const svgOrImg = item.querySelector('.gallery-item-svg, img');

      if (lightbox && lightboxImgWrapper && svgOrImg) {
        lightboxImgWrapper.innerHTML = '';
        const clone = svgOrImg.cloneNode(true);
        lightboxImgWrapper.appendChild(clone);
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }
}

/* ==========================================================================
   7. WIZARD DE DEMANDE D'INSCRIPTION EN LIGNE
   ========================================================================== */
let currentStep = 1;

function initWizard() {
  const wizardForm = document.getElementById('wizard-form');
  const btnNext = document.getElementById('wizard-btn-next');
  const btnPrev = document.getElementById('wizard-btn-prev');
  const btnSubmit = document.getElementById('wizard-btn-submit');
  const radioCards = document.querySelectorAll('.radio-card');

  if (!wizardForm) return;

  // Clic sur radio cards
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        const name = radio.getAttribute('name');
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
          const parent = r.closest('.radio-card');
          if (parent) parent.classList.remove('selected');
        });
        card.classList.add('selected');
        updateWizardRecap();
      }
    });
  });

  // Navigation étapes
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }

  // Soumission finale
  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleWizardSubmission();
    });
  }

  // Écouteurs de changement pour mettre à jour le récap
  wizardForm.addEventListener('input', updateWizardRecap);
  wizardForm.addEventListener('change', updateWizardRecap);
}

function goToStep(stepNumber) {
  const totalSteps = 4;
  if (stepNumber < 1 || stepNumber > totalSteps) return;

  currentStep = stepNumber;

  // MAJ des panneaux
  document.querySelectorAll('.wizard-step-pane').forEach((pane, idx) => {
    pane.classList.toggle('active', idx + 1 === currentStep);
  });

  // MAJ des indicateurs du stepper
  document.querySelectorAll('.step-indicator-item').forEach((ind, idx) => {
    const stepIdx = idx + 1;
    ind.classList.remove('active', 'completed');
    if (stepIdx === currentStep) {
      ind.classList.add('active');
    } else if (stepIdx < currentStep) {
      ind.classList.add('completed');
    }
  });

  // Boutons Prev / Next / Submit
  const btnPrev = document.getElementById('wizard-btn-prev');
  const btnNext = document.getElementById('wizard-btn-next');
  const btnSubmit = document.getElementById('wizard-btn-submit');

  if (btnPrev) btnPrev.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  if (btnNext) btnNext.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
  if (btnSubmit) btnSubmit.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

  if (currentStep === 4) {
    updateWizardRecap();
  }

  // Défilement doux vers le haut du formulaire
  const wizardCard = document.querySelector('.wizard-card');
  if (wizardCard) {
    wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    const formuleChecked = document.querySelector('input[name="wizard-formule"]:checked');
    if (!formuleChecked) {
      showToast("Veuillez sélectionner votre formation souhaitée.", "error");
      return false;
    }
  }

  if (step === 2) {
    const nom = document.getElementById('wiz-nom');
    const prenom = document.getElementById('wiz-prenom');
    const tel = document.getElementById('wiz-telephone');

    if (!nom || !nom.value.trim()) {
      highlightError(nom, "Le nom est obligatoire.");
      isValid = false;
    } else {
      clearError(nom);
    }

    if (!prenom || !prenom.value.trim()) {
      highlightError(prenom, "Le prénom est obligatoire.");
      isValid = false;
    } else {
      clearError(prenom);
    }

    if (!tel || !tel.value.trim() || tel.value.trim().length < 8) {
      highlightError(tel, "Veuillez entrer un numéro de téléphone valide (8 chiffres min).");
      isValid = false;
    } else {
      clearError(tel);
    }
  }

  if (step === 3) {
    const coachingChecked = document.querySelector('input[name="wizard-coaching"]:checked');
    if (!coachingChecked) {
      showToast("Veuillez choisir votre horaire de coaching théorique préféré.", "error");
      return false;
    }
  }

  return isValid;
}

function highlightError(inputElement, message) {
  inputElement.classList.add('error');
  const errorMsg = inputElement.parentElement.querySelector('.form-error-msg');
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.classList.add('visible');
  }
}

function clearError(inputElement) {
  inputElement.classList.remove('error');
  const errorMsg = inputElement.parentElement.querySelector('.form-error-msg');
  if (errorMsg) {
    errorMsg.classList.remove('visible');
  }
}

function updateWizardRecap() {
  const radioFormule = document.querySelector('input[name="wizard-formule"]:checked');
  const radioNat = document.querySelector('input[name="wizard-nationalite"]:checked');
  const radioCoach = document.querySelector('input[name="wizard-coaching"]:checked');

  const nom = (document.getElementById('wiz-nom')?.value || '').trim();
  const prenom = (document.getElementById('wiz-prenom')?.value || '').trim();
  const tel = (document.getElementById('wiz-telephone')?.value || '').trim();
  const whatsapp = (document.getElementById('wiz-whatsapp')?.value || tel).trim();
  const quartier = (document.getElementById('wiz-quartier')?.value || 'Non renseigné').trim();

  const formuleId = radioFormule ? radioFormule.value : 'permis-b-complet';
  const formuleNom = radioFormule?.getAttribute('data-nom') || 'Permis B — Formation Complète';
  const prixBase = Number(radioFormule?.getAttribute('data-prix')) || 150000;
  const isEtranger = radioNat ? radioNat.value === 'etranger' : false;

  const droitInscription = 5000;
  const majorationEtranger = isEtranger ? 20000 : 0;
  const montantTotal = prixBase + droitInscription + majorationEtranger;

  const coachingText = radioCoach?.value || 'Matinée (08h00 - 11h00)';

  // Remplissage récapitulatif
  setText('recap-candidat', `${prenom} ${nom.toUpperCase()}`);
  setText('recap-contact', `${tel} ${whatsapp ? '(WhatsApp: ' + whatsapp + ')' : ''}`);
  setText('recap-quartier', quartier);
  setText('recap-formule', formuleNom);
  setText('recap-nationalite', isEtranger ? 'Ressortissant étranger (+20 000 FCFA)' : 'Béninois / National');
  setText('recap-coaching', coachingText);
  setText('recap-total', formatFCFA(montantTotal));
}

function setText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = text;
}

function handleWizardSubmission() {
  const radioFormule = document.querySelector('input[name="wizard-formule"]:checked');
  const radioNat = document.querySelector('input[name="wizard-nationalite"]:checked');
  const radioCoach = document.querySelector('input[name="wizard-coaching"]:checked');

  const nom = (document.getElementById('wiz-nom')?.value || '').trim();
  const prenom = (document.getElementById('wiz-prenom')?.value || '').trim();
  const tel = (document.getElementById('wiz-telephone')?.value || '').trim();
  const whatsapp = (document.getElementById('wiz-whatsapp')?.value || tel).trim();
  const email = (document.getElementById('wiz-email')?.value || '').trim();
  const quartier = (document.getElementById('wiz-quartier')?.value || '').trim();
  const notes = (document.getElementById('wiz-notes')?.value || '').trim();

  // Pièces déclarées
  const piecesPretes = [];
  document.querySelectorAll('input[name="wiz-pieces"]:checked').forEach(cb => {
    piecesPretes.push(cb.value);
  });

  const formuleId = radioFormule ? radioFormule.value : 'permis-b-complet';
  const formuleNom = radioFormule?.getAttribute('data-nom') || 'Permis B — Formation Complète';
  const prixBase = Number(radioFormule?.getAttribute('data-prix')) || 150000;
  const isEtranger = radioNat ? radioNat.value === 'etranger' : false;
  const droitInscription = 5000;
  const majorationEtranger = isEtranger ? 20000 : 0;
  const montantTotal = prixBase + droitInscription + majorationEtranger;
  const preferenceCoaching = radioCoach?.value || 'Matinée (08h00 - 11h00)';

  const candidat = {
    nom,
    prenom,
    telephone: tel,
    whatsapp,
    email,
    quartier,
    nationalite: isEtranger ? 'etranger' : 'nationale',
    formuleId,
    formuleNom,
    montantTotal,
    preferenceCoaching,
    disponibilitePratique: "Jeudi, Vendredi, Samedi",
    piecesPretes,
    notes
  };

  // Enregistrement persistant dans EdenStorage
  const savedRecord = EdenStorage.create(candidat);

  // Rendu de l'écran de succès
  showSuccessReceipt(savedRecord);
  showToast("Votre demande d'inscription a été enregistrée avec succès !", "success");
}

function showSuccessReceipt(record) {
  const wizardBody = document.querySelector('.wizard-body');
  const wizardFooter = document.querySelector('.wizard-footer');
  const stepperHeader = document.querySelector('.wizard-stepper-header');

  if (wizardFooter) wizardFooter.style.display = 'none';
  if (stepperHeader) stepperHeader.style.display = 'none';

  // Message WhatsApp préparé pour l'auto-école
  const msgWhatsApp = encodeURIComponent(
    `Bonjour Auto-école EDEN CONDUITE,\n` +
    `Je viens d'effectuer une demande d'inscription en ligne sur votre site.\n\n` +
    `*Numéro de dossier :* ${record.id}\n` +
    `*Candidat :* ${record.prenom} ${record.nom}\n` +
    `*Téléphone :* ${record.telephone}\n` +
    `*Formule :* ${record.formuleNom}\n` +
    `*Session de Coaching :* ${record.preferenceCoaching}\n` +
    `*Montant total :* ${formatFCFA(record.montantTotal)}\n\n` +
    `Merci de me confirmer la suite de la démarche.`
  );

  const whatsappUrl = `https://wa.me/22997239830?text=${msgWhatsApp}`;

  wizardBody.innerHTML = `
    <div class="success-receipt-card">
      <div class="success-icon-badge">✓</div>
      <h3 class="success-title">Félicitations, votre demande est enregistrée !</h3>
      <p class="success-lead">
        Votre demande d'inscription pour l'auto-école <strong>EDEN CONDUITE</strong> a été prise en compte avec succès. 
        Notre secrétariat prendra contact avec vous rapidement pour finaliser votre dossier.
      </p>

      <div class="dossier-id-chip">
        <span class="chip-label">Votre Numéro de Dossier Officiel</span>
        <span class="chip-id">${record.id}</span>
      </div>

      <div class="recap-box" style="text-align: left; max-width: 600px; margin: 0 auto 2.5rem auto;">
        <div class="recap-row"><span class="recap-label">Candidat :</span><span class="recap-val">${record.prenom} ${record.nom}</span></div>
        <div class="recap-row"><span class="recap-label">Téléphone :</span><span class="recap-val">${record.telephone}</span></div>
        <div class="recap-row"><span class="recap-label">Formule :</span><span class="recap-val">${record.formuleNom}</span></div>
        <div class="recap-row"><span class="recap-label">Coaching théorique :</span><span class="recap-val">${record.preferenceCoaching}</span></div>
        <div class="recap-row"><span class="recap-label">Pratique :</span><span class="recap-val">Jeudi, Vendredi, Samedi (selon dispo)</span></div>
        <div class="recap-row"><span class="recap-label">Total prévisionnel :</span><span class="recap-val">${formatFCFA(record.montantTotal)}</span></div>
      </div>

      <div class="success-actions">
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
          Envoyer mon dossier par WhatsApp
        </a>
        <button onclick="window.print()" class="btn btn-outline btn-lg">
          Imprimer mon Reçu
        </button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   8. FAQ ACCORDEON
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* ==========================================================================
   9. FORMULAIRE DE CONTACT DIRECT
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('quick-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nom = document.getElementById('contact-nom')?.value || '';
    const tel = document.getElementById('contact-tel')?.value || '';
    const message = document.getElementById('contact-msg')?.value || '';

    if (!nom || !tel) {
      showToast("Veuillez renseigner votre nom et votre numéro de téléphone.", "error");
      return;
    }

    // Ouvrir WhatsApp direct avec le message de contact
    const textEncoded = encodeURIComponent(
      `Bonjour Auto-école EDEN CONDUITE,\n` +
      `Nom : ${nom}\n` +
      `Téléphone : ${tel}\n` +
      `Message : ${message}`
    );
    window.open(`https://wa.me/22997239830?text=${textEncoded}`, '_blank');

    showToast("Votre message a été transmis par WhatsApp !", "success");
    contactForm.reset();
  });
}

/* ==========================================================================
   10. SYSTEME DE NOTIFICATIONS TOAST
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
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Animation d'apparition
  setTimeout(() => toast.classList.add('show'), 10);

  // Disparition automatique après 4s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// Rendre accessible globalement
window.showToast = showToast;
window.prefillAndScrollToWizard = prefillAndScrollToWizard;
