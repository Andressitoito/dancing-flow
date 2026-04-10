import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, Play, Pause, Save, Trash2, X, Info, FilePlus, Copy } from 'lucide-react';
import { APP_COLORS } from '../services/constants';
import PlaybackControls from './PlaybackControls';

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
    setPlaybackMode
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

  // Playback Logic
  useEffect(() => {
    if (isPlaying) {
      const beatInterval = (60 / bpm) * 1000;
      playbackInterval.current = setInterval(() => {
        setActiveSlot((prev) => {
          const totalSlots = currentChoreo.measures * 8;
          const next = prev + 1;
          return next >= totalSlots ? 0 : next;
        });
      }, beatInterval);
    } else {
      clearInterval(playbackInterval.current);
      // Optional: setActiveSlot(-1); // Reset highlight when stopping
    }
    return () => {
      if (playbackInterval.current) clearInterval(playbackInterval.current);
    };
  }, [isPlaying, bpm, currentChoreo.measures]); // Removed setActiveSlot from deps to prevent potential re-triggers if it's not stable

  // Handle Centered Scroll Mode
  useEffect(() => {
    if (isPlaying && playbackMode === 'centered' && activeSlot >= 0) {
      const slotElement = document.getElementById(`slot-${activeSlot}`);
      if (slotElement && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollLeft = slotElement.offsetLeft - container.offsetWidth / 2 + slotElement.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeSlot, isPlaying, playbackMode]);

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
    const totalSlots = currentChoreo.measures * 8;
    const slots = [];

    for (let i = 0; i < totalSlots; i++) {
      const item = getStepAtSlot(i);
      const step = item ? steps.find(s => s.id === item.stepId) : null;
      const isStart = item && item.slotIndex === i;
      const isEnd = item && item.slotIndex + step.duration - 1 === i;
      const isActive = activeSlot === i;

      // Grouping visual (1-4, 5-8)
      const isGroupEnd = (i + 1) % 4 === 0 && (i + 1) % 8 !== 0;
      const isMeasureEnd = (i + 1) % 8 === 0;

      slots.push(
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
            ${playbackMode === 'centered' && isPlaying ? 'w-16' : ''}
            ${isGroupEnd ? 'border-r-zinc-600 mr-1' : ''}
            ${isMeasureEnd ? 'border-r-zinc-400 mr-2' : ''}
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
    }
    return slots;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden" onClick={() => setShowTooltip(null)}>
      {/* Header & Library */}
      <div className="p-4 space-y-4 bg-zinc-950/50 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <input
            value={currentChoreo.title}
            onChange={(e) => updateChoreoTitle(e.target.value)}
            className="flex-1 bg-transparent border-b border-zinc-700 text-xl font-bold text-white focus:outline-none focus:border-primary"
          />
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => {
                if (window.confirm('¿Confirmas que deseas sobreescribir la coreografía actual?')) {
                  saveCurrentChoreo(false);
                }
              }}
              className="p-2 text-secondary hover:bg-secondary/10 rounded-full"
              title="Guardar"
            >
              <Save size={20} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Deseas guardar una copia nueva de esta coreografía?')) {
                  saveCurrentChoreo(true);
                }
              }}
              className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-full"
              title="Guardar como nuevo"
            >
              <Copy size={20} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Quieres empezar una coreografía nueva? Se perderán los cambios no guardados.')) {
                  resetChoreo();
                }
              }}
              className="p-2 text-zinc-500 hover:bg-zinc-500/10 rounded-full"
              title="Nueva Coreografía"
            >
              <FilePlus size={20} />
            </button>
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

      {/* Main Grid Area */}
      <div
        ref={scrollContainerRef}
        onClick={() => {
          setSelectedChoreoSlot(null);
          setShowTooltip(null);
        }}
        className={`flex-1 p-4 overflow-auto scroll-smooth ${playbackMode === 'centered' && isPlaying ? 'flex items-center' : ''}`}
      >
        <div className={`
          ${playbackMode === 'centered' && isPlaying ? 'flex flex-nowrap' : 'grid grid-cols-8 gap-y-4'}
          w-full max-w-lg mx-auto
        `}>
          {renderGrid()}

          <div className="col-span-8 flex justify-center mt-6">
            <button
              onClick={addMeasure}
              className="px-6 py-2 bg-zinc-800 text-zinc-400 rounded-full flex items-center gap-2 hover:bg-zinc-700 transition-colors"
            >
              <Plus size={18} />
              <span>Añadir Compás</span>
            </button>
          </div>
        </div>
      </div>

      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        bpm={bpm}
        onBpmChange={setBpm}
        playbackMode={playbackMode}
        onToggleMode={() => setPlaybackMode(playbackMode === 'scroll' ? 'centered' : 'scroll')}
      />

      {/* Choreo List */}
      <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 shrink-0 pb-10">
        <div className="pt-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Mis Coreografías</h3>
          <div className="flex gap-2 overflow-visible pb-4 pt-2 scrollbar-hide">
            {choreos.map(choreo => (
              <button
                key={choreo.id}
                onClick={() => loadChoreo(choreo)}
                className={`
                  shrink-0 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold transition-all
                  ${currentChoreo.id === choreo.id ? 'border-primary text-primary' : 'text-zinc-400'}
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
