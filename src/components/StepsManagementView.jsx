import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Search, Edit2, Trash2, Plus, X, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

const StepEditModal = ({ step, onSave, onCancel }) => {
  const [edited, setEdited] = useState({ ...step });
  const colors = ['#e11d48', '#fbbf24', '#8b5cf6', '#10b981', '#3b82f6', '#f97316', '#64748b'];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black uppercase tracking-tight text-white">Editar Paso</h3>
        <button onClick={onCancel} className="text-zinc-500"><X size={24} /></button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase">Nombre</label>
          <input
            value={edited.name}
            onChange={e => setEdited({...edited, name: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Duración (T)</label>
            <select
              value={edited.duration}
              onChange={e => setEdited({...edited, duration: parseInt(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none"
            >
              {[1, 2, 4].map(d => <option key={d} value={d}>{d} Tiempos</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase">Categoría</label>
            <select
              value={edited.category}
              onChange={e => setEdited({...edited, category: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none"
            >
              <option value="base">Base</option>
              <option value="giro">Giro</option>
              <option value="adorno">Adorno</option>
              <option value="figura">Figura</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-500 uppercase">Color</label>
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
          <label className="text-[10px] font-black text-zinc-500 uppercase">Descripción</label>
          <textarea
            value={edited.description}
            onChange={e => setEdited({...edited, description: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs h-20 resize-none outline-none"
            placeholder="Descripción técnica..."
          />
        </div>
      </div>

      <button
        onClick={() => onSave(edited)}
        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
      >
        Actualizar Paso
      </button>
    </div>
  );
};

const StepsManagementView = () => {
  const { steps, updateStep, deleteStep, addStep } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStep, setEditingStep] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredSteps = steps.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'base', 'giro', 'adorno', 'figura'];

  return (
    <div className="flex flex-col min-h-screen bg-background text-white p-4 space-y-6">
      <header className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight">Mis Pasos</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar paso..."
            className="w-full bg-surface/50 border border-outline/60 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-primary outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filterCategory === cat ? 'bg-primary border-primary text-white' : 'bg-surface border-outline/60 text-zinc-500'}`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-3">
        {filteredSteps.map(step => (
          <div key={step.id} className="bg-surface/40 border border-outline/60 rounded-3xl p-4 flex items-center gap-4 group">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-lg"
              style={{ backgroundColor: step.color }}
            >
              {step.duration}T
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black uppercase truncate">{step.name}</h4>
                <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/10 text-zinc-400 font-black uppercase tracking-tighter">
                  {step.category}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
                {step.description || 'Sin descripción'}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingStep(step)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    title: '¿Eliminar paso?',
                    text: 'Se borrará de tu librería global.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e11d48',
                    background: '#1a1a1a',
                    color: '#fff'
                  }).then(r => r.isConfirmed && deleteStep(step.id));
                }}
                className="p-2 text-zinc-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredSteps.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <Tag size={48} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase">No se encontraron pasos</p>
          </div>
        )}
      </div>

      {editingStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <StepEditModal
            step={editingStep}
            onSave={(data) => {
              updateStep(editingStep.id, data);
              setEditingStep(null);
            }}
            onCancel={() => setEditingStep(null)}
          />
        </div>
      )}
    </div>
  );
};

export default StepsManagementView;
