import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  Plus, Save, Trash2, ChevronRight, X, Play, Volume2, VolumeX, Music
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
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#f97316', // Orange
    '#64748b'  // Slate
  ];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-3 w-full max-w-[320px] shadow-2xl space-y-1.5 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-black uppercase tracking-tight text-white">Editar Bloque</h3>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white"><X size={18} /></button>
      </div>

      <div className="space-y-1.5">
        <div className="space-y-0.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Nombre del Paso</label>
          <input
            value={edited.name}
            onChange={e => setEdited({...edited, name: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-primary outline-none"
            placeholder="Ej: Básico con giro"
          />
        </div>

        <div className="space-y-0.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Colores</label>
          <div className="flex gap-1.5 py-1 overflow-x-auto no-scrollbar">
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

        <div className="space-y-0.5">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Descripción / Adorno</label>
          <textarea
            value={edited.description}
            onChange={e => setEdited({...edited, description: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs h-12 resize-none outline-none"
            placeholder="¿Qué pasa en este tiempo?"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Instrucciones Líder</label>
            <textarea
              value={edited.leadInstructions}
              onChange={e => setEdited({...edited, leadInstructions: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] h-16 resize-none outline-none"
              placeholder="Guía para él..."
            />
          </div>
          <div className="space-y-0.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Instrucciones Follower</label>
            <textarea
              value={edited.followerInstructions}
              onChange={e => setEdited({...edited, followerInstructions: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-2 py-1.5 text-[10px] h-16 resize-none outline-none"
              placeholder="Guía para ella..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => onSave(edited)}
        className="w-full bg-primary text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
      >
        Guardar Bloque
      </button>
    </div>
  );
};

const EditorView = () => {
  const {
    currentChoreo, updateChoreoTitle, updateChoreoDifficulty, addMeasure, removeMeasure,
    addBlockToChoreo, updateBlockInChoreo, removeBlockFromChoreo,
    saveCurrentChoreo, resetChoreo, choreos, loadChoreo, deleteChoreo,
    paintingDuration, setPaintingDuration, isMetronomeEnabled, setMetronomeEnabled
  } = useStore();

  const [editingBlockSlot, setEditingBlockSlot] = useState(null);

  const getDifficultyColor = (diff) => {
    if (diff === 'principiante') return '#3b82f6';
    if (diff === 'intermedio') return '#fbbf24';
    if (diff === 'avanzado') return '#e11d48';
    return '#3b82f6';
  };

  const handleSlotClick = (slotIndex) => {
    if (!paintingDuration) {
       // If not painting, try to edit if block exists
       const block = currentChoreo.sequence.find(b => b.slotIndex === slotIndex);
       if (block) setEditingBlockSlot(slotIndex);
       return;
    }

    addBlockToChoreo({
      duration: paintingDuration,
      color: '#e11d48'
    }, slotIndex);
  };

  const handleSlotLongPress = (slotIndex) => {
    const block = currentChoreo.sequence.find(b => b.slotIndex === slotIndex);
    if (block) {
       removeBlockFromChoreo(slotIndex);
    }
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
            onContextMenu={(e) => { e.preventDefault(); handleSlotLongPress(slotIndex); }}
            style={{ gridColumn: `span ${block ? block.duration : 1}` }}
            className={`
              relative h-12 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden
              ${block
                ? 'border-transparent shadow-lg text-white font-black'
                : 'border-outline/40 bg-black/10 hover:bg-black/20 text-zinc-700'
              }
            `}
          >
            {block ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-0.5 text-center"
                style={{ backgroundColor: block.color }}
              >
                <span className="text-[10px] leading-tight uppercase truncate w-full px-1">
                  {block.name || `${block.duration}T`}
                </span>
                {block.description && (
                  <span className="text-[8px] opacity-70 truncate w-full px-1 leading-none">{block.description}</span>
                )}
              </div>
            ) : (
              <span className="text-sm font-bold opacity-30">{(slotIndex % 8) + 1}</span>
            )}
          </div>
        );
      }
      rows.push(
        <div key={m} className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-black text-zinc-600 uppercase tracking-widest">Compás {m + 1}</span>
            <button
              onClick={(e) => { e.stopPropagation(); removeMeasure(m); }}
              className="text-zinc-700 hover:text-red-500 p-1"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-0.5 bg-surface/30 p-1 rounded-2xl border border-outline/60 shadow-inner">
            {slots}
          </div>
        </div>
      );
    }
    return rows;
  };

  const handleSave = async () => {
    try {
      await saveCurrentChoreo();
      Swal.fire({
        title: '¡Guardado!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff'
      });
    } catch (e) {
      Swal.fire('Error', e.message, 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface/40 backdrop-blur-xl text-white pb-32">
      {/* Header Fijo */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-outline/60 px-1.5 py-1 space-y-1 shadow-xl">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              value={currentChoreo.title}
              onChange={(e) => updateChoreoTitle(e.target.value)}
              className="w-full bg-transparent border-b border-outline/60 py-0 text-base font-black text-white focus:outline-none focus:border-primary uppercase tracking-tight"
              placeholder="Nombre..."
            />
          </div>
          <button
            onClick={() => {
               Swal.fire({
                 title: '¿Nueva coreografía?',
                 text: 'Perderás los cambios no guardados.',
                 icon: 'warning',
                 showCancelButton: true,
                 confirmButtonText: 'Sí, nueva',
                 confirmButtonColor: '#e11d48',
                 background: '#1a1a1a',
                 color: '#fff'
               }).then(result => {
                 if (result.isConfirmed) resetChoreo();
               });
            }}
            className="p-2 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={handleSave}
            className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/30 active:scale-95 transition-all"
          >
            <Save size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex gap-1.5 items-center">
          <div className="flex flex-1 gap-1">
            {['principiante', 'intermedio', 'avanzado'].map((d) => (
              <button
                key={d}
                onClick={() => updateChoreoDifficulty(d)}
                className={`flex-1 py-1 rounded-lg text-xs font-black uppercase tracking-widest border transition-all ${
                  currentChoreo.difficulty === d
                    ? 'bg-primary border-primary text-white shadow-lg'
                    : 'bg-surface/50 border-outline/60 text-zinc-500'
                }`}
                style={{
                  backgroundColor: currentChoreo.difficulty === d ? getDifficultyColor(d) : undefined,
                  borderColor: currentChoreo.difficulty === d ? getDifficultyColor(d) : undefined
                }}
              >
                {d.charAt(0)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMetronomeEnabled(!isMetronomeEnabled)}
            className={`p-1 rounded-lg border transition-all ${isMetronomeEnabled ? 'bg-amber-500 border-amber-500 text-white' : 'bg-surface/50 border-outline/60 text-zinc-500'}`}
          >
            {isMetronomeEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>

      {/* Sequencer Scrollable Area */}
      <div className="flex-1 p-1 overflow-y-auto space-y-1.5">
        <div className="space-y-1">
          {renderGrid()}

          <button
            onClick={addMeasure}
            className="w-full h-8 rounded-lg border-2 border-dashed border-outline/60 flex items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-primary transition-all"
          >
            <Plus size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Agregar Compás</span>
          </button>
        </div>

        {/* Mis Coreografías List */}
        <div className="pt-1.5 border-t border-outline/60">
           <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 flex items-center gap-2 px-1">
             <Music size={10} className="text-primary" /> Mis Coreografías
           </h3>
           <div className="grid gap-1">
              {choreos.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-2 uppercase font-bold">No tienes coreos guardadas</p>
              )}
              {choreos.map(choreo => (
                <div key={choreo.id} className="bg-surface/40 border border-outline/60 rounded-xl p-1.5 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black text-white"
                    style={{ backgroundColor: choreo.color }}
                  >
                    {choreo.difficulty?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase truncate">{choreo.title}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{choreo.measures} Comp.</p>
                  </div>
                  <div className="flex gap-0.5">
                    <button onClick={() => loadChoreo(choreo)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: '¿Eliminar?',
                          icon: 'error',
                          showCancelButton: true,
                          confirmButtonText: 'Eliminar',
                          background: '#1a1a1a',
                          color: '#fff'
                        }).then(r => r.isConfirmed && deleteChoreo(choreo.id));
                      }}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Floating Toolbar (Painting Mode) */}
      <div className="fixed bottom-[72px] left-1.5 right-1.5 z-50">
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 flex items-center justify-between shadow-2xl">
          <div className="flex gap-1">
            {[null, 1, 2, 4].map(d => (
              <button
                key={d || 'none'}
                onClick={() => setPaintingDuration(d)}
                className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all ${
                  paintingDuration === d
                    ? 'bg-primary text-white scale-110 shadow-lg'
                    : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {d ? (
                  <span className="text-[10px] font-black">{d}T</span>
                ) : (
                  <Plus size={16} />
                )}
              </button>
            ))}
          </div>
          <div className="px-2 text-right">
            <p className="text-xs font-black text-zinc-400 uppercase tracking-tight leading-none">
              {paintingDuration ? 'PINTAR' : 'EDICIÓN'}
            </p>
            <p className="text-[8px] text-primary font-bold uppercase mt-0.5">
              {paintingDuration ? `${paintingDuration}T` : 'EDIT'}
            </p>
          </div>
        </div>
      </div>

      {/* Block Editor Modal */}
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
