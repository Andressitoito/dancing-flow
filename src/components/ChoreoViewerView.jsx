import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  Play, Pause, SkipBack, Search, Heart, Star,
  ChevronRight, ArrowLeft, Clock, Info, User,
  AlignJustify, LayoutGrid, Zap, Filter, Edit3,
  Copy
} from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from '../services/api';

const ChoreoViewerView = ({ onTabChange }) => {
  const {
    choreos, user, loadChoreo, currentChoreo,
    activeSlot, setActiveSlot, isPlaying, startPlayback, pausePlayback, stopPlayback,
    likeChoreo, favoriteChoreo
  } = useStore();

  const [view, setView] = useState('explorer'); // explorer, player
  const [bpm, setBpm] = useState(120);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [displayMode, setDisplayMode] = useState('linear'); // linear, grid
  const [tooltip, setTooltip] = useState(null);

  const scrollContainerRef = useRef(null);
  const longPressTimer = useRef(null);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (view === 'player' && displayMode === 'linear' && activeSlot !== -1 && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`[data-slot="${activeSlot}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
    setActiveSlot(-1);
  };

  const handleSlotInteraction = (slotIdx) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected: Set playback position
      setActiveSlot(slotIdx);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
    lastTapRef.current = now;
  };

  const renderLinearVisualizer = () => {
    const totalSlots = (currentChoreo.measures || 1) * 8;
    return (
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-6 px-4 scrollbar-hide snap-x"
      >
        {Array.from({ length: totalSlots }).map((_, slotIdx) => {
          const block = currentChoreo.sequence.find(b => b.slotIndex === slotIdx);
          const isPart = currentChoreo.sequence.some(b => slotIdx > b.slotIndex && slotIdx < b.slotIndex + b.duration);
          if (isPart) return null;

          const isActive = activeSlot >= slotIdx && activeSlot < (block ? slotIdx + block.duration : slotIdx + 1);

          return (
            <div
              key={slotIdx}
              data-slot={slotIdx}
              onClick={() => handleSlotInteraction(slotIdx)}
              style={{
                minWidth: block ? `${block.duration * 60}px` : '60px',
                backgroundColor: block ? block.color : 'rgba(255,255,255,0.06)'
              }}
              className={`snap-center h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 relative border shrink-0
                ${isActive ? 'border-primary shadow-[0_0_30px_rgba(225,29,72,0.3)] scale-105 z-10' : 'border-white/5'}
              `}
            >
              <span className={`text-[10px] font-black mb-1 ${isActive ? 'text-white' : 'text-white/20'}`}>{(slotIdx % 8) + 1}</span>
              {block && (
                <span className="text-[8px] font-black text-white uppercase px-1 text-center drop-shadow-md leading-tight truncate w-full">
                  {block.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderGridVisualizer = () => {
    const measures = [];
    for (let m = 0; m < currentChoreo.measures; m++) {
      measures.push(
        <div key={m} className="space-y-2 p-2 bg-white/5 rounded-3xl border border-white/5">
          <p className="text-[8px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Compás {m + 1}</p>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 8 }).map((_, s) => {
              const slotIdx = m * 8 + s;
              const block = currentChoreo.sequence.find(b => b.slotIndex === slotIdx);
              const isPart = currentChoreo.sequence.some(b => slotIdx > b.slotIndex && slotIdx < b.slotIndex + b.duration);
              if (isPart) return null;
              const isActive = activeSlot >= slotIdx && activeSlot < (block ? slotIdx + block.duration : slotIdx + 1);

              return (
                <div
                  key={slotIdx}
                  onClick={() => handleSlotInteraction(slotIdx)}
                  style={{
                    gridColumn: block ? `span ${block.duration}` : 'span 1',
                    backgroundColor: block ? block.color : 'rgba(255,255,255,0.06)'
                  }}
                  className={`h-10 rounded-lg flex items-center justify-center border transition-all ${isActive ? 'border-primary shadow-lg scale-105 z-10' : 'border-transparent'}`}
                >
                   {block ? (
                     <span className="text-[6px] font-black text-white truncate px-0.5">{block.name}</span>
                   ) : (
                     <span className="text-[8px] font-bold text-white/10">{s + 1}</span>
                   )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return <div className="space-y-4 px-4 overflow-y-auto max-h-[400px]">{measures}</div>;
  };

  const renderPlayer = () => {
    const activeBlock = (currentChoreo.sequence || []).find(b => {
      const s = parseInt(b.slotIndex);
      const d = parseInt(b.duration);
      const a = parseInt(activeSlot);
      return a >= s && a < s + d;
    });

    return (
      <div className="flex flex-col min-h-screen bg-black/20 backdrop-blur-sm pb-40">
        {/* Header */}
        <div className="p-6 pt-10 flex items-center justify-between">
          <button onClick={() => { setView('explorer'); stopPlayback(); }} className="p-2 text-white/70 hover:text-white"><ChevronRight size={28} className="rotate-180" /></button>
          <div className="text-center flex-1 truncate px-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-white truncate">{currentChoreo.title}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest mt-0.5"><span className="text-rose-500">AUTOR:</span> <span className="text-white opacity-80">{currentChoreo.creatorName || 'DESCONOCIDO'}</span></p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => likeChoreo(currentChoreo.id)} className={currentChoreo.likes?.includes(user?.id) ? 'text-rose-500' : 'text-white/70'}><Heart size={20} fill={currentChoreo.likes?.includes(user?.id) ? 'currentColor' : 'none'} /></button>
             <button onClick={() => favoriteChoreo(currentChoreo.id)} className={currentChoreo.favorites?.includes(user?.id) ? 'text-amber-500' : 'text-white/70'}><Star size={20} fill={currentChoreo.favorites?.includes(user?.id) ? 'currentColor' : 'none'} /></button>
          </div>
        </div>

        {/* Visualizer Area */}
        <div className="py-4">
           {displayMode === 'linear' ? renderLinearVisualizer() : renderGridVisualizer()}
        </div>

        {/* Detail Card */}
        <div className="flex-1 px-4 mb-4">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl min-h-[340px] flex flex-col">
            {activeBlock ? (
              <>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl shrink-0" style={{ backgroundColor: activeBlock.color }}>{activeBlock.duration}T</div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black uppercase text-white tracking-tight leading-none truncate">{activeBlock.name}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mt-2">Paso Activo</p>
                  </div>
                </div>
                <div className="space-y-8 flex-1">
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-rose-500"><Info size={14} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Líder</span></div>
                     <p className="text-sm text-white font-medium italic leading-relaxed opacity-95">"{activeBlock.leadInstructions || 'Sin instrucciones'}"</p>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-amber-400"><Info size={14} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Follower</span></div>
                     <p className="text-sm text-white font-medium italic leading-relaxed opacity-95">"{activeBlock.followerInstructions || 'Sin instrucciones'}"</p>
                  </div>
                </div>
              </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-zinc-400 italic text-base text-center px-10 leading-relaxed">
                  Doble toque en un tiempo para empezar desde ahí.
               </div>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="fixed bottom-24 left-4 right-4 z-40">
           <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full p-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                 <button onClick={isPlaying ? pausePlayback : () => startPlayback(bpm)} className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
                   {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" className="ml-1" />}
                 </button>
                 <button onClick={stopPlayback} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black active:scale-90 transition-all shadow-lg"><div className="w-3.5 h-3.5 bg-black rounded-sm" /></button>
              </div>
              <div className="flex flex-col items-center flex-1 px-8 min-w-0">
                 <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">BPM: {bpm}</span>
                 <input type="range" min="60" max="180" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="w-full accent-rose-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
              </div>
              <button onClick={() => setDisplayMode(prev => prev === 'linear' ? 'grid' : 'linear')} className="bg-zinc-800 text-white/90 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-white/10">
                {displayMode === 'linear' ? 'CUADRÍCULA' : 'LÍNEA'}
              </button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {view === 'explorer' ? (
        <div className="p-4 space-y-6">
          <div className="space-y-1"><h2 className="text-3xl font-black uppercase tracking-tighter text-white">Explorar</h2><p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Comunidad BachataFlow</p></div>
          <div className="flex gap-2">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input placeholder="Buscar..." className="w-full bg-surface/50 border border-outline rounded-2xl py-3 pl-10 pr-4 text-xs focus:border-primary outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
          </div>
          <div className="grid gap-3">
            {filteredChoreos.map(choreo => (
              <div key={choreo.id} onClick={() => handleOpenChoreo(choreo)} className="bg-surface/40 backdrop-blur-xl border border-outline p-4 rounded-3xl flex items-center gap-4 group active:scale-95 transition-all">
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl shrink-0" style={{ backgroundColor: choreo.color }}><span className="text-[10px] font-black uppercase">{choreo.difficulty?.substring(0, 3)}</span><Zap size={14} className="mt-0.5 opacity-60" /></div>
                <div className="flex-1 min-w-0"><h4 className="font-black text-sm text-white truncate uppercase tracking-tight">{choreo.title}</h4><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate mt-0.5">Por {choreo.creatorName || 'Usuario'}</p></div>
                <ChevronRight className="text-zinc-700" />
              </div>
            ))}
          </div>
        </div>
      ) : renderPlayer()}
    </div>
  );
};

export default ChoreoViewerView;
