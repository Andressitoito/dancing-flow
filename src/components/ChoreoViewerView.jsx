import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Play, Pause, ChevronRight, X, Trash2 } from 'lucide-react';
import PlaybackControls from './PlaybackControls';
import Swal from 'sweetalert2';

const ViewerGrid = ({ choreo, steps, activeSlot, onStepDoubleClick, playbackMode, zoom = 1 }) => {
  // Helper to find step starting at or spanning across a slot
  const getStepData = (index) => {
    const item = choreo.sequence.find(it => {
      const step = steps.find(s => s.id === it.stepId);
      if (!step) return false;
      return index >= it.slotIndex && index < it.slotIndex + step.duration;
    });
    if (!item) return null;
    return { item, step: steps.find(s => s.id === item.stepId) };
  };

  const measuresCount = choreo.measures || 2;
  const gridItems = []; // For scroll/grid mode
  const measures = [];  // For centered/linear mode

  for (let m = 0; m < measuresCount; m++) {
    const measureSlots = [];
    for (let i = 0; i < 8; i++) {
      const globalIdx = m * 8 + i;
      const data = getStepData(globalIdx);
      const isActive = activeSlot === globalIdx;

      const slot = (
        <div
          key={`slot-comp-${globalIdx}`}
          id={`vslot-${globalIdx}`}
          onDoubleClick={data ? () => onStepDoubleClick(data.step) : undefined}
          className={`
            relative aspect-square border border-zinc-800/30 flex items-center justify-center transition-all shrink-0
            ${isActive ? 'z-40 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'z-10'}
            ${!data && isActive ? 'bg-white' : ''}
            ${!data && !isActive ? 'bg-surface/20' : ''}
            ${data ? 'cursor-help' : ''}
          `}
          style={{
            backgroundColor: data ? data.step.color : undefined,
            borderTopLeftRadius: data && data.item.slotIndex === globalIdx ? '8px' : '0',
            borderBottomLeftRadius: data && data.item.slotIndex === globalIdx ? '8px' : '0',
            borderTopRightRadius: data && data.item.slotIndex + data.step.duration - 1 === globalIdx ? '8px' : '0',
            borderBottomRightRadius: data && data.item.slotIndex + data.step.duration - 1 === globalIdx ? '8px' : '0',
            opacity: isActive ? 1 : 0.9,
            width: playbackMode === 'centered' ? `${64 * zoom}px` : 'auto'
          }}
        >
          {data && data.item.slotIndex === globalIdx && (
             <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden pointer-events-none z-20">
               <span className="truncate text-white font-bold text-[8px] drop-shadow-md">
                 {data.step.name}
               </span>
             </div>
          )}
          {!data && (
            <span className={isActive ? 'text-black text-[12px] font-black' : 'text-zinc-800 text-[10px] font-medium'}>
              {(globalIdx % 8) + 1}
            </span>
          )}
          {isActive && (
            <>
              <div className={`absolute inset-0 bg-white z-40 rounded opacity-70 ${data ? 'animate-pulse' : ''}`} />
              <div className="absolute inset-[-4px] border-[4px] border-white z-50 rounded-xl pointer-events-none shadow-[0_0_20px_white]" />
            </>
          )}
        </div>
      );
      measureSlots.push(slot);
      gridItems.push(slot);
    }

    measures.push(
      <div
        key={`measure-centered-${m}`}
        className="flex transition-all gap-0.5 relative shrink-0 p-2 bg-surface/40 rounded-xl border border-zinc-800/50 mx-4"
      >
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-zinc-400 uppercase tracking-tight">
          Compás {m + 1}
        </span>
        {measureSlots}
      </div>
    );
  }

  return (
    <div
      className={`
        ${playbackMode === 'centered' ? 'flex items-center overflow-x-auto scrollbar-hide py-12' : 'grid grid-cols-8 gap-1'}
        p-2 bg-background/20 rounded-2xl border border-zinc-900/50 shadow-inner scroll-smooth
      `}
      id="viewer-scroll-container"
    >
      {playbackMode === 'centered' ? measures : gridItems}
    </div>
  );
};

