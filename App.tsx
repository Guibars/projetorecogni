import React, { useState, useRef, useEffect } from 'react';
import { ParticleField } from './components/ParticleField';
import { PortfolioGrid } from './components/PortfolioGrid';
import { InfoModal } from './components/InfoModal';
import { HandData, ContentCardData } from './types';

type AppState = 'idle' | 'gathering' | 'reveal';

const App: React.FC = () => {
  const [hands, setHands] = useState<HandData[]>([]);
  const [selectedCard, setSelectedCard] = useState<ContentCardData | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const closingRef = useRef<number>(0);
  const gestureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHandUpdate = (newHands: HandData[]) => {
    setHands(newHands);
  };

  // --- Secret Gesture Detection (4 fingers + 2 fingers) ---
  useEffect(() => {
    if (hands.length === 2 && appState === 'idle') {
      const h1 = hands[0].extendedFingers;
      const h2 = hands[1].extendedFingers;

      const isSecretGesture = (h1 === 4 && h2 === 2) || (h1 === 2 && h2 === 4);

      if (isSecretGesture) {
        if (!gestureTimerRef.current) {
          // Debounce slightly to ensure intent
          gestureTimerRef.current = setTimeout(() => {
            setAppState('gathering');
          }, 500);
        }
      } else {
        if (gestureTimerRef.current) {
          clearTimeout(gestureTimerRef.current);
          gestureTimerRef.current = null;
        }
      }
    } else {
       if (gestureTimerRef.current) {
          clearTimeout(gestureTimerRef.current);
          gestureTimerRef.current = null;
        }
    }
  }, [hands, appState]);

  // --- Animation State Machine ---
  useEffect(() => {
    if (appState === 'gathering') {
      // Phase 1: Gathering Energy (Duration 2.5s)
      const t1 = setTimeout(() => {
        setAppState('reveal');
      }, 2500);

      return () => clearTimeout(t1);
    } 
    
    if (appState === 'reveal') {
      // Phase 2: Show Text, then Reset after 4s
      const t2 = setTimeout(() => {
        setAppState('idle');
      }, 5000);
      return () => clearTimeout(t2);
    }
  }, [appState]);

  // --- Standard Interaction Logic ---
  useEffect(() => {
    if (selectedCard && hands.length > 0 && appState === 'idle') {
      const hand = hands[0];
      // Close with Pinch (Gesture Consistency: Pinch is for manipulation/closing, Fist is for Opening)
      if (hand.isGripping) {
        closingRef.current += 0.05;
        if (closingRef.current >= 1.5) {
          setSelectedCard(null);
          closingRef.current = 0;
        }
      } else {
        closingRef.current = 0;
      }
    }
  }, [hands, selectedCard, appState]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#004B8D] to-[#0f172a] select-none font-sans text-white">
      
      {/* Background (handles Energy Ball visual) */}
      <ParticleField 
        onHandUpdate={handleHandUpdate} 
        isGathering={appState === 'gathering'}
      />

      {/* Main UI - Fades out during event */}
      <div 
        className={`relative z-10 flex flex-col h-full transition-opacity duration-1000 ${
          appState !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Header Glass */}
        <header className="px-8 py-4 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10 mx-4 mt-4 rounded-3xl shadow-lg">
          <div className="flex items-center gap-4">
            {/* Fotus Logo SVG Reconstruction */}
            <div className="flex items-center gap-2">
                <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="30" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="32" fill="#004B8D" letterSpacing="-1">FOTUS</text>
                    {/* The yellow sun element */}
                    <circle cx="125" cy="18" r="8" fill="#FBBF24" />
                </svg>
            </div>
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest hidden sm:block">
              Novos Produtos<br/>1º Modelo RA | Realidade Aumentada
            </p>
          </div>

          {/* Gesture Guide */}
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-blue-200 bg-black/20 px-4 py-2 rounded-full border border-white/5">
             <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">👌</span> 
                <span>PINÇA = MOVER</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-red-400 text-lg">👊</span> 
                <span>SOCO = ABRIR</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">✌</span> 
                <span>2 DEDOS = DESCER</span>
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden relative">
          <PortfolioGrid 
            hands={hands} 
            selectedCardId={selectedCard?.id || null}
            onSelect={setSelectedCard} 
          />
        </main>

        {/* Modal */}
        {selectedCard && (
          <InfoModal 
            card={selectedCard} 
            hands={hands}
            onClose={() => setSelectedCard(null)} 
          />
        )}
      </div>

      {/* --- REVEAL OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
            appState === 'reveal' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <div className="text-center relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-[100px] rounded-full animate-pulse"></div>
            <h1 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 tracking-tighter drop-shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-bounce-slow">
                Esse é só <br/> o começo!
            </h1>
        </div>
      </div>

      {/* Closing Feedback */}
      {selectedCard && closingRef.current > 0.1 && appState === 'idle' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none">
            <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white/10 animate-spin-slow"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-yellow-400 transition-all duration-100"
                  style={{ clipPath: `circle(${closingRef.current * 30}% at 50% 50%)` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-yellow-400 tracking-widest text-xs">
                    FECHANDO
                </div>
            </div>
        </div>
      )}
      
      <div className="scanline opacity-30"></div>
    </div>
  );
};

export default App;