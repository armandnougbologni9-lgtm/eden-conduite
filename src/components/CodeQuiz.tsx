import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sparkles } from 'lucide-react';
import { EDEN_QUIZ_QUESTIONS } from '../data/edenData';

interface CodeQuizProps {
  onStartRegistration: () => void;
}

export const CodeQuiz: React.FC<CodeQuizProps> = ({ onStartRegistration }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = EDEN_QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < EDEN_QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <section id="quiz" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Test d'Entraînement Gratuit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Testez vos réflexes au Code de la Route Béninois
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            6 questions types inspirées de l'examen officiel de l'ANaTT. Vérifiez vos connaissances avant de vous lancer !
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-slate-800/90 rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-2xl">
          {!quizFinished ? (
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 text-xs">
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 font-bold px-3 py-1 rounded-full">
                  {currentQ.category}
                </span>
                <span className="text-slate-400 font-mono font-semibold">
                  Question {currentIndex + 1} / {EDEN_QUIZ_QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / EDEN_QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold font-heading mt-6 leading-relaxed">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="mt-6 space-y-3">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-700/60 border-slate-600 hover:border-slate-500 text-slate-200";
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/30";
                    } else {
                      btnStyle = "bg-slate-800/50 border-slate-700 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-medium cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-xs flex items-center justify-center font-bold text-slate-300">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswered && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-700/80 border border-slate-600 text-xs sm:text-sm text-slate-300 animate-in fade-in duration-200">
                  <div className="font-bold text-orange-400 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    Explication de l'instructeur :
                  </div>
                  <p>{currentQ.explication}</p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="mt-6 text-right">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    <span>{currentIndex + 1 < EDEN_QUIZ_QUESTIONS.length ? 'Question suivante' : 'Voir mes résultats'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Results */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-500 text-orange-400 mx-auto flex items-center justify-center mb-4">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-orange-400">
                Résultat de votre test
              </span>
              <h3 className="text-3xl font-extrabold font-heading mt-1">
                Score : {score} / {EDEN_QUIZ_QUESTIONS.length}
              </h3>

              <p className="mt-3 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {score >= 5
                  ? "🎉 Félicitations ! Vous avez d'excellents réflexes. Rejoignez notre session de coaching pour officialiser votre réussite à l'ANaTT !"
                  : score >= 3
                  ? "👍 Bon début ! Avec les cours théoriques en salle climatisée d'EDEN CONDUITE, vous maîtriserez toutes les subtilités du code."
                  : "💪 Ne vous découragez pas ! Le code de la route s'apprend pas à pas. Nos moniteurs certifiés sont réputés pour leur pédagogie bienveillante."}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-600 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer le test</span>
                </button>

                <button
                  onClick={onStartRegistration}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <span>S'inscrire chez EDEN CONDUITE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