const ChoreoViewerView = () => {
  const {
    user,
    choreos,
    steps,
    playbackMode,
    setPlaybackMode,
    activeSlot,
    isPlaying,
    startPlayback,
    pausePlayback,
    stopPlayback,
    loadChoreo,
    deleteChoreo
  } = useStore();
  const [selectedChoreo, setSelectedChoreo] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [zoom, setZoom] = useState(1);

  const activeStep = (activeSlot >= 0 && selectedChoreo) ? (() => {
    const item = selectedChoreo.sequence.find(it => {
      const step = steps.find(s => s.id === it.stepId);
      if (!step) return false;
      return activeSlot >= it.slotIndex && activeSlot < it.slotIndex + step.duration;
    });
    return item ? steps.find(s => s.id === item.stepId) : null;
  })() : null;

  // Debug trace for playback state
  useEffect(() => {
    if (isPlaying) {
      console.log('Playback Active:', { activeSlot, activeStep: activeStep?.name });
    }
  }, [activeSlot, isPlaying, activeStep]);
  const scrollContainerRef = useRef(null);

  // Handle Centered Scroll Mode
  useEffect(() => {
    if (playbackMode === 'centered' && activeSlot >= 0) {
      const slotElement = document.getElementById(`vslot-${activeSlot}`);
      const container = document.getElementById('viewer-scroll-container');

      if (slotElement && container) {
        const containerRect = container.getBoundingClientRect();
        const slotRect = slotElement.getBoundingClientRect();
        const scrollLeft = container.scrollLeft + (slotRect.left - containerRect.left) - (containerRect.width / 2) + (slotRect.width / 2);

        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeSlot, playbackMode]);

  if (!selectedChoreo) {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold">Mis Coreografías</h2>
        {(!choreos || choreos.length === 0) ? (
          <div className="text-center py-20 text-zinc-500 italic">
            Aún no has creado ninguna coreografía.
          </div>
        ) : (
          <div className="grid gap-3">
            {(choreos || []).map(choreo => (
              <button
                key={choreo.id}
                onClick={() => {
                   setSelectedChoreo(choreo);
                   loadChoreo(choreo);
                }}
                className="bg-surface p-4 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-primary transition-all group"
              >
                <div className="text-left">
                  <h4 className="font-bold text-lg">{choreo.title}</h4>
                  <p className="text-xs text-zinc-500 font-medium">
                    Por <span className="text-primary font-bold">{choreo.creatorName || 'Andresito'}</span> • {choreo.measures} compases
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
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800 bg-background/50">
        <button
          onClick={() => { setSelectedChoreo(null); stopPlayback(); }}
          className="p-2 -ml-2 text-zinc-400 hover:text-white"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold truncate leading-tight">{selectedChoreo.title}</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Autor: <span className="text-primary">{selectedChoreo.creatorName || 'Andresito'}</span>
          </p>
        </div>

        {(user?.id === selectedChoreo.userId || user?.role === 'master' || user?.role === 'moderator') && (
          <button
            onClick={async () => {
               const result = await Swal.fire({
                 title: '¿Eliminar Coreografía?',
                 text: "Esta acción no se puede deshacer.",
                 icon: 'warning',
                 showCancelButton: true,
                 confirmButtonColor: '#e11d48',
                 confirmButtonText: 'Eliminar',
                 background: '#18181b', color: '#fff'
               });
               if (result.isConfirmed) {
                 await deleteChoreo(selectedChoreo.id);
                 setSelectedChoreo(null);
               }
            }}
            className="p-2 text-zinc-600 hover:text-primary transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
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
           <div className="flex flex-col gap-2 mt-4 bg-surface/50 p-4 rounded-xl border border-zinc-800">
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

      {/* Active Step Indicator - Floating above controls */}
      {activeStep && isPlaying && (
        <div className="fixed bottom-48 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-surface/95 backdrop-blur-md border border-primary/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 border-b-4 border-b-primary/30">
            <div className="w-4 h-4 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: activeStep.color }} />
            <div className="flex-1 overflow-hidden">
              <span className="block text-primary/80 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Paso Actual</span>
              <span className="block text-white font-bold text-lg truncate leading-none">{activeStep.name}</span>
            </div>
          </div>
        </div>
      )}

      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={() => isPlaying ? pausePlayback() : startPlayback(bpm)}
        onStop={stopPlayback}
        bpm={bpm}
        onBpmChange={(newBpm) => {
           setBpm(newBpm);
           if (isPlaying) {
             pausePlayback();
             startPlayback(newBpm);
           }
        }}
        playbackMode={playbackMode}
        onToggleMode={() => setPlaybackMode(playbackMode === 'scroll' ? 'centered' : 'scroll')}
        showModeToggle={true}
      />

    </div>
  );
};

export default ChoreoViewerView;
