import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Play, Pause, ChevronRight, X, Trash2, Heart, Star, Search, Copy, Info } from 'lucide-react';
import PlaybackControls from './PlaybackControls';
import Swal from 'sweetalert2';

const ViewerGrid = ({ choreo, steps, activeSlot, onSlotDoubleClick, playbackMode, zoom = 1 }) => {
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
      const isGroupEnd = (i + 1) % 4 === 0 && (i + 1) % 8 !== 0;

      const slot = (
        <div
          key={`slot-comp-${globalIdx}`}
          id={`vslot-${globalIdx}`}
          onDoubleClick={() => onSlotDoubleClick(globalIdx)}
          className={`
            relative aspect-square border border-outline/40 flex items-center justify-center transition-all shrink-0
            ${isGroupEnd ? 'mr-1.5 border-r-zinc-500/50' : ''}
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
        className="flex transition-all gap-0.5 relative shrink-0 p-1.5 bg-surface/40 rounded-xl border border-outline/50 mx-2"
      >
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-zinc-500 uppercase tracking-tight">
          Comp {m + 1}
        </span>
        {measureSlots}
      </div>
    );
  }

  return (
    <div
      className={`
        ${playbackMode === 'centered' ? 'flex items-center overflow-x-auto scrollbar-hide py-8' : 'grid grid-cols-8 gap-1'}
        p-1.5 bg-background/20 rounded-2xl border border-zinc-900/50 shadow-inner scroll-smooth
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
    setActiveSlot,
    isPlaying,
    startPlayback,
    pausePlayback,
    stopPlayback,
    loadChoreo,
    deleteChoreo,
    likeChoreo,
    favoriteChoreo,
    copyChoreo
  } = useStore();
  const [selectedChoreo, setSelectedChoreo] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'mine', 'favorites'

  const activeStep = (activeSlot >= 0 && selectedChoreo) ? (() => {
    const item = selectedChoreo.sequence.find(it => {
      const step = steps.find(s => s.id === it.stepId);
      if (!step) return false;
      return activeSlot >= it.slotIndex && activeSlot < it.slotIndex + step.duration;
    });
    return item ? steps.find(s => s.id === item.stepId) : null;
  })() : null;

  const filteredChoreos = (choreos || [])
    .filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const isMine = c.userId === user?.id;
      const isFavorite = c.favorites?.includes(user?.id);

      if (filterMode === 'mine') return matchesSearch && isMine;
      if (filterMode === 'favorites') return matchesSearch && isFavorite;
      return matchesSearch && (isMine || c.isPublic);
    })
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
      <div className="p-4 space-y-5 pb-24 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white drop-shadow-md">Explorar</h2>
          <div className="flex bg-surface/60 p-1 rounded-xl border border-outline/40">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'mine', label: 'Mías' },
              { id: 'favorites', label: 'Favs' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setFilterMode(m.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterMode === m.id ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder={`Buscar en ${filterMode === 'all' ? 'todas' : filterMode === 'mine' ? 'mis coreos' : 'favoritos'}...`}
            className="w-full bg-surface/40 backdrop-blur-md border border-outline/60 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-primary transition-all placeholder:text-white/20 shadow-inner"
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
                    className="w-full bg-surface/40 backdrop-blur-md py-2.5 px-4 rounded-xl border border-outline/60 flex items-center justify-between hover:border-primary/50 transition-all active:scale-[0.98]"
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
            onClick={async () => {
              const res = await Swal.fire({
                title: '¿Copiar Coreografía?',
                text: 'Se guardará una copia privada en tu lista.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#fbbf24',
                background: '#18181b', color: '#fff'
              });
              if (res.isConfirmed) {
                await copyChoreo(selectedChoreo);
                Swal.fire({ title: 'Copiado', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#18181b', color: '#fff' });
              }
            }}
            className="p-2 text-zinc-400 hover:text-white"
            title="Copiar a mis coreografías"
          >
            <Copy size={20} />
          </button>
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
        <ViewerGrid
          choreo={selectedChoreo}
          steps={steps}
          activeSlot={activeSlot}
          onSlotDoubleClick={(idx) => {
             setActiveSlot(idx);
          }}
          playbackMode={playbackMode}
          zoom={zoom}
        />

        {activeStep && (
          <div className="bg-surface/60 border border-outline/40 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 border-b border-outline/30 pb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg" style={{ backgroundColor: activeStep.color }}>
                {activeStep.duration}T
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1 truncate">{activeStep.name}</h4>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none truncate">{activeStep.difficulty} • {activeStep.category}</p>
              </div>
            </div>

            {activeStep.technical_details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                    <Info size={10} /> Líder
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed italic">"{activeStep.technical_details.lead || 'Sin detalles'}"</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-secondary uppercase tracking-widest flex items-center gap-1">
                    <Info size={10} /> Follower
                  </p>
                  <p className="text-sm text-zinc-300 leading-relaxed italic">"{activeStep.technical_details.follow || 'Sin detalles'}"</p>
                </div>
              </div>
            )}
          </div>
        )}

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
