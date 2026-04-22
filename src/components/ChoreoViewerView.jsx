import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Play, Pause, ChevronRight, X, Trash2, Heart, Star, Search } from 'lucide-react';
import PlaybackControls from './PlaybackControls';
import Swal from 'sweetalert2';

const ViewerGrid = ({ choreo, steps, activeSlot, onStepDoubleClick, playbackMode, zoom = 1 }) => {
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
  const gridItems = [];
  const measures = [];

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
            relative aspect-square border border-outline/40 flex items-center justify-center transition-all shrink-0
            ${isActive ? 'z-40 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'z-10'}
            ${!data && isActive ? 'bg-white' : ''}
            ${!data && !isActive ? 'bg-surface' : ''}
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
               <span className="truncate text-white font-bold text-[8px] drop-shadow-md uppercase">
                 {data.step.name}
               </span>
             </div>
          )}
          {!data && (
            <span className={isActive ? 'text-black text-[12px] font-black' : 'text-zinc-400 text-[10px] font-black'}>
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
        className="flex transition-all gap-0.5 relative shrink-0 p-2 bg-surface/40 rounded-xl border border-outline/50 mx-4"
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
    deleteChoreo,
    likeChoreo,
    favoriteChoreo
  } = useStore();
  const [selectedChoreo, setSelectedChoreo] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const activeStep = (activeSlot >= 0 && selectedChoreo) ? (() => {
    const item = selectedChoreo.sequence.find(it => {
      const step = steps.find(s => s.id === it.stepId);
      if (!step) return false;
      return activeSlot >= it.slotIndex && activeSlot < it.slotIndex + step.duration;
    });
    return item ? steps.find(s => s.id === item.stepId) : null;
  })() : null;

  const filteredChoreos = (choreos || [])
    .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
       const aFav = a.favorites?.includes(user?.id) ? 1 : 0;
       const bFav = b.favorites?.includes(user?.id) ? 1 : 0;
       if (aFav !== bFav) return bFav - aFav;
       return (b.likes?.length || 0) - (a.likes?.length || 0);
    });

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
      <div className="p-4 space-y-6 pb-24">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Mis Coreografías</h2>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar coreos..."
            className="w-full bg-surface border border-outline rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredChoreos.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 italic">
            No se encontraron coreografías.
          </div>
        ) : (
          <div className="grid gap-2">
            {filteredChoreos.map(choreo => {
              const isLiked = choreo.likes?.includes(user?.id);
              const isFavorited = choreo.favorites?.includes(user?.id);

              return (
                <div key={choreo.id} className="relative group">
                  <button
                    onClick={() => {
                       setSelectedChoreo(choreo);
                       loadChoreo(choreo);
                    }}
                    className="w-full bg-surface py-2.5 px-4 rounded-xl border border-outline flex items-center justify-between hover:border-primary/50 transition-all active:scale-[0.98]"
                  >
                    <div className="text-left flex-1 truncate">
                      <h4 className="font-bold text-sm truncate uppercase tracking-tight">{choreo.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">
                        Por <span className="text-primary">{choreo.creatorName || 'Andresito'}</span> • {choreo.measures}c
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                       <div className="flex gap-1.5">
                          {isLiked && <Heart size={12} className="text-primary" fill="currentColor" />}
                          {isFavorited && <Star size={12} className="text-secondary" fill="currentColor" />}
                       </div>
                       <ChevronRight size={18} className="text-zinc-600" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isSelectedLiked = selectedChoreo.likes?.includes(user?.id);
  const isSelectedFavorited = selectedChoreo.favorites?.includes(user?.id);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-outline bg-surface backdrop-blur-md">
        <button
          onClick={() => { setSelectedChoreo(null); stopPlayback(); }}
          className="p-2 -ml-2 text-zinc-400 hover:text-white"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold truncate leading-tight uppercase tracking-tight">{selectedChoreo.title}</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Autor: <span className="text-primary">{selectedChoreo.creatorName || 'Andresito'}</span>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => likeChoreo(selectedChoreo.id)}
            className={`p-2 rounded-full transition-all ${isSelectedLiked ? 'text-primary scale-110' : 'text-zinc-600'}`}
          >
            <Heart size={20} fill={isSelectedLiked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => favoriteChoreo(selectedChoreo.id)}
            className={`p-2 rounded-full transition-all ${isSelectedFavorited ? 'text-secondary scale-110' : 'text-zinc-600'}`}
          >
            <Star size={20} fill={isSelectedFavorited ? "currentColor" : "none"} />
          </button>
          {(user?.id === selectedChoreo.userId || user?.role === 'master' || user?.role === 'moderator') && (
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: '¿Eliminar Coreografía?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#e11d48',
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
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Secuencia</h3>
           <span className="text-[9px] text-zinc-600 uppercase font-bold">Doble tap para ayuda</span>
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
           <div className="flex flex-col gap-2 mt-4 bg-surface p-4 rounded-xl border border-outline">
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

      {activeStep && isPlaying && (
        <div className="fixed bottom-48 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-surface/95 backdrop-blur-md border border-primary/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4 border-b-4 border-b-primary/30">
            <div className="w-4 h-4 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: activeStep.color }} />
            <div className="flex-1 overflow-hidden">
              <span className="block text-primary/80 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Paso Actual</span>
              <span className="block text-white font-bold text-lg truncate leading-none uppercase">{activeStep.name}</span>
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
