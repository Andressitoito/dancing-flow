import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { APP_COLORS } from '../services/constants';
import Swal from 'sweetalert2';

const StepEditorModal = ({ step, onSave, onCancel }) => {
  const [editedStep, setEditedStep] = useState({
    ...step,
    technical_details: step.technical_details || { lead: '', follow: '', connection: '' },
    category: step.category || 'base'
  });

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-6 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h3 className="text-xl font-black uppercase tracking-tight text-white">Edición de Paso</h3>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Nombre</label>
            <input
              value={editedStep.name}
              onChange={e => setEditedStep({...editedStep, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Duración</label>
            <div className="flex gap-2">
              {[1, 2, 4].map(d => (
                <button
                  key={d}
                  onClick={() => setEditedStep({...editedStep, duration: d})}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${editedStep.duration === d ? 'bg-primary text-white' : 'bg-black/40 text-zinc-500'}`}
                >
                  {d}T
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Dificultad</label>
            <div className="flex gap-1">
              {[
                { id: 'principiante', label: 'Básico', color: '#3b82f6' },
                { id: 'intermedio', label: 'Intermedio', color: '#fbbf24' },
                { id: 'avanzado', label: 'Avanzado', color: '#e11d48' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setEditedStep({...editedStep, difficulty: d.id, color: d.color})}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    editedStep.difficulty === d.id ? 'text-white' : 'bg-black/20 text-zinc-500'
                  }`}
                  style={{ backgroundColor: editedStep.difficulty === d.id ? d.color : undefined }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Categoría</label>
            <select
              value={editedStep.category}
              onChange={e => setEditedStep({...editedStep, category: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none transition-all appearance-none"
            >
              <option value="base">Base</option>
              <option value="giro">Giro</option>
              <option value="sensual">Sensual</option>
              <option value="adorno">Adorno</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Detalle Líder</label>
            <textarea
              value={editedStep.technical_details.lead}
              onChange={e => setEditedStep({...editedStep, technical_details: {...editedStep.technical_details, lead: e.target.value}})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs h-20 focus:border-primary outline-none transition-all resize-none"
              placeholder="Instrucciones para el líder..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Detalle Follower</label>
            <textarea
              value={editedStep.technical_details.follow}
              onChange={e => setEditedStep({...editedStep, technical_details: {...editedStep.technical_details, follow: e.target.value}})}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs h-20 focus:border-primary outline-none transition-all resize-none"
              placeholder="Instrucciones para el seguidor..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => onSave({...editedStep, status: 'verified', is_global: true})}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
        >
          <CheckCircle2 size={18} />
          Verificar y Publicar
        </button>
        <button
          onClick={() => onSave(editedStep)}
          className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
        >
          Solo Guardar
        </button>
      </div>
    </div>
  );
};

const MyStepsView = () => {
  const { user, steps, updateStep, deleteStep } = useStore();
  const [editingStep, setEditingStep] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, draft, verified

  const isPrivileged = user?.role === 'master' || user?.role === 'moderator';

  if (!isPrivileged) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
        <AlertCircle size={64} className="text-zinc-700" />
        <h2 className="text-xl font-black text-white uppercase">Acceso Restringido</h2>
        <p className="text-zinc-500 text-sm max-w-xs">Esta sección es exclusiva para Moderadores y Administradores para la gestión de pasos.</p>
      </div>
    );
  }

  const filteredSteps = steps.filter(s => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Mis Pasos</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Gestión de Biblioteca Global</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'draft', label: 'Pendientes' },
          { id: 'verified', label: 'Verificados' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              filterStatus === f.id ? 'bg-primary border-primary text-white' : 'bg-surface border-outline/60 text-zinc-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredSteps.length === 0 ? (
          <div className="bg-surface/30 border border-dashed border-outline/60 rounded-3xl p-12 text-center">
            <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No hay pasos para mostrar</p>
          </div>
        ) : (
          filteredSteps.map(step => (
            <div
              key={step.id}
              className="bg-surface/50 backdrop-blur-xl border border-outline/60 p-4 rounded-3xl flex items-center gap-4 group hover:border-primary/50 transition-all"
            >
              <div
                className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl shrink-0"
                style={{
                  backgroundColor: step.color || (step.difficulty === 'avanzado' ? '#e11d48' : step.difficulty === 'intermedio' ? '#fbbf24' : '#3b82f6')
                }}
              >
                <span className="text-xs font-black">{step.duration}T</span>
                <span className="text-[8px] font-black opacity-60 uppercase">{step.difficulty?.substring(0, 3)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-sm text-white truncate uppercase tracking-tight">{step.name}</h4>
                  {step.status === 'verified' ? (
                    <CheckCircle2 size={12} className="text-green-500" />
                  ) : (
                    <span className="bg-amber-500/10 text-amber-500 text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Draft</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate">
                  Por {step.creatorName || 'Usuario'} • {step.category || 'Base'}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setEditingStep(step)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all active:scale-90"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={async () => {
                    const res = await Swal.fire({
                      title: '¿Borrar paso?',
                      text: "Esta acción es irreversible.",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#ef4444',
                      background: '#18181b', color: '#fff'
                    });
                    if (res.isConfirmed) deleteStep(step.id);
                  }}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-500 transition-all active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <StepEditorModal
            step={editingStep}
            onSave={async (updated) => {
              await updateStep(updated);
              setEditingStep(null);
              Swal.fire({ title: 'Actualizado', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#18181b', color: '#fff' });
            }}
            onCancel={() => setEditingStep(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MyStepsView;
