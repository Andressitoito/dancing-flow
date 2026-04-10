import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Play, Pause, ChevronRight, X } from 'lucide-react';
import PlaybackControls from './PlaybackControls';

const ViewerGrid = ({ choreo, steps, activeSlot, onStepDoubleClick }) => {
  const totalSlots = (choreo.measures || 2) * 8;
  const gridItems = [];

  // Helper to find step starting at or spanning across a slot
  const getStepData = (index) => {
    const item = choreo.sequence.find(item => {
      const step = steps.find(s => s.id === item.stepId);
      if (!step) return false;
      return index >= item.slotIndex && index < item.slotIndex + step.duration;
    });
    if (!item) return null;
    return { item, step: steps.find(s => s.id === item.stepId) };
  };

  for (let i = 0; i < totalSlots; i++) {
    const data = getStepData(i);
    const isActive = activeSlot === i;
    const isStart = data && data.item.slotIndex === i;

    if (data) {
      // Render as individual squares but keeping the name and look requested
      const step = data.step;
      const isItemStart = data.item.slotIndex === i;
      const isItemEnd = data.item.slotIndex + step.duration - 1 === i;

      gridItems.push(
        <div
          key={`step-slot-${i}`}
          onDoubleClick={() => onStepDoubleClick(step)}
          className={`
            relative aspect-square border border-zinc-800/30 flex items-center justify-center transition-all cursor-help
            ${isActive ? 'ring-2 ring-white z-30 scale-105' : 'z-10'}
          `}
          style={{
            backgroundColor: step.color,
            borderTopLeftRadius: isItemStart ? '8px' : '0',
            borderBottomLeftRadius: isItemStart ? '8px' : '0',
            borderTopRightRadius: isItemEnd ? '8px' : '0',
            borderBottomRightRadius: isItemEnd ? '8px' : '0',
            opacity: isActive ? 1 : 0.9
          }}
        >
          {isItemStart && (
             <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden pointer-events-none z-20">
               <span className="truncate text-white font-bold text-[8px] drop-shadow-md">
                 {step.name}
               </span>
             </div>
          )}
          {isActive && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </div>
      );
    } else {
      // Empty slot with beat number
      gridItems.push(
        <div
          key={`slot-${i}`}
          className={`
            aspect-square border border-zinc-800/30 flex items-center justify-center transition-all
            ${isActive ? 'bg-primary/40 ring-2 ring-primary z-20 scale-105' : 'bg-zinc-900/20'}
          `}
        >
          <span className="text-zinc-800 text-[10px] font-medium">{(i % 8) + 1}</span>
        </div>
      );
    }
  }

  return (
    <div className="grid grid-cols-8 gap-1 p-2 bg-zinc-950/40 rounded-xl border border-zinc-800/50 shadow-inner">
      {gridItems}
    </div>
  );
};

const ChoreoViewerView = () => {
  const { choreos, steps } = useStore();
  const [selectedChoreo, setSelectedChoreo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlot, setActiveSlot] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [helpStep, setHelpStep] = useState(null);
  const playbackInterval = useRef(null);

  useEffect(() => {
    if (isPlaying && selectedChoreo) {
      const beatInterval = (60 / bpm) * 1000;
      playbackInterval.current = setInterval(() => {
        setActiveSlot((prev) => {
          const next = prev + 1;
          const totalSlots = (selectedChoreo.measures || 2) * 8;
          return next >= totalSlots ? 0 : next;
        });
      }, beatInterval);
    } else {
      clearInterval(playbackInterval.current);
      if (!isPlaying) setActiveSlot(-1);
    }
    return () => clearInterval(playbackInterval.current);
  }, [isPlaying, bpm, selectedChoreo]);

  if (!selectedChoreo) {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold">Mis Coreografías</h2>
        {choreos.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 italic">
            Aún no has creado ninguna coreografía.
          </div>
        ) : (
          <div className="grid gap-3">
            {choreos.map(choreo => (
              <button
                key={choreo.id}
                onClick={() => setSelectedChoreo(choreo)}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-primary transition-all group"
              >
                <div className="text-left">
                  <h4 className="font-bold text-lg">{choreo.title}</h4>
                  <p className="text-xs text-zinc-500 font-medium">
                    {choreo.measures} compases • {choreo.sequence.length} pasos
                  </p>
                </div>
                <div className="text-zinc-600 group-hover:text-primary transition-colors">
                  <ChevronRight size={24} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800 bg-zinc-950/50">
        <button
          onClick={() => { setSelectedChoreo(null); setIsPlaying(false); }}
          className="p-2 -ml-2 text-zinc-400 hover:text-white"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <h2 className="flex-1 text-xl font-bold truncate">{selectedChoreo.title}</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Secuencia</h3>
           <span className="text-[10px] text-zinc-600 italic">Doble tap para ayuda</span>
        </div>
        <ViewerGrid
          choreo={selectedChoreo}
          steps={steps}
          activeSlot={activeSlot}
          onStepDoubleClick={setHelpStep}
        />

        <div className="bg-zinc-900 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-zinc-400 uppercase text-xs">Información</h4>
            <span className="text-xs font-bold text-primary">MODO SOLO LECTURA</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <span className="block text-[10px] text-zinc-500 uppercase font-bold">Compases</span>
              <span className="text-lg font-bold">{selectedChoreo.measures}</span>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-lg">
              <span className="block text-[10px] text-zinc-500 uppercase font-bold">BPM Sugerido</span>
              <span className="text-lg font-bold">120</span>
            </div>
          </div>
        </div>
      </div>

      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        bpm={bpm}
        onBpmChange={setBpm}
        showModeToggle={false}
      />

      {/* Help Modal */}
      {helpStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setHelpStep(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={24} />
            </button>
            <div
              className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: helpStep.color }}
            >
              {helpStep.duration}T
            </div>
            <h3 className="text-2xl font-black mb-2">{helpStep.name}</h3>
            <p className="text-zinc-400 leading-relaxed italic">
              {helpStep.description || 'No hay descripción disponible para este paso.'}
            </p>
            <button
              onClick={() => setHelpStep(null)}
              className="w-full mt-8 bg-zinc-800 py-3 rounded-xl font-bold text-white hover:bg-zinc-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoreoViewerView;
