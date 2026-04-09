import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { APP_COLORS } from '../services/constants';

const StepForm = ({ initialStep, onSave, onCancel }) => {
  const [step, setStep] = useState(initialStep || {
    name: '',
    duration: 1,
    description: '',
    color: APP_COLORS[0],
    category: 'base'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(step);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl space-y-4 shadow-lg border border-zinc-800">
      <h3 className="text-lg font-bold text-white mb-4">
        {initialStep ? 'Editar Paso' : 'Nuevo Paso'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Nombre</label>
        <input
          type="text"
          required
          value={step.name}
          onChange={(e) => setStep({ ...step, name: e.target.value })}
          className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none"
          placeholder="Ej. Paso Básico"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Duración (Tiempos)</label>
        <div className="flex gap-2">
          {[1, 2, 4].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setStep({ ...step, duration: d })}
              className={`flex-1 py-2 rounded-lg font-bold border-2 transition-all ${
                step.duration === d
                  ? 'bg-primary border-primary text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Color</label>
        <div className="flex gap-3 justify-between">
          {APP_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setStep({ ...step, color: c })}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                step.color === c ? 'scale-125 border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Descripción</label>
        <textarea
          value={step.description}
          onChange={(e) => setStep({ ...step, description: e.target.value })}
          className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary outline-none h-20"
          placeholder="Opcional: Descripción ontológica..."
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-bold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary text-white py-3 rounded-lg font-bold"
        >
          {initialStep ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

const MyStepsView = () => {
  const { steps, addStep, updateStep, deleteStep } = useStore();
  const [editingStep, setEditingStep] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSteps = steps.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Pasos</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary p-2 rounded-full text-white shadow-lg hover:bg-rose-600"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar paso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-3">
        {filteredSteps.map((step) => (
          <div key={step.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-inner"
              style={{ backgroundColor: step.color }}
            >
              {step.duration}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">{step.name}</h4>
              <p className="text-xs text-zinc-500 truncate">{step.description || 'Sin descripción'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingStep(step)}
                className="p-2 text-zinc-400 hover:text-secondary"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => deleteStep(step.id)}
                className="p-2 text-zinc-400 hover:text-primary"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding/editing */}
      {(isAdding || editingStep) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm">
            <StepForm
              initialStep={editingStep}
              onSave={(step) => {
                if (editingStep) updateStep(step);
                else addStep(step);
                setIsAdding(false);
                setEditingStep(null);
              }}
              onCancel={() => {
                setIsAdding(false);
                setEditingStep(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStepsView;
