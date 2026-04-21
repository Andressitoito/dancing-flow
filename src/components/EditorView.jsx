import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, Play, Pause, Save, Trash2, X, Info, FilePlus, Copy } from 'lucide-react';
import { APP_COLORS } from '../services/constants';
import PlaybackControls from './PlaybackControls';
import Swal from 'sweetalert2';

const EditorView = () => {
  const {
    user,
    steps,
    addStep,
    currentChoreo,
    choreos,
    addStepToChoreo,
    removeStepFromChoreo,
    addMeasure,
    saveCurrentChoreo,
    updateChoreoTitle,
    loadChoreo,
    resetChoreo,
    activeSlot,
    setActiveSlot,
    isPlaying,
    setIsPlaying,
    playbackMode,
    setPlaybackMode,
    removeMeasure
  } = useStore();

  const [selectedStepId, setSelectedStepId] = useState(null);
  const [bpm, setBpm] = useState(120);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickStep, setQuickStep] = useState({ name: '', duration: 1, color: APP_COLORS[0] });
  const [showTooltip, setShowTooltip] = useState(null);
  const [selectedChoreoSlot, setSelectedChoreoSlot] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const longPressTimer = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
  }, []);

  const handleSlotClick = (index) => {
    const isOwner = currentChoreo.userId === user?.id || !currentChoreo.id;
    const isPrivileged = user?.role === 'master' || user?.role === 'moderator';

    if (!isOwner && !isPrivileged && currentChoreo.id) {
       Swal.fire({
         title: 'Solo Lectura',
         text: 'No puedes editar la coreografía de otro usuario.',
         icon: 'info',
         background: '#18181b', color: '#fff'
       });
       return;
    }

    if (selectedStepId) {
      addStepToChoreo(selectedStepId, index);
    }
  };

  const handleLongPress = (e, index) => {
    e.preventDefault();
    setSelectedChoreoSlot(null);
    setShowTooltip(null);

    longPressTimer.current = setTimeout(() => {
      setSelectedChoreoSlot(index);
    }, 800);
  };

  const clearLongPress = () => {
    clearTimeout(longPressTimer.current);
  };

  const getStepAtSlot = (index) => {
    return currentChoreo.sequence.find(item => {
      const step = steps.find(s => s.id === item.stepId);
      if (!step) return false;
      return index >= item.slotIndex && index < item.slotIndex + step.duration;
    });
  };

  const renderGrid = () => {
    const measuresCount = currentChoreo.measures;
    const gridElements = [];

    for (let m = 0; m < measuresCount; m++) {
      const measureSlots = [];
      for (let i = 0; i < 8; i++) {
        const globalSlotIndex = m * 8 + i;
        measureSlots.push(renderSlot(globalSlotIndex));
      }

      gridElements.push(
        <div key={`measure-${m}`} className="relative mb-8 group">
          <div className={`grid grid-cols-8 gap-0 shadow-xl border border-outline/60/50 rounded-lg overflow-hidden transition-all duration-300 ${isDeleteMode ? 'scale-[0.98] opacity-60 grayscale-[0.5]' : ''}`}>
            {measureSlots}
          </div>

          {isDeleteMode && (
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: `¿Eliminar Compás ${m+1}?`,
                  text: "Se borrarán los pasos de este compás y los siguientes se desplazarán.",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#ef4444',
                  confirmButtonText: 'Eliminar',
                  background: '#18181b', color: '#fff'
                });
                if (result.isConfirmed) removeMeasure(m);
              }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 backdrop-blur-[1px] rounded-lg border-2 border-dashed border-primary animate-in fade-in zoom-in duration-200"
            >
              <div className="bg-primary text-white p-3 rounded-full shadow-2xl">
                <Trash2 size={24} strokeWidth={3} />
              </div>
            </button>
          )}

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-black uppercase -rotate-90 tracking-tighter">
            COMPÁS {m+1}
          </div>
        </div>
      );
    }
    return gridElements;
  };

  const renderSlot = (i) => {
      const item = getStepAtSlot(i);
      const step = item ? steps.find(s => s.id === item.stepId) : null;
      const isStart = item && item.slotIndex === i;
      const isEnd = item && item.slotIndex + step.duration - 1 === i;
      const isActive = activeSlot === i;

      const isGroupEnd = (i + 1) % 4 === 0 && (i + 1) % 8 !== 0;

      return (
        <div
          key={i}
          id={`slot-${i}`}
          onClick={() => {
            handleSlotClick(i);
            setSelectedChoreoSlot(null);
          }}
          onMouseDown={(e) => handleLongPress(e, i)}
          onMouseUp={clearLongPress}
          onMouseLeave={clearLongPress}
          onTouchStart={(e) => handleLongPress(e, i)}
          onTouchEnd={clearLongPress}
          className={`
            relative aspect-square border-outline/60 border flex items-center justify-center text-[10px] font-bold transition-all shrink-0
            ${isGroupEnd ? 'border-r-zinc-600 mr-1' : ''}
            ${isActive ? 'ring-2 ring-primary z-10 scale-105 bg-primary/20' : 'bg-surface'}
            ${!step ? 'hover:bg-surface' : ''}
          `}
          style={{
            backgroundColor: step ? step.color : undefined,
            borderTopLeftRadius: isStart ? '8px' : '0',
            borderBottomLeftRadius: isStart ? '8px' : '0',
            borderTopRightRadius: isEnd ? '8px' : '0',
            borderBottomRightRadius: isEnd ? '8px' : '0',
            opacity: step && !isStart && !isEnd ? 0.9 : 1,
            marginLeft: isStart && i % 8 !== 0 && i % 4 !== 0 ? '2px' : '0',
          }}
        >
          {!step && <span className="text-zinc-400 font-black">{(i % 8) + 1}</span>}
          {isStart && (
            <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden pointer-events-none">
              <span className="truncate text-white drop-shadow-md leading-none uppercase text-[8px]">{step.name}</span>
            </div>
          )}
          {isStart && selectedChoreoSlot === i && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeStepFromChoreo(i);
                setSelectedChoreoSlot(null);
              }}
              className="absolute -top-1 -right-1 bg-primary rounded-full p-1 text-white shadow-lg z-20"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      );
  };

  return (
    <div className="bg-background min-h-screen flex flex-col" onClick={() => setShowTooltip(null)}>
      <div className="sticky top-0 p-3 space-y-4 bg-background/95 backdrop-blur-md border-b border-outline/60 z-50 shadow-lg">
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <input
              value={currentChoreo.title}
              onChange={(e) => updateChoreoTitle(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-b border-outline/60/60 py-1 text-2xl font-black text-white focus:outline-none focus:border-primary truncate uppercase tracking-tight"
              placeholder="Mi Coreo..."
            />
            <div className="flex shrink-0 gap-1 bg-surface rounded-xl p-1 border border-outline/60 shadow-inner">
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: '¿Nueva?',
                    text: "Se perderán cambios.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e11d48',
                    confirmButtonText: 'Sí',
                    background: '#18181b', color: '#fff'
                  });
                  if (result.isConfirmed) resetChoreo();
                }}
                className="p-2 text-primary hover:bg-surface rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={async () => {
                  const isOwner = currentChoreo.userId === user?.id || !currentChoreo.id;
                  const isPrivileged = user?.role === 'master' || user?.role === 'moderator';

                  if (!isOwner && !isPrivileged && currentChoreo.id) {
                    Swal.fire({ title: 'Acceso Denegado', text: 'No tienes permiso.', icon: 'error', background: '#18181b', color: '#fff' });
                    return;
                  }

                  const result = await Swal.fire({
                    title: '¿Guardar?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#fbbf24',
                    background: '#18181b', color: '#fff'
                  });
                  if (result.isConfirmed) {
                    try {
                      await saveCurrentChoreo(false);
                      Swal.fire({ title: 'Guardado', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#18181b', color: '#fff' });
                    } catch (e) {
                      Swal.fire({ title: 'Error', text: e.message, icon: 'error', background: '#18181b', color: '#fff' });
                    }
                  }
                }}
                className="p-2 text-secondary hover:bg-surface rounded-lg transition-colors"
              >
                <Save size={20} />
              </button>
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: '¿Copiar?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#10b981',
                    background: '#18181b', color: '#fff'
                  });
                  if (result.isConfirmed) {
                    await saveCurrentChoreo(true);
                  }
                }}
                className="p-2 text-accent hover:bg-surface rounded-lg transition-colors"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>

        {isQuickAddOpen ? (
          <div className="bg-surface p-4 rounded-xl border border-outline/60 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 font-black uppercase tracking-widest">Nuevo Paso Rápido</span>
              <button onClick={() => setIsQuickAddOpen(false)} className="text-zinc-400 font-black"><X size={16} /></button>
            </div>
            <input
              placeholder="Nombre del paso"
              className="w-full bg-surface text-sm p-3 rounded-xl border border-outline/60/60 outline-none focus:border-primary"
              value={quickStep.name}
              onChange={e => setQuickStep({...quickStep, name: e.target.value})}
            />
            <div className="flex gap-2">
              {[1, 2, 4].map(d => (
                <button
                  key={d}
                  onClick={() => setQuickStep({...quickStep, duration: d})}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${quickStep.duration === d ? 'bg-primary shadow-lg' : 'bg-surface text-zinc-400 font-black'}`}
                >
                  {d} TIEMPOS
                </button>
              ))}
            </div>
            <div className="flex justify-between gap-1 pt-2">
              {APP_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setQuickStep({...quickStep, color: c})}
                  className={`w-7 h-7 rounded-full border-2 ${quickStep.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              onClick={async () => {
                if (quickStep.name) {
                  await addStep(quickStep);
                  setIsQuickAddOpen(false);
                  setQuickStep({ name: '', duration: 1, color: APP_COLORS[0] });
                }
              }}
              className="w-full bg-primary py-3 rounded-xl text-xs font-black uppercase tracking-widest mt-2 shadow-lg shadow-primary/20"
            >
              Añadir a Librería
            </button>
          </div>
        ) : (
        <div className="overflow-visible">
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-[10px] font-black text-zinc-400 font-black uppercase tracking-widest">Librería Rápida</h3>
            {selectedStepId && (
              <button
                onClick={() => setSelectedStepId(null)}
                className="text-[10px] font-black text-primary uppercase"
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 pt-1 scrollbar-hide px-1">
              {(steps || []).filter(s => s.userId === user?.id || s.userId === 'andresito').map(step => (
                <button
                  key={step.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStepId(selectedStepId === step.id ? null : step.id);
                  }}
                  className={`
                    shrink-0 h-14 w-14 rounded-xl flex flex-col items-center justify-center transition-all border-2 relative
                    ${selectedStepId === step.id ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-20 mx-1' : 'border-transparent opacity-90'}
                  `}
                  style={{ backgroundColor: step.color }}
                >
                  <span className="text-[10px] font-black text-white leading-none mb-1">{step.duration}T</span>
                  <span className="text-[8px] font-black text-white text-center leading-tight px-1 line-clamp-2 uppercase">{step.name}</span>
                </button>
              ))}
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="shrink-0 h-14 w-14 rounded-xl border-2 border-dashed border-outline/60 flex items-center justify-center text-zinc-600 hover:text-primary transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {selectedStepId && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: steps.find(s => s.id === selectedStepId)?.color }}
                  />
                  <span className="text-xs font-black text-white uppercase tracking-tight">
                    {steps.find(s => s.id === selectedStepId)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        onClick={() => setSelectedChoreoSlot(null)}
        className="flex-1 overflow-y-auto p-4 space-y-12"
      >
        <div className="w-full max-w-lg mx-auto">
          {renderGrid()}

          <div className="flex flex-col gap-3 max-w-xs mx-auto mt-8">
            <button
              onClick={addMeasure}
              disabled={isDeleteMode}
              className={`py-4 bg-surface border border-outline/60 text-zinc-300 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${isDeleteMode ? 'opacity-50 grayscale' : 'hover:bg-surface'}`}
            >
              <Plus size={20} />
              <span className="font-black uppercase tracking-widest text-[10px]">Añadir Compás</span>
            </button>

            <button
              onClick={() => setIsDeleteMode(!isDeleteMode)}
              className={`py-3 rounded-2xl flex items-center justify-center gap-3 transition-all border font-black uppercase tracking-widest text-[10px] ${
                isDeleteMode
                ? 'bg-primary border-primary/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-surface border-outline/60 text-zinc-400 font-black'
              }`}
            >
              <Trash2 size={16} />
              <span>{isDeleteMode ? 'Finalizar Edición' : 'Gestionar Compases'}</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto pb-32 border-t border-outline/60/50 pt-8">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2">Mis Coreografías</h3>
          <div className="flex flex-wrap gap-2 px-2">
            {(choreos || []).map(choreo => (
              <button
                key={choreo.id}
                onClick={() => loadChoreo(choreo)}
                className={`
                  px-4 py-2.5 rounded-xl border font-black text-[10px] tracking-widest uppercase transition-all active:scale-95
                  ${currentChoreo.id === choreo.id
                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                    : 'bg-surface border-outline/60 text-zinc-400 font-black'}
                `}
              >
                {choreo.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorView;
