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
    likeChoreo, favoriteChoreo, copyChoreo
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
    <div className="p-1 space-y-1.5">
      <div className="space-y-0 px-1">
        <h2 className="text-lg font-black uppercase tracking-tighter text-white">Explorar</h2>
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Coreografías de la Comunidad</p>
      </div>

      <div className="flex gap-1.5 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input
            placeholder="Buscar..."
            className="w-full bg-surface/50 border border-outline/60 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:border-primary outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-surface/50 p-1 rounded-xl border border-outline/60">
           {['all', 'principiante', 'intermedio', 'avanzado'].map(d => (
             <button
               key={d}
               onClick={() => setFilterDifficulty(d)}
               className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black uppercase transition-all ${
                 filterDifficulty === d ? 'bg-primary text-white' : 'text-zinc-500'
               }`}
             >
               {d === 'all' ? <Filter size={12} /> : d.charAt(0).toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      <div className="grid gap-1">
        {filteredChoreos.map(choreo => (
          <div
            key={choreo.id}
            onClick={() => handleOpenChoreo(choreo)}
            className="bg-surface/40 backdrop-blur-xl border border-outline/60 p-1 rounded-xl flex items-center gap-2 group active:scale-95 transition-all"
          >
            <div
              className="w-9 h-9 rounded-lg flex flex-col items-center justify-center text-white shadow-xl shrink-0"
              style={{ backgroundColor: choreo.color }}
            >
              <span className="text-[10px] font-black uppercase">{choreo.difficulty?.substring(0, 1)}</span>
              <Zap size={10} className="mt-0 opacity-60" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-black text-xs text-white truncate uppercase tracking-tight">{choreo.title}</h4>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate">
                Por {choreo.creatorName || 'Usuario'} • {choreo.measures} Comp.
              </p>
              <div className="flex gap-2 mt-0.5">
                 <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400">
                    <Heart size={8} className={choreo.likes?.includes(user?.id) ? 'text-primary fill-primary' : ''} />
                    {choreo.likes?.length || 0}
                 </span>
                 <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400">
                    <Star size={8} className={choreo.favorites?.includes(user?.id) ? 'text-amber-500 fill-amber-500' : ''} />
                    {choreo.favorites?.length || 0}
                 </span>
              </div>
            </div>

            <ChevronRight className="text-zinc-700 group-hover:text-primary transition-colors mr-1" size={16} />
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
      <div className="flex flex-col min-h-screen bg-surface/40 backdrop-blur-xl pb-32">
        {/* Header */}
        <div className="p-1 flex items-center justify-between border-b border-outline/60 bg-black/20">
          <button
            onClick={() => { setView('explorer'); stopPlayback(); }}
            className="p-1 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <div className="text-center flex-1 truncate px-1">
            <h2 className="text-lg font-black uppercase tracking-tight text-white truncate leading-none">{currentChoreo.title}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest mt-0.5">
              <span className="text-rose-500">AUTOR:</span> <span className="text-white opacity-80">{currentChoreo.creatorName || 'DESCONOCIDO'}</span>
            </p>
          </div>
          <div className="flex gap-1">
             <button
               onClick={async () => {
                 try {
                   await copyChoreo(currentChoreo);
                   Swal.fire({
                     title: 'Copiado',
                     text: 'La coreografía ha sido copiada',
                     icon: 'success',
                     timer: 1500,
                     showConfirmButton: false,
                     background: '#18181b',
                     color: '#fff'
                   });
                 } catch (e) {
                   Swal.fire({ title: 'Error', text: e.message, icon: 'error', background: '#18181b', color: '#fff' });
                 }
               }}
               className="text-white/70 hover:text-white transition-colors p-1"
             >
               <Copy size={18} />
             </button>
             <button onClick={() => likeChoreo(currentChoreo.id)} className={`transition-all p-1 ${currentChoreo.likes?.includes(user?.id) ? 'text-rose-500 scale-110' : 'text-white/70'}`}>
               <Heart size={18} fill={currentChoreo.likes?.includes(user?.id) ? 'currentColor' : 'none'} />
             </button>
             <button onClick={() => favoriteChoreo(currentChoreo.id)} className={`transition-all p-1 ${currentChoreo.favorites?.includes(user?.id) ? 'text-amber-500 scale-110' : 'text-white/70'}`}>
               <Star size={18} fill={currentChoreo.favorites?.includes(user?.id) ? 'currentColor' : 'none'} />
             </button>
          </div>
        </div>

        {/* Visualizer (Grid 2x8) */}
        <div className="px-1 py-1 space-y-0.5">
          {/* Blocks Row */}
          <div className="flex gap-0.5">
            {[0, 4].map(startOffset => (
               <div key={startOffset} className="grid grid-cols-4 gap-0.5 flex-1">
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
                         backgroundColor: block ? block.color : 'rgba(255,255,255,0.04)'
                       }}
                       className={`
                         h-10 rounded-lg flex items-center justify-center transition-all duration-150 relative border
                         ${isActive ? 'border-primary shadow-[0_0_20px_rgba(225,29,72,0.4)] z-10' : 'border-white/5'}
                       `}
                     >
                       {block && (
                         <span className="text-[10px] font-black text-white uppercase truncate px-1 text-center drop-shadow-md leading-tight">
                           {block.name}
                         </span>
                       )}
                       {isActive && (
                         <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-lg" />
                       )}
                     </div>
                   );
                 })}
               </div>
            ))}
          </div>

          {/* Numbers Row */}
          <div className="flex gap-0.5">
            {[0, 4].map(startOffset => (
               <div key={startOffset} className="grid grid-cols-4 gap-0.5 flex-1">
                 {Array.from({ length: 4 }).map((_, i) => {
                   const slotIdx = measureSlots[startOffset + i];
                   const isActive = activeSlot === slotIdx;
                   return (
                     <div
                       key={slotIdx}
                       className={`h-6 flex items-center justify-center rounded-lg border transition-all duration-150
                         ${isActive ? 'bg-primary/40 border-primary shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'bg-white/5 border-white/5'}
                       `}
                     >
                       <span className={`text-[10px] font-black ${isActive ? 'text-white' : 'text-white/20'}`}>{(slotIdx % 8) + 1}</span>
                     </div>
                   );
                 })}
               </div>
            ))}
          </div>
        </div>

        {/* Detail Card */}
        <div className="flex-1 px-1 mb-1">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-2 space-y-1.5 shadow-2xl min-h-[140px] flex flex-col">
            {activeBlock ? (
              <>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-2xl shrink-0"
                    style={{ backgroundColor: activeBlock.color }}
                  >
                    {activeBlock.duration}T
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-black uppercase text-white tracking-tight leading-none truncate">{activeBlock.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                      {currentChoreo.difficulty || 'PRINCIPIANTE'} • BASE
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 overflow-y-auto">
                  <div className="space-y-0">
                     <div className="flex items-center gap-1.5 text-rose-500">
                        <Info size={10} className="shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Líder</span>
                     </div>
                     <p className="text-sm text-white font-medium italic leading-snug opacity-95">
                       "{activeBlock.leadInstructions || 'Paso básico'}"
                     </p>
                  </div>

                  <div className="space-y-0">
                     <div className="flex items-center gap-1.5 text-amber-400">
                        <Info size={10} className="shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Follower</span>
                     </div>
                     <p className="text-sm text-white font-medium italic leading-snug opacity-95">
                       "{activeBlock.followerInstructions || 'Paso básico espejo'}"
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
        <div className="fixed bottom-[72px] left-1 right-1 z-40">
           <div className="bg-black/90 backdrop-blur-3xl border border-white/10 rounded-xl p-2 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-1">
                 <button
                   onClick={isPlaying ? pausePlayback : () => startPlayback(bpm)}
                   className="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 active:scale-90 transition-all"
                 >
                   {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                 </button>
                 <button
                   onClick={stopPlayback}
                   className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black active:scale-90 transition-all shadow-lg"
                 >
                   <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                 </button>
              </div>

              <div className="flex flex-col items-center flex-1 px-2 min-w-0">
                 <div className="flex items-center justify-between w-full mb-0.5 px-1">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">BPM: {bpm}</span>
                 </div>
                 <input
                   type="range" min="60" max="180" value={bpm}
                   onChange={(e) => setBpm(parseInt(e.target.value))}
                   className="w-full accent-rose-500 h-3 bg-white/10 rounded-full appearance-none cursor-pointer"
                 />
              </div>

              <button
                onClick={() => setDisplayMode(prev => prev === 'linear' ? 'grid' : 'linear')}
                className="bg-zinc-800/80 text-white/90 px-1.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 active:scale-95 transition-all shadow-xl whitespace-nowrap"
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
