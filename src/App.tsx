import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TarifsSection } from './components/TarifsSection';
import { DevisSimulator } from './components/DevisSimulator';
import { HorairesSection } from './components/HorairesSection';
import { DossierChecklist } from './components/DossierChecklist';
import { CodeQuiz } from './components/CodeQuiz';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { InscriptionWizard } from './components/InscriptionWizard';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { AdminModal } from './components/AdminModal';
import { FloatingActions } from './components/FloatingActions';

export function App() {
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const [selectedFormuleId, setSelectedFormuleId] = useState<string>('permis-b-complet');
  const [initialNationalite, setInitialNationalite] = useState<'nationale' | 'etranger'>('nationale');
  const [selectedPieces, setSelectedPieces] = useState<string[]>(['photo', 'cip']);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleOpenInscription = (formuleId?: string) => {
    if (formuleId) setSelectedFormuleId(formuleId);
    setIsInscriptionOpen(true);
  };

  const handleProceedWithDevis = (data: {
    formuleId: string;
    formuleNom: string;
    nationalite: 'nationale' | 'etranger';
    recyclageId?: string;
    totalAmount: number;
  }) => {
    setSelectedFormuleId(data.formuleId);
    setInitialNationalite(data.nationalite);
    setIsInscriptionOpen(true);
  };

  const handleStartRegistrationWithPieces = (pieces: string[]) => {
    setSelectedPieces(pieces);
    setIsInscriptionOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#0F172A] selection:bg-orange-500/20 selection:text-orange-950 font-sans">
      {/* Barre de navigation */}
      <Navbar
        onOpenInscription={() => handleOpenInscription()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      <main>
        {/* Section Héro */}
        <Hero
          onOpenInscription={() => handleOpenInscription()}
          onOpenDevis={() => {
            document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenQuiz={() => {
            document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        {/* Grille des tarifs officiels */}
        <TarifsSection
          onSelectFormation={(fId) => handleOpenInscription(fId)}
        />

        {/* Simulateur interactif de devis en direct */}
        <DevisSimulator
          onProceedWithDevis={handleProceedWithDevis}
        />

        {/* Horaires des cours théoriques et pratiques */}
        <HorairesSection />

        {/* Checklist des pièces du dossier d'examen ANaTT */}
        <DossierChecklist
          onStartRegistrationWithPieces={handleStartRegistrationWithPieces}
        />

        {/* Test d'entraînement au Code de la Route Béninois */}
        <CodeQuiz
          onStartRegistration={() => handleOpenInscription()}
        />

        {/* Avis & Témoignages des diplômés */}
        <TestimonialsSection />

        {/* Foire aux questions */}
        <FAQSection
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        {/* Contact, Coordonnées & Itinéraire Google Maps */}
        <ContactSection />
      </main>

      {/* Pied de page officiel */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInscription={() => handleOpenInscription()}
      />

      {/* Actions flottantes WhatsApp & Assistant IA */}
      <FloatingActions
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenInscription={() => handleOpenInscription()}
      />

      {/* Modale d'inscription en 4 étapes */}
      <InscriptionWizard
        isOpen={isInscriptionOpen}
        onClose={() => setIsInscriptionOpen(false)}
        initialFormuleId={selectedFormuleId}
        initialNationalite={initialNationalite}
        initialPieces={selectedPieces}
      />

      {/* Modale Moniteur Virtuel IA (Gemini) */}
      <GeminiAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpenInscription={() => {
          setIsAssistantOpen(false);
          setIsInscriptionOpen(true);
        }}
      />

      {/* Modale Espace Direction / Administration */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default App;
