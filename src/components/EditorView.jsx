import React, { useState } from 'react';
import useStore from '../store/useStore';
import {
  Plus, Save, Trash2, ChevronRight, X, Play, Volume2, VolumeX, Music, Info
} from 'lucide-react';
import Swal from 'sweetalert2';

const BlockEditorModal = ({ block, onSave, onCancel }) => {
  const [edited, setEdited] = useState({
    name: block.name || '',
    description: block.description || '',
    leadInstructions: block.leadInstructions || '',
    followerInstructions: block.followerInstructions || '',
    color: block.color || '#e11d48'
  });

  const colors = [
    '#e11d48', // Rose
    '#fbbf24', // Amber
    '#8b5cf6', // Violet
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#f97316', // Orange
    '#64748b'  // Slate
  ];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black uppercase tracking-tight text-white">Editar Bloque</h3>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white"><X size={24} /></button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase">Nombre del Paso</label>
          <input
            value={edited.name}
            onChange={e => setEdited({...edited, name: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none"
            placeholder="Ej: Básico con giro"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase">Colores</label>
          <div className="flex gap-2 py-1 overflow-x-auto">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setEdited({...edited, color: c})}
                className={`w-8 h-8 rounded-full border-2 shrink-0 transition-transform ${edited.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase">Descripción / Adorno</label>
          <textarea
            value={edited.description}
            onChange={e => setEdited({...edited, description: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs h-16 resize-none outline-none"
            placeholder="¿Qué pasa en este tiempo?"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Instrucciones Líder</label>
            <textarea
              value={edited.leadInstructions}
              onChange={e => setEdited({...edited, leadInstructions: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] h-20 resize-none outline-none"
              placeholder="Guía para él..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Instrucciones Follower</label>
            <textarea
              value={edited.followerInstructions}
              onChange={e => setEdited({...edited, followerInstructions: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] h-20 resize-none outline-none"
              placeholder="Guía para ella..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => onSave(edited)}
        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
      >
        Guardar Bloque
      </button>
    </div>
  );
};

const QuickAddForm = ({ onAdd }) => {
  const [step, setStep] = useState({
    name: '',
    duration: 1,
    color: '#e11d48'
  });

  const colors = ['#e11d48', '#fbbf24', '#8b5cf6', '#10b981', '#3b82f6'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!step.name) return;
    onAdd(step);
    setStep({ ...step, name: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface/50 border border-outline/60 rounded-3xl p-4 space-y-4">
      <div className="flex gap-2">
        <input
          value={step.name}
          onChange={e => setStep({...step, name: e.target.value})}
          className="flex-1 bg-black/20 border border-outline/40 rounded-xl px-4 py-2 text-xs focus:border-primary outline-none"
          placeholder="Nuevo paso rápido..."
        />
        <button type="submit" className="bg-primary p-2 rounded-xl text-white">
          <Plus size={20} />
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {[1, 2, 4].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setStep({...step, duration: d})}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${step.duration === d ? 'bg-white text-black border-white' : 'border-outline/40 text-zinc-500'}`}
            >
              {d}T
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setStep({...step, color: c})}
              className={`w-5 h-5 rounded-full border ${step.color === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </form>
  );
};

const EditorView = () => {
  const {
    currentChoreo, updateChoreoTitle, updateChoreoDifficulty, addMeasure, removeMeasure,
    addBlockToChoreo, updateBlockInChoreo, removeBlockFromChoreo,
    saveCurrentChoreo, resetChoreo, choreos, loadChoreo, deleteChoreo,
    paintingDuration, setPaintingDuration, isMetronomeEnabled, setMetronomeEnabled,
    steps, addStep
  } = useStore();

  const [editingBlockSlot, setEditingBlockSlot] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleSlotClick = (slotIndex) => {
    if (!paintingDuration) {
       const block = currentChoreo.sequence.find(b => b.slotIndex === slotIndex);
       if (block) setEditingBlockSlot(slotIndex);
       return;
    }

    addBlockToChoreo({
      duration: paintingDuration,
      color: paintingDuration === 4 ? '#8b5cf6' : (paintingDuration === 2 ? '#fbbf24' : '#e11d48')
    }, slotIndex);
  };

  const handleLibraryStepClick = (step) => {
    // If a step is clicked from library, we set it as the "painting" block or place it if a slot was targeted?
    // Let's make it simpler: clicking a library step enters "painting mode" with that step's properties.
    setPaintingDuration(step.duration);
    // We could extend the store to support painting with a specific step object.
    // For now, let's just use the duration.
  };

  const renderGrid = () => {
    const rows = [];
    for (let m = 0; m < currentChoreo.measures; m++) {
      const slots = [];
      for (let s = 0; s < 8; s++) {
        const slotIndex = m * 8 + s;
        const block = currentChoreo.sequence.find(b => b.slotIndex === slotIndex);
        const isOccupiedByPrevious = currentChoreo.sequence.some(b =>
          slotIndex > b.slotIndex && slotIndex < b.slotIndex + b.duration
        );

        if (isOccupiedByPrevious) continue;

        slots.push(
          <div
            key={slotIndex}
            onClick={() => handleSlotClick(slotIndex)}
            onContextMenu={(e) => { e.preventDefault(); removeBlockFromChoreo(slotIndex); }}
            style={{ gridColumn: `span ${block ? block.duration : 1}` }}
            className={`
              relative h-16 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden
              ${block
                ? 'border-transparent shadow-lg text-white font-black'
                : 'border-outline/40 bg-black/10 hover:bg-black/20 text-zinc-700'
              }
              ${(s === 0 || s === 4) && !block ? 'border-l-zinc-500' : ''}
            `}
          >
            {block ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center group"
                style={{ backgroundColor: block.color }}
              >
                <span className="text-[10px] leading-tight uppercase truncate w-full px-1 drop-shadow-md">
                  {block.name || `Paso ${block.duration}T`}
                </span>
                {block.description && (
                  <span className="text-[7px] opacity-80 truncate w-full px-1 font-bold">{block.description}</span>
                )}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Info size={10} />
                </div>
              </div>
            ) : (
              <span className="text-[10px] font-black opacity-20">{s + 1}</span>
            )}
          </div>
        );
      }
      rows.push(
        <div key={m} className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${m % 2 === 0 ? 'bg-primary' : 'bg-amber-500'}`} />
              Compás {m + 1}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); removeMeasure(m); }}
              className="text-zinc-700 hover:text-red-500 p-1"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1 bg-surface/30 p-1.5 rounded-2xl border border-outline/60 shadow-inner relative">
             {/* Visual separation for 1-4 and 5-8 */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/5 pointer-events-none" />
            {slots}
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white pb-64">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-outline/60 px-4 py-4 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <input
            value={currentChoreo.title}
            onChange={(e) => updateChoreoTitle(e.target.value)}
            className="flex-1 bg-transparent border-b border-outline/60 py-1 text-lg font-black text-white focus:outline-none focus:border-primary uppercase tracking-tight"
            placeholder="Mi Bachata Flow..."
          />
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className={`p-2.5 rounded-xl transition-colors ${showQuickAdd ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            <Plus size={20} />
          </button>
          <button
            onClick={async () => {
              try {
                await saveCurrentChoreo();
                Swal.fire({ title: '¡Guardado!', icon: 'success', timer: 1000, showConfirmButton: false, background: '#1a1a1a', color: '#fff' });
              } catch (e) { Swal.fire('Error', e.message, 'error'); }
            }}
            className="bg-primary p-2.5 rounded-xl text-white shadow-lg active:scale-95 transition-all"
          >
            <Save size={20} strokeWidth={2.5} />
          </button>
        </div>

        {showQuickAdd && (
          <div className="animate-in slide-in-from-top duration-300">
            <QuickAddForm onAdd={(s) => {
               addStep(s);
               setShowQuickAdd(false);
            }} />
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto mt-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight px-1">Editor de Coreo</h2>
          {renderGrid()}

          <button
            onClick={addMeasure}
            className="w-full h-16 rounded-3xl border-2 border-dashed border-outline/60 flex items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-primary transition-all bg-surface/20"
          >
            <Plus size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Agregar 8 Tiempos</span>
          </button>
        </div>

        {/* Librería Rápida */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Librería de Pasos</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {steps.map(step => (
              <button
                key={step.id}
                onClick={() => handleLibraryStepClick(step)}
                className="shrink-0 flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shadow-lg transition-transform active:scale-90"
                  style={{ backgroundColor: step.color }}
                >
                  {step.duration}T
                </div>
                <span className="text-[8px] font-bold uppercase text-zinc-500 group-hover:text-white transition-colors truncate w-14 text-center">
                  {step.name}
                </span>
              </button>
            ))}
            {steps.length === 0 && (
              <p className="text-[9px] text-zinc-600 font-bold uppercase py-4">No hay pasos guardados aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar Fijo Inferior */}
      <div className="fixed bottom-24 left-4 right-4 z-50">
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl">
          <div className="flex gap-1.5">
            {[null, 1, 2, 4].map(d => (
              <button
                key={d || 'none'}
                onClick={() => setPaintingDuration(d)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  paintingDuration === d
                    ? 'bg-primary text-white scale-110 shadow-lg'
                    : 'bg-white/5 text-zinc-500'
                }`}
              >
                {d ? <span className="text-xs font-black">{d}T</span> : <ChevronRight size={20} />}
              </button>
            ))}
          </div>
          <div className="pr-4 text-right">
             <p className="text-[9px] font-black text-white uppercase leading-tight">
               {paintingDuration ? `Modo Pintar: ${paintingDuration}T` : 'Modo Selección'}
             </p>
             <p className="text-[8px] text-zinc-500 font-bold uppercase">
               {paintingDuration ? 'Toca slots vacíos' : 'Toca bloques para editar'}
             </p>
          </div>
        </div>
      </div>

      {editingBlockSlot !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <BlockEditorModal
            block={currentChoreo.sequence.find(b => b.slotIndex === editingBlockSlot)}
            onSave={(data) => {
              updateBlockInChoreo(editingBlockSlot, data);
              setEditingBlockSlot(null);
            }}
            onCancel={() => setEditingBlockSlot(null)}
          />
        </div>
      )}
    </div>
  );
};

export default EditorView;
