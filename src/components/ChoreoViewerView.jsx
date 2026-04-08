import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Play, Pause, ChevronRight } from 'lucide-react';

const ViewerGrid = ({ choreo, steps, activeSlot }) => {
  const totalSlots = (choreo.measures || 2) * 8;
  const slots = [];

  const getStepAtSlot = (index) => {
    return choreo.sequence.find(item => {
      const step = steps.find(s => s.id === item.stepId);
      if (!step) return false;
      return index >= item.slotIndex && index < item.slotIndex + step.duration;
    });
  };

  for (let i = 0; i < totalSlots; i++) {
    const item = getStepAtSlot(i);
    const step = item ? steps.find(s => s.id === item.stepId) : null;
    const isStart = item && item.slotIndex === i;
    const isEnd = item && item.slotIndex + (step?.duration || 1) - 1 === i;
    const isActive = activeSlot === i;

    slots.push(
      <div
        key={i}
        className={`
          aspect-square border border-zinc-800/50 flex items-center justify-center text-[8px] transition-all
          ${isActive ? 'ring-2 ring-primary z-10 bg-primary/20 scale-105' : 'bg-zinc-900/30'}
        `}
        style={{
          backgroundColor: step ? step.color : undefined,
          borderTopLeftRadius: isStart ? '4px' : '0',
          borderBottomLeftRadius: isStart ? '4px' : '0',
          borderTopRightRadius: isEnd ? '4px' : '0',
          borderBottomRightRadius: isEnd ? '4px' : '0',
        }}
      >
        {isStart && <span className="text-white font-bold truncate px-0.5 pointer-events-none drop-shadow-md">{step.name}</span>}
        {!step && <span className="text-zinc-800">{(i % 8) + 1}</span>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-8 gap-1 p-2 bg-zinc-950/30 rounded-lg">
      {slots}
    </div>
  );
};

const ChoreoViewerView = () => {
  const { choreos, steps } = useStore();
  const [selectedChoreo, setSelectedChoreo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSlot, setActiveSlot] = useState(-1);
  const [bpm, setBpm] = useState(120);
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
        <ViewerGrid choreo={selectedChoreo} steps={steps} activeSlot={activeSlot} />

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

      <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex items-center gap-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
            isPlaying ? 'bg-secondary text-black' : 'bg-primary text-white'
          }`}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
        </button>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Ajustar BPM</span>
            <span className="text-xs font-black text-secondary">{bpm}</span>
          </div>
          <input
            type="range" min="60" max="180" value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ChoreoViewerView;
