import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, Play, Pause, Save, Trash2, X, Info, FilePlus, Copy } from 'lucide-react';
import { APP_COLORS } from '../services/constants';
import PlaybackControls from './PlaybackControls';
import Swal from 'sweetalert2';

const EditorView = () => {
  const {
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
  const [showTooltip, setShowTooltip] = useState(null); // { slotIndex, description }
  const [selectedChoreoSlot, setSelectedChoreoSlot] = useState(null); // For showing X and tooltip
  const longPressTimer = useRef(null);
  const playbackInterval = useRef(null);
  const scrollContainerRef = useRef(null);

  // Ensure we stop playing if we were playing and switch to Editor
  useEffect(() => {
    setIsPlaying(false);
  }, []);

  const handleSlotClick = (index) => {
    if (selectedStepId) {
      addStepToChoreo(selectedStepId, index);
    }
  };

  const handleLongPress = (e, index) => {
    e.preventDefault();
    // Clear any previous selection first to ensure fresh state
    setSelectedChoreoSlot(null);
    setShowTooltip(null);

    longPressTimer.current = setTimeout(() => {
      setSelectedChoreoSlot(index);
      // Tooltips are now disabled in Editor mode as per user request
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
        <div key={`measure-${m}`} className="relative mb-10">
          <div className="grid grid-cols-8 gap-0 shadow-xl border border-zinc-800/50 rounded-lg overflow-hidden">
            {measureSlots}
          </div>
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: '¿Eliminar compás?',
                text: "Se borrarán los pasos de este compás.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Eliminar',
                background: '#18181b', color: '#fff'
              });
              if (result.isConfirmed) removeMeasure(m);
            }}
            className="absolute -right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-2 z-20 shadow-2xl active:scale-125 transition-all border-2 border-zinc-950"
          >
            <X size={16} strokeWidth={3} />
          </button>
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-bold uppercase -rotate-90">
            C{m+1}
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

      // Grouping visual (1-4, 5-8)
      const isGroupEnd = (i + 1) % 4 === 0 && (i + 1) % 8 !== 0;
      const isMeasureEnd = (i + 1) % 8 === 0;

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
            relative aspect-square border-zinc-800 border flex items-center justify-center text-[10px] font-bold transition-all shrink-0
            ${isGroupEnd ? 'border-r-zinc-600 mr-1' : ''}
            ${isActive ? 'ring-2 ring-primary z-10 scale-105 bg-primary/20' : 'bg-zinc-900/50'}
            ${!step ? 'hover:bg-zinc-800' : ''}
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
          {!step && <span className="text-zinc-700">{(i % 8) + 1}</span>}
          {isStart && (
            <div className="absolute inset-0 flex items-center justify-center p-1 overflow-hidden pointer-events-none">
              <span className="truncate text-white drop-shadow-md leading-none">{step.name}</span>
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

          {showTooltip?.slotIndex === i && selectedChoreoSlot === i && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-zinc-800 text-white text-[10px] rounded shadow-xl z-50 pointer-events-none">
              {showTooltip.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"></div>
            </div>
          )}
        </div>
      );
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col" onClick={() => setShowTooltip(null)}>
      {/* Header & Library */}
      <div className="sticky top-0 p-2 space-y-3 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 z-50 shadow-lg">
        <div className="flex flex-col gap-2 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <input
              value={currentChoreo.title}
              onChange={(e) => updateChoreoTitle(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-b border-zinc-700 py-1 text-sm font-black text-white focus:outline-none focus:border-primary truncate"
              placeholder="Mi Coreo..."
            />
            <div className="flex shrink-0 gap-0.5 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 shadow-inner">
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
                className="p-1.5 text-primary hover:bg-zinc-800 rounded transition-colors"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: '¿Guardar?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#fbbf24',
                    confirmButtonText: 'Sí',
                    background: '#18181b', color: '#fff'
                  });
                  if (result.isConfirmed) {
                    await saveCurrentChoreo(false);
                  }
                }}
                className="p-1.5 text-secondary hover:bg-zinc-800 rounded transition-colors"
              >
                <Save size={14} />
              </button>
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: '¿Copiar?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'Sí',
                    background: '#18181b', color: '#fff'
                  });
                  if (result.isConfirmed) {
                    await saveCurrentChoreo(true);
                  }
                }}
                className="p-1.5 text-emerald-500 hover:bg-zinc-800 rounded transition-colors"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>

        {isQuickAddOpen ? (
          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Nuevo Paso Rápido</span>
              <button onClick={() => setIsQuickAddOpen(false)}><X size={14} /></button>
            </div>
            <input
              placeholder="Nombre del paso"
              className="w-full bg-zinc-800 text-xs p-2 rounded border border-zinc-700"
              value={quickStep.name}
              onChange={e => setQuickStep({...quickStep, name: e.target.value})}
            />
            <div className="flex gap-2">
              {[1, 2, 4].map(d => (
                <button
                  key={d}
                  onClick={() => setQuickStep({...quickStep, duration: d})}
                  className={`flex-1 py-1 rounded text-[10px] font-bold ${quickStep.duration === d ? 'bg-primary' : 'bg-zinc-800'}`}
                >
                  {d}T
                </button>
              ))}
            </div>
            <div className="flex justify-between gap-1">
              {APP_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setQuickStep({...quickStep, color: c})}
                  className={`w-6 h-6 rounded-full border ${quickStep.color === c ? 'border-white' : 'border-transparent'}`}
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
              className="w-full bg-primary py-2 rounded text-xs font-bold"
            >
              Añadir a Librería
            </button>
          </div>
        ) : (
        <div className="overflow-visible">
            <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Librería Rápida</h3>
          <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide">
              {steps.map(step => (
                <button
                  key={step.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStepId(selectedStepId === step.id ? null : step.id);
                  }}
                  className={`
                    shrink-0 h-14 w-14 rounded-xl flex flex-col items-center justify-center transition-all border-2 relative
                    ${selectedStepId === step.id ? 'border-white scale-[1.25] shadow-2xl z-20 mx-2' : 'border-transparent opacity-80'}
                  `}
                  style={{ backgroundColor: step.color }}
                >
                  <span className="text-[10px] font-black text-white leading-none mb-1">{step.duration}T</span>
                  <span className="text-[8px] font-bold text-white text-center leading-tight px-1 line-clamp-2">{step.name}</span>
                </button>
              ))}
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="shrink-0 h-14 w-14 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-600"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Flow Area - All scrolling together */}
      <div
        onClick={() => {
          setSelectedChoreoSlot(null);
          setShowTooltip(null);
        }}
        className="flex-1 overflow-y-auto p-4 space-y-12"
      >
        <div className="w-full max-w-lg mx-auto">
          {renderGrid()}

          <div className="flex justify-center mt-4">
            <button
              onClick={addMeasure}
              className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-3xl flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
            >
              <Plus size={24} />
              <span className="font-black uppercase tracking-wider text-sm">Añadir Compás</span>
            </button>
          </div>
        </div>

        {/* Choreo List - Now part of the flow */}
        <div className="w-full max-w-lg mx-auto pb-32 border-t border-zinc-800/50 pt-8">
          <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2">Mis Coreografías</h3>
          <div className="flex flex-wrap gap-2 px-2">
            {choreos.map(choreo => (
              <button
                key={choreo.id}
                onClick={() => loadChoreo(choreo)}
                className={`
                  px-4 py-3 rounded-xl border font-bold text-sm transition-all active:scale-95
                  ${currentChoreo.id === choreo.id
                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'}
                `}
              >
                {choreo.title}
              </button>
            ))}
            {choreos.length === 0 && (
              <p className="text-zinc-700 italic text-sm px-2">No hay coreos guardadas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorView;
