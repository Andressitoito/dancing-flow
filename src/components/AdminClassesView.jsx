import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  Upload,
  Plus,
  Users,
  Play,
  Send,
  Trash2,
  Eye,
  Clock,
  MessageSquare,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import StudentTrainingView from '../views/StudentTrainingView';
import {
  DFCard,
  DFButton,
  DFInput,
  DFTextarea,
  DFSelect,
  DFBadge,
  DFIconButton,
  DFAvatar,
  DFEmptyState,
  DFPageHeader,
  DFPageActions,
} from './ui';

const AdminClassesView = () => {
  const { user, users, fetchInitialData } = useStore();
  const [blocks, setBlocks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [viewAsStudent, setViewAsStudent] = useState(false);
  const [newBlock, setNewBlock] = useState({
    title: '',
    description: '',
    type: 'video',
    level: 'principiante'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [profesorReply, setProfesorReply] = useState({});

  const fetchBlocks = async () => {
    try {
      const data = await api.getBlocks();
      setBlocks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setBlocks([]);
    }
  };

  useEffect(() => {
    fetchBlocks();
    fetchInitialData();
  }, [fetchInitialData]);

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBlock.title);
    formData.append('description', newBlock.description);
    formData.append('type', newBlock.type);
    formData.append('level', newBlock.level);
    if (selectedFile) formData.append('file', selectedFile);

    try {
      const res = await api.createBlock(formData);
      if (res && !res.error) {
        setIsCreating(false);
        setNewBlock({ title: '', description: '', type: 'video', level: 'principiante' });
        setSelectedFile(null);
        fetchBlocks();
        Swal.fire({
          icon: 'success',
          title: 'Clase Creada',
          background: '#051424',
          color: '#D4AF37',
          customClass: { popup: 'glass-card border-primary/40' }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssign = async (blockId) => {
    if (selectedStudents.length === 0) return;
    try {
      const res = await api.assignBlock(blockId, selectedStudents);
      if (res && !res.error) {
        setSelectedStudents([]);
        fetchBlocks();
        Swal.fire({
            icon: 'success',
            title: 'Alumnos Asignados',
            timer: 1000,
            showConfirmButton: false,
            background: '#051424',
            color: '#D4AF37',
            customClass: { popup: 'glass-card border-primary/40' }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfesorReply = async (assignmentId) => {
    const text = profesorReply[assignmentId];
    if (!text || !text.trim()) return;
    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('content', text);
    formData.append('type', 'text');

    try {
      const res = await api.postReply(formData);
      if (res && !res.error) {
        setProfesorReply({ ...profesorReply, [assignmentId]: '' });
        fetchBlocks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (viewAsStudent) {
    return (
      <div className="space-y-6">
        <DFCard padding="sm" className="flex items-center justify-between border-primary/40 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-black rounded-lg shadow-lg">
                <Eye size={20} />
            </div>
            <div>
                <p className="df-label !text-[10px] !text-primary !tracking-widest uppercase">Previsualización</p>
                <h2 className="font-sora text-xl font-bold text-white italic uppercase tracking-tighter leading-none">Vista de Alumno</h2>
            </div>
          </div>
          <DFButton
            variant="secondary"
            size="sm"
            onClick={() => setViewAsStudent(false)}
          >
            Cerrar Vista Previa
          </DFButton>
        </DFCard>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <DFPageHeader
        title="Librería de Clases"
        subtitle="Diseña y asigna módulos de entrenamiento personalizados"
      >
        <DFPageActions>
          <DFIconButton
            icon={Eye}
            variant="secondary"
            onClick={() => setViewAsStudent(true)}
            title="Ver como alumno"
          />
          <DFButton
            variant={isCreating ? "danger" : "primary"}
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
            leftIcon={isCreating ? Trash2 : Plus}
          >
            {isCreating ? 'Cancelar' : 'Nueva Clase'}
          </DFButton>
        </DFPageActions>
      </DFPageHeader>

      {isCreating && (
        <DFCard className="animate-in slide-in-from-top-4 duration-300 border-primary/20">
          <form onSubmit={handleCreateBlock} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <DFInput
                  label="Título de la Clase"
                  required
                  placeholder="Ej: Fundamentos de Bachata Sensual I"
                  value={newBlock.title}
                  onChange={e => setNewBlock({...newBlock, title: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-4">
                  <DFSelect
                    label="Nivel"
                    value={newBlock.level}
                    onChange={e => setNewBlock({...newBlock, level: e.target.value})}
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </DFSelect>

                  <DFSelect
                    label="Formato"
                    value={newBlock.type}
                    onChange={e => setNewBlock({...newBlock, type: e.target.value})}
                  >
                    <option value="video">🎥 Video Feedback</option>
                    <option value="audio">🎙️ Solo Audio</option>
                    <option value="text">📝 Solo Texto</option>
                  </DFSelect>
                </div>
              </div>

              <div className="space-y-6">
                <DFTextarea
                  label="Instrucciones y Objetivos"
                  placeholder="Describe lo que el alumno debe practicar..."
                  rows={4}
                  value={newBlock.description}
                  onChange={e => setNewBlock({...newBlock, description: e.target.value})}
                />

                <div className="relative">
                  <input type="file" className="hidden" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])}/>
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-white/10 rounded-xl bg-black/40 text-zinc-500 cursor-pointer hover:border-primary/30 transition-all group text-center">
                      <div className="p-3 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors inline-block">
                          <Upload size={24} className="text-primary" />
                      </div>
                      <div>
                          <p className="text-sm text-white font-medium mb-0.5">{selectedFile ? selectedFile.name : 'Selecciona el contenido maestro'}</p>
                          <p className="df-label !text-[8px] opacity-40 uppercase tracking-widest">{selectedFile ? 'Archivo listo' : 'MP4 o MP3 (Max 100MB)'}</p>
                      </div>
                  </label>
                </div>
              </div>
            </div>

            <DFButton fullWidth size="lg" type="submit">
              Publicar Clase Maestra
            </DFButton>
          </form>
        </DFCard>
      )}

      <div className="grid grid-cols-1 gap-4">
        {blocks.length === 0 ? (
          <DFEmptyState
            title="Sin clases publicadas"
            description="Comienza creando tu primera clase maestra para tus alumnos."
          />
        ) : (
          blocks.map(block => (
            <DFCard key={block.id} padding="none" className="overflow-hidden group border-white/5 hover:border-primary/20">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                      {block.type === 'video' ? <Play size={24} fill="currentColor" /> : <MessageSquare size={24} />}
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DFBadge variant="primary" size="xs">{block.level}</DFBadge>
                        <DFBadge variant="secondary" size="xs" className="!bg-white/[0.03]">{block.type}</DFBadge>
                      </div>
                      <h3 className="font-sora text-lg font-bold text-white italic uppercase tracking-tight">{block.title}</h3>
                      <div className="flex items-center gap-4 df-label !text-[9px] !text-zinc-500 !tracking-widest uppercase">
                         <span className="flex items-center gap-1.5"><Users size={12} /> {block.Assignments?.length || 0} Alumnos</span>
                         <span className="flex items-center gap-1.5"><Clock size={12} /> Actualizado</span>
                      </div>
                   </div>
                </div>
                <DFButton
                  variant={activeBlockId === block.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                  rightIcon={ChevronRight}
                >
                  {activeBlockId === block.id ? 'Cerrar Panel' : 'Gestionar'}
                </DFButton>
              </div>

              {activeBlockId === block.id && (
                <div className="p-4 sm:p-8 space-y-8 animate-in slide-in-from-top-2 duration-300 bg-white/[0.02] border-t border-white/5">
                  <section>
                     <div className="flex items-center gap-2 mb-4">
                        <UserCheck size={16} className="text-primary" />
                        <span className="df-label !text-[10px] text-primary uppercase tracking-widest">Asignar a Alumnos</span>
                     </div>
                     <div className="flex flex-wrap gap-2 mb-6">
                      {users.filter(u => u.role === 'alumno').map(u => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] df-label transition-all duration-200 border cursor-pointer uppercase tracking-widest ${
                              selectedStudents.includes(u.id)
                              ? 'bg-primary border-primary text-black'
                              : 'border-white/10 bg-black/40 text-zinc-500 hover:text-white hover:border-white/30'
                          }`}
                        >
                          <DFAvatar name={u.username} size="xs" className={selectedStudents.includes(u.id) ? "!bg-black/20 !text-black !border-black/10" : ""} />
                          {u.username}
                        </button>
                      ))}
                     </div>
                     <DFButton
                       onClick={() => handleAssign(block.id)}
                       disabled={selectedStudents.length === 0}
                       fullWidth
                       size="md"
                       className="sm:w-auto"
                     >
                      Asignar a {selectedStudents.length} Alumnos
                     </DFButton>
                  </section>

                  <section className="pt-8 border-t border-white/5">
                     <div className="flex items-center gap-2 mb-6">
                        <MessageSquare size={16} className="text-primary" />
                        <span className="df-label !text-[10px] text-primary uppercase tracking-widest">Seguimiento de Feedback</span>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {block.Assignments?.length === 0 ? (
                           <div className="lg:col-span-2 py-10 text-center opacity-30">
                              <p className="df-label !text-[10px] uppercase tracking-widest">No hay alumnos asignados</p>
                           </div>
                        ) : (
                          block.Assignments?.map(asgn => (
                            <DFCard key={asgn.id} padding="sm" className="space-y-4 bg-black/40 border-white/5">
                                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <DFAvatar name={asgn.User.username} size="sm" />
                                        <div>
                                            <p className="font-sora font-bold text-sm text-white uppercase italic">{asgn.User.username}</p>
                                            <p className="df-label !text-[8px] !text-zinc-500 !tracking-widest uppercase">Alumno activo</p>
                                        </div>
                                    </div>
                                    <DFBadge variant={asgn.Replies?.some(r => !r.isReadByMaster) ? "primary" : "secondary"} size="xs">
                                        {asgn.Replies?.some(r => !r.isReadByMaster) ? 'Nuevo' : 'Visto'}
                                    </DFBadge>
                                </div>

                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {asgn.Replies?.length === 0 ? (
                                        <div className="py-6 text-center opacity-20">
                                            <p className="df-label !text-[8px] uppercase tracking-widest">Sin interacciones</p>
                                        </div>
                                    ) : (
                                        asgn.Replies?.map((r, i) => (
                                            <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`p-3 rounded-xl text-xs max-w-[85%] ${r.userId === user.id ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-white/5 text-zinc-300 border border-white/5'}`}>
                                                    {r.content}
                                                    <div className="mt-1.5 df-label !text-[6px] !text-zinc-500 text-right opacity-60">
                                                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex items-center gap-2 bg-black/60 rounded-xl p-2 border border-white/5 focus-within:border-primary/30 transition-all">
                                    <input
                                        placeholder="Feedback maestro..."
                                        className="flex-1 bg-transparent px-2 py-1 text-sm outline-none text-white"
                                        value={profesorReply[asgn.id] || ''}
                                        onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                                        onKeyPress={e => e.key === 'Enter' && handleProfesorReply(asgn.id)}
                                    />
                                    <DFIconButton
                                        icon={Send}
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleProfesorReply(asgn.id)}
                                    />
                                </div>
                            </DFCard>
                          ))
                        )}
                     </div>
                  </section>
                </div>
              )}
            </DFCard>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminClassesView;
