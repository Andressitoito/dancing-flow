import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  Play, Pause, SkipBack, Search, Heart, Star,
  ChevronRight, ArrowLeft, Clock, Info, User,
  AlignJustify, LayoutGrid, Zap, Filter, Edit3,
  Copy
} from 'lucide-react';
import Swal from 'sweetalert2';

const ChoreoViewerView = ({ onTabChange }) => {
  const {
    choreos, user, loadChoreo, currentChoreo, resetChoreo,
    activeSlot, setActiveSlot, isPlaying, startPlayback, pausePlayback, stopPlayback,
    likeChoreo, favoriteChoreo
  } = useStore();

  const [view, setView] = useState('explorer'); // explorer, player
  const [bpm, setBpm] = useState(120);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [displayMode, setDisplayMode] = useState('linear'); // linear, grid
  const [tooltip, setTooltip] = useState(null); // { block, x, y }

  const scrollContainerRef = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    if (view === 'player' && displayMode === 'linear' && activeSlot !== -1 && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`[data-slot="${activeSlot}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [activeSlot, view, displayMode]);

  const filteredChoreos = choreos.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleOpenChoreo = (choreo) => {
    loadChoreo(choreo);
    setView('player');
    stopPlayback();
  };

  const renderExplorer = () => (
    <div className="p-2 space-y-4">
      <div className="space-y-1 px-1">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Explorar</h2>
        <p className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Coreografías de la Comunidad</p>
      </div>

      <div className="flex gap-2 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            placeholder="Buscar..."
            className="w-full bg-surface/50 border border-outline/60 rounded-2xl py-2 pl-10 pr-4 text-sm focus:border-primary outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-surface/50 p-1 rounded-2xl border border-outline/60">
           {['all', 'principiante', 'intermedio', 'avanzado'].map(d => (
             <button
               key={d}
               onClick={() => setFilterDifficulty(d)}
               className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black uppercase transition-all ${
                 filterDifficulty === d ? 'bg-primary text-white' : 'text-zinc-500'
               }`}
             >
               {d === 'all' ? <Filter size={14} /> : d.charAt(0).toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      <div className="grid gap-2">
        {filteredChoreos.map(choreo => (
          <div
            key={choreo.id}
            onClick={() => handleOpenChoreo(choreo)}
            className="bg-surface/40 backdrop-blur-xl border border-outline/60 p-2 rounded-2xl flex items-center gap-3 group active:scale-95 transition-all"
          >
            <div
              className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white shadow-xl shrink-0"
              style={{ backgroundColor: choreo.color }}
            >
              <span className="text-sm font-black uppercase">{choreo.difficulty?.substring(0, 1)}</span>
              <Zap size={14} className="mt-0.5 opacity-60" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm text-white truncate uppercase tracking-tight">{choreo.title}</h4>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-tighter truncate">
                Por {choreo.creatorName || 'Usuario'} • {choreo.measures} Comp.
              </p>
              <div className="flex gap-3 mt-1">
                 <span className="flex items-center gap-1 text-sm font-black text-zinc-400">
                    <Heart size={10} className={choreo.likes?.includes(user?.id) ? 'text-primary fill-primary' : ''} />
                    {choreo.likes?.length || 0}
                 </span>
                 <span className="flex items-center gap-1 text-sm font-black text-zinc-400">
                    <Star size={10} className={choreo.favorites?.includes(user?.id) ? 'text-amber-500 fill-amber-500' : ''} />
                    {choreo.favorites?.length || 0}
                 </span>
              </div>
            </div>

            <ChevronRight className="text-zinc-700 group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );

  const handleLongPressStart = (e, block) => {
    if (!block || !block.description) return;

    // Get touch/mouse coordinates
    const touch = e.touches ? e.touches[0] : e;
    const { clientX, clientY } = touch;

    longPressTimer.current = setTimeout(() => {
      setTooltip({
        text: block.description,
        name: block.name,
        x: clientX,
        y: clientY
      });
      // Vibrate if mobile
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setTooltip(null);
  };

  const renderPlayer = () => {
    // Robust active block finding
    const activeBlock = (currentChoreo.sequence || []).find(b => {
      const s = parseInt(b.slotIndex);
      const d = parseInt(b.duration);
      const a = parseInt(activeSlot);
      return a >= s && a < s + d;
    });

    const currentMeasure = Math.max(0, Math.floor(activeSlot / 8));
    const measureSlots = Array.from({ length: 8 }, (_, i) => currentMeasure * 8 + i);

    return (
      <div className="flex flex-col min-h-screen bg-black/20 backdrop-blur-sm pb-32">
        {/* Header */}
        <div className="p-2 pt-4 flex items-center justify-between">
          <button
            onClick={() => { setView('explorer'); stopPlayback(); }}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="text-center flex-1 truncate px-2">
            <h2 className="text-lg font-black uppercase tracking-tight text-white truncate">{currentChoreo.title}</h2>
            <p className="text-sm font-black uppercase tracking-widest mt-0.5">
              <span className="text-rose-500">AUTOR:</span> <span className="text-white opacity-80">{currentChoreo.creatorName || 'DESCONOCIDO'}</span>
            </p>
          </div>
          <div className="flex gap-2">
             <button
               onClick={() => {
                 api.saveChoreo({ ...currentChoreo, id: null, title: `${currentChoreo.title} (Copia)` }, user?.id, user?.username)
                    .then(() => Swal.fire({ title: 'Copiado', icon: 'success', timer: 1500, showConfirmButton: false, background: '#18181b', color: '#fff' }));
               }}
               className="text-white/70 hover:text-white transition-colors"
             >
               <Copy size={20} />
             </button>
             <button onClick={() => likeChoreo(currentChoreo.id)} className={currentChoreo.likes?.includes(user?.id) ? 'text-rose-500' : 'text-white/70 hover:text-white'}>
               <Heart size={20} fill={currentChoreo.likes?.includes(user?.id) ? 'currentColor' : 'none'} />
             </button>
             <button onClick={() => favoriteChoreo(currentChoreo.id)} className={currentChoreo.favorites?.includes(user?.id) ? 'text-amber-500' : 'text-white/70 hover:text-white'}>
               <Star size={20} fill={currentChoreo.favorites?.includes(user?.id) ? 'currentColor' : 'none'} />
             </button>
          </div>
        </div>

        {/* Visualizer (Grid 2x8) */}
        <div className="px-2 py-2 space-y-1">
          {/* Blocks Row */}
          <div className="flex gap-1.5">
            {[0, 4].map(startOffset => (
               <div key={startOffset} className="grid grid-cols-4 gap-1.5 flex-1">
                 {Array.from({ length: 4 }).map((_, i) => {
                   const slotIdx = measureSlots[startOffset + i];
                   const block = currentChoreo.sequence.find(b => b.slotIndex === slotIdx);
                   const isPart = currentChoreo.sequence.some(b => slotIdx > b.slotIndex && slotIdx < b.slotIndex + b.duration);
                   if (isPart) return null;

                   const isActive = activeSlot >= slotIdx && activeSlot < (block ? slotIdx + block.duration : slotIdx + 1);

                   return (
                     <div
                       key={slotIdx}
                       onMouseDown={(e) => handleLongPressStart(e, block)}
                       onMouseUp={handleLongPressEnd}
                       onMouseLeave={handleLongPressEnd}
                       onTouchStart={(e) => handleLongPressStart(e, block)}
                       onTouchEnd={handleLongPressEnd}
                       style={{
                         gridColumn: block ? `span ${Math.min(block.duration, 4 - i)}` : 'span 1',
                         backgroundColor: block ? block.color : 'rgba(255,255,255,0.06)'
                       }}
                       className={`
                         h-16 rounded-xl flex items-center justify-center transition-all duration-150 relative border
                         ${isActive ? 'border-primary shadow-[0_0_40px_rgba(225,29,72,0.4)] z-10' : 'border-white/5'}
                       `}
                     >
                       {block && (
                         <span className="text-sm font-black text-white uppercase truncate px-1 text-center drop-shadow-md leading-tight">
                           {block.name}
                         </span>
                       )}
                       {isActive && (
                         <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-xl" />
                       )}
                     </div>
                   );
                 })}
               </div>
            ))}
          </div>

          {/* Numbers Row */}
          <div className="flex gap-1.5">
            {[0, 4].map(startOffset => (
               <div key={startOffset} className="grid grid-cols-4 gap-1.5 flex-1">
                 {Array.from({ length: 4 }).map((_, i) => {
                   const slotIdx = measureSlots[startOffset + i];
                   const isActive = activeSlot === slotIdx;
                   return (
                     <div
                       key={slotIdx}
                       className={`h-10 flex items-center justify-center rounded-xl border transition-all duration-150
                         ${isActive ? 'bg-primary/40 border-primary shadow-[0_0_20px_rgba(225,29,72,0.3)]' : 'bg-white/5 border-white/5'}
                       `}
                     >
                       <span className={`text-sm font-black ${isActive ? 'text-white' : 'text-white/20'}`}>{(slotIdx % 8) + 1}</span>
                     </div>
                   );
                 })}
               </div>
            ))}
          </div>
        </div>

        {/* Detail Card */}
        <div className="flex-1 px-2 mb-2">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] p-4 space-y-4 shadow-2xl min-h-[200px] flex flex-col">
            {activeBlock ? (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-2xl shrink-0"
                    style={{ backgroundColor: activeBlock.color }}
                  >
                    {activeBlock.duration}T
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black uppercase text-white tracking-tight leading-none truncate">{activeBlock.name}</h3>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
                      {currentChoreo.difficulty || 'PRINCIPIANTE'} • BASE
                    </p>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2 text-rose-500">
                        <Info size={14} className="shrink-0" />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Líder</span>
                     </div>
                     <p className="text-sm text-white font-medium italic leading-relaxed opacity-95">
                       "{activeBlock.leadInstructions || 'Inicia con pie izquierdo hacia la izquierda (1), cierra (2), abre (3), tap con derecha (4).'}"
                     </p>
                  </div>

                  <div className="space-y-1">
                     <div className="flex items-center gap-2 text-amber-400">
                        <Info size={14} className="shrink-0" />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Follower</span>
                     </div>
                     <p className="text-sm text-white font-medium italic leading-relaxed opacity-95">
                       "{activeBlock.followerInstructions || 'Espejo: Inicia con pie derecho hacia su derecha, cierra, abre, tap con izquierda.'}"
                     </p>
                  </div>
                </div>
              </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-zinc-400 italic text-base text-center px-10 leading-relaxed">
                  Escucha el ritmo... El próximo paso aparecerá aquí.
               </div>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="fixed bottom-[72px] left-2 right-2 z-40">
           <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-3 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2">
                 <button
                   onClick={isPlaying ? pausePlayback : () => startPlayback(bpm)}
                   className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 active:scale-90 transition-all"
                 >
                   {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                 </button>
                 <button
                   onClick={stopPlayback}
                   className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black active:scale-90 transition-all shadow-lg"
                 >
                   <div className="w-3 h-3 bg-black rounded-sm" />
                 </button>
              </div>

              <div className="flex flex-col items-center flex-1 px-4 min-w-0">
                 <div className="flex items-center justify-between w-full mb-1 px-1">
                    <span className="text-sm font-black text-white uppercase tracking-widest">BPM: {bpm}</span>
                 </div>
                 <input
                   type="range" min="60" max="180" value={bpm}
                   onChange={(e) => setBpm(parseInt(e.target.value))}
                   className="w-full accent-rose-500 h-3 bg-white/10 rounded-full appearance-none cursor-pointer"
                 />
              </div>

              <button
                onClick={() => setDisplayMode(prev => prev === 'linear' ? 'grid' : 'linear')}
                className="bg-zinc-800/80 text-white/90 px-3 py-2 rounded-xl text-sm font-black uppercase tracking-[0.2em] border border-white/10 active:scale-95 transition-all shadow-xl whitespace-nowrap"
              >
                MODO
              </button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {view === 'explorer' ? renderExplorer() : renderPlayer()}

        {/* Tooltip Overlay */}
        {tooltip && (
          <div
            className="fixed z-[100] pointer-events-none animate-in fade-in zoom-in duration-150"
            style={{
              left: Math.min(tooltip.x, window.innerWidth - 180),
              top: tooltip.y - 100
            }}
          >
            <div className="bg-zinc-900 border border-white/20 p-4 rounded-2xl shadow-2xl max-w-[180px]">
              <p className="text-[10px] font-black text-primary uppercase mb-1">{tooltip.name}</p>
              <p className="text-xs text-white/90 leading-tight italic">"{tooltip.text}"</p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-r border-b border-white/20 rotate-45" />
            </div>
          </div>
        )}
    </div>
  );
};

export default ChoreoViewerView;
