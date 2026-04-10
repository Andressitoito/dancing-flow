import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Play, Pause, ChevronRight, X } from 'lucide-react';
import PlaybackControls from './PlaybackControls';
import Swal from 'sweetalert2';

const ViewerGrid = ({ choreo, steps, activeSlot, onStepDoubleClick, playbackMode, zoom = 1 }) => {
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
      // Render as individual squares
      const step = data.step;
      const isItemStart = data.item.slotIndex === i;
      const isItemEnd = data.item.slotIndex + step.duration - 1 === i;

      gridItems.push(
        <div
          key={`step-slot-${i}`}
          id={`vslot-${i}`}
          onDoubleClick={() => onStepDoubleClick(step)}
          className={`
            relative aspect-square border border-zinc-800/30 flex items-center justify-center transition-all cursor-help shrink-0
            ${isActive ? 'ring-[3px] ring-white z-40 scale-110 shadow-lg' : 'z-10'}
          `}
          style={{
            backgroundColor: step.color,
            borderTopLeftRadius: isItemStart ? '8px' : '0',
            borderBottomLeftRadius: isItemStart ? '8px' : '0',
            borderTopRightRadius: isItemEnd ? '8px' : '0',
            borderBottomRightRadius: isItemEnd ? '8px' : '0',
            opacity: isActive ? 1 : 0.9,
            width: playbackMode === 'centered' ? `${64 * zoom}px` : 'auto'
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
            <div className="absolute inset-0 bg-white/40 animate-pulse z-30" />
          )}
        </div>
      );
    } else {
      // Empty slot with beat number
      gridItems.push(
        <div
          key={`slot-${i}`}
          id={`vslot-${i}`}
          className={`
            aspect-square border border-zinc-800/30 flex items-center justify-center transition-all shrink-0
            ${isActive ? 'bg-primary/40 ring-2 ring-primary z-20 scale-105' : 'bg-zinc-900/20'}
          `}
          style={{
             width: playbackMode === 'centered' ? `${64 * zoom}px` : 'auto'
          }}
        >
          <span className="text-zinc-800 text-[10px] font-medium">{(i % 8) + 1}</span>
        </div>
      );
    }
  }

  return (
    <div className={`
      ${playbackMode === 'centered' ? 'flex overflow-x-auto scrollbar-hide py-10' : 'grid grid-cols-8 gap-1'}
      p-2 bg-zinc-950/40 rounded-xl border border-zinc-800/50 shadow-inner
    `}>
      {gridItems}
    </div>
  );
};

const ChoreoViewerView = () => {
  const {
    choreos,
    steps,
    playbackMode,
    setPlaybackMode,
    activeSlot,
    setActiveSlot,
    isPlaying,
    setIsPlaying
  } = useStore();
  const [selectedChoreo, setSelectedChoreo] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [zoom, setZoom] = useState(1);
  const playbackInterval = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isPlaying && selectedChoreo) {
      const beatInterval = (60 / bpm) * 1000;
      playbackInterval.current = setInterval(() => {
        setActiveSlot((prev) => {
          const totalSlots = (selectedChoreo.measures || 2) * 8;
          const next = prev + 1;
          return next >= totalSlots ? 0 : next;
        });
      }, beatInterval);
    } else {
      clearInterval(playbackInterval.current);
      if (!isPlaying) setActiveSlot(-1);
    }
    return () => clearInterval(playbackInterval.current);
  }, [isPlaying, bpm, selectedChoreo]);

  // Handle Centered Scroll Mode
  useEffect(() => {
    if (isPlaying && playbackMode === 'centered' && activeSlot >= 0) {
      const slotElement = document.getElementById(`vslot-${activeSlot}`);
      if (slotElement && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollLeft = slotElement.offsetLeft - container.offsetWidth / 2 + slotElement.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeSlot, isPlaying, playbackMode]);

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

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-4 space-y-6"
      >
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Secuencia</h3>
           <span className="text-[10px] text-zinc-600 italic">Doble tap para ayuda</span>
        </div>
        <ViewerGrid
          choreo={selectedChoreo}
          steps={steps}
          activeSlot={activeSlot}
          onStepDoubleClick={(step) => {
             Swal.fire({
               title: step.name,
               text: step.description || 'No hay descripción para este paso.',
               iconHtml: `<div class="w-12 h-12 rounded-lg" style="background-color: ${step.color}"></div>`,
               confirmButtonText: 'Entendido',
               confirmButtonColor: '#e11d48',
               background: '#18181b',
               color: '#fff',
               customClass: {
                 icon: 'border-none'
               }
             });
          }}
          playbackMode={playbackMode}
          zoom={zoom}
        />

        {playbackMode === 'centered' && (
           <div className="flex flex-col gap-2 mt-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
             <div className="flex justify-between items-center">
               <span className="text-[10px] text-zinc-500 font-bold uppercase">Zoom Modo Lineal</span>
               <span className="text-xs font-bold text-primary">{Math.round(zoom * 100)}%</span>
             </div>
             <input
               type="range" min="0.5" max="2" step="0.1" value={zoom}
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="w-full accent-primary h-1 bg-zinc-700 rounded-lg appearance-none"
             />
           </div>
        )}
      </div>

      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStop={() => { setIsPlaying(false); setActiveSlot(-1); }}
        bpm={bpm}
        onBpmChange={setBpm}
        playbackMode={playbackMode}
        onToggleMode={() => setPlaybackMode(playbackMode === 'scroll' ? 'centered' : 'scroll')}
        showModeToggle={true}
      />

    </div>
  );
};

export default ChoreoViewerView;
