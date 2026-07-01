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
          background: '#0A1828',
          color: '#D4AF37',
          customClass: { popup: 'df-card !border-df-primary/40' }
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
            timer: 1500,
            showConfirmButton: false,
            background: '#0A1828',
            color: '#D4AF37',
            customClass: { popup: 'df-card !border-df-primary/40' }
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
        <DFCard noPadding className="flex items-center justify-between border-df-primary/40 bg-df-primary/5 p-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-df-primary text-black rounded-xl shadow-lg">
                <Eye size={20} />
            </div>
            <div>
                <p className="df-label text-df-primary mb-1">Previsualización</p>
                <h2 className="df-title uppercase italic">Vista de Alumno</h2>
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
    <div className="space-y-8 pb-12">
      <DFPageHeader
        title="Librería de Clases"
        subtitle="Diseña y asigna módulos de entrenamiento personalizados"
      >
        <DFPageActions>
          <DFIconButton
            icon={Eye}
            variant="ghost"
            onClick={() => setViewAsStudent(true)}
            title="Ver como alumno"
          />
          <DFButton
            variant={isCreating ? "danger" : "primary"}
            size="md"
            onClick={() => setIsCreating(!isCreating)}
            leftIcon={isCreating ? Trash2 : Plus}
          >
            {isCreating ? 'Cancelar' : 'Nueva Clase'}
          </DFButton>
        </DFPageActions>
      </DFPageHeader>

      {isCreating && (
        <DFCard className="animate-in slide-in-from-top-4 duration-300 border-df-primary/20 bg-df-surface-2">
          <form onSubmit={handleCreateBlock} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-df-border rounded-xl bg-df-surface-3 text-df-text-muted cursor-pointer hover:border-df-primary/40 transition-all group text-center">
                      <div className="p-3 bg-df-primary/5 rounded-full group-hover:bg-df-primary/10 transition-colors inline-block">
                          <Upload size={24} className="text-df-primary" />
                      </div>
                      <div>
                          <p className="df-body-sm text-df-text font-medium mb-1">{selectedFile ? selectedFile.name : 'Selecciona el contenido maestro'}</p>
                          <p className="df-caption uppercase tracking-widest">{selectedFile ? 'Archivo listo' : 'MP4 o MP3 (Max 100MB)'}</p>
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
            <DFCard key={block.id} noPadding className="overflow-hidden group border-df-border-subtle hover:border-df-primary/30">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                   <div className="p-3.5 bg-df-primary/5 rounded-xl border border-df-primary/10 text-df-primary group-hover:scale-105 transition-transform duration-300 shadow-inner">
                      {block.type === 'video' ? <Play size={24} fill="currentColor" /> : <MessageSquare size={24} />}
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <DFBadge variant="primary" size="xs">{block.level}</DFBadge>
                        <DFBadge variant="secondary" size="xs" className="!bg-df-surface-3">{block.type}</DFBadge>
                      </div>
                      <h3 className="df-title uppercase italic text-df-text group-hover:text-df-primary transition-colors">{block.title}</h3>
                      <div className="flex items-center gap-4 df-caption uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Users size={14} /> {block.Assignments?.length || 0} Alumnos</span>
                         <span className="flex items-center gap-1.5"><Clock size={14} /> Actualizado recientemente</span>
                      </div>
                   </div>
                </div>
                <DFButton
                  variant={activeBlockId === block.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                  rightIcon={ChevronRight}
                >
                  {activeBlockId === block.id ? 'Cerrar Panel' : 'Gestionar Clase'}
                </DFButton>
              </div>

              {activeBlockId === block.id && (
                <div className="p-6 sm:p-8 space-y-10 animate-in slide-in-from-top-2 duration-300 bg-df-primary/[0.02] border-t border-df-border-subtle">
                  <section>
                     <div className="flex items-center gap-2.5 mb-5">
                        <UserCheck size={18} className="text-df-primary" />
                        <span className="df-label text-df-primary">Asignación Personalizada</span>
                     </div>
                     <div className="flex flex-wrap gap-2.5 mb-8">
                      {users.filter(u => u.role === 'alumno').map(u => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl df-label transition-all duration-300 border cursor-pointer ${
                              selectedStudents.includes(u.id)
                              ? 'bg-df-primary border-df-primary text-black shadow-lg scale-105'
                              : 'border-df-border bg-df-surface-2 text-df-text-muted hover:text-df-text hover:border-df-primary/40'
                          }`}
                        >
                          <DFAvatar name={u.username} size="xs" className={selectedStudents.includes(u.id) ? "!bg-black/20 !text-black !border-black/10" : ""} />
                          <span className="font-bold">{u.username}</span>
                        </button>
                      ))}
                     </div>
                     <DFButton
                       onClick={() => handleAssign(block.id)}
                       disabled={selectedStudents.length === 0}
                       size="md"
                       className="w-full sm:w-auto min-w-[240px]"
                     >
                      Asignar a {selectedStudents.length} Alumnos Seleccionados
                     </DFButton>
                  </section>

                  <section className="pt-10 border-t border-df-border-subtle">
                     <div className="flex items-center gap-2.5 mb-8">
                        <MessageSquare size={18} className="text-df-primary" />
                        <span className="df-label text-df-primary">Interacciones y Feedback</span>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {block.Assignments?.length === 0 ? (
                           <div className="lg:col-span-2 py-12 text-center border-2 border-dashed border-df-border rounded-3xl">
                              <p className="df-label opacity-40 uppercase tracking-widest">Sin actividad registrada en esta clase</p>
                           </div>
                        ) : (
                          block.Assignments?.map(asgn => (
                            <DFCard key={asgn.id} className="space-y-5 bg-df-surface-2 border-df-border-subtle hover:border-df-primary/20 transition-colors">
                                <div className="flex justify-between items-center pb-4 border-b border-df-border-subtle">
                                    <div className="flex items-center gap-4">
                                        <DFAvatar name={asgn.User.username} size="sm" />
                                        <div>
                                            <p className="df-title uppercase italic text-df-text">{asgn.User.username}</p>
                                            <p className="df-caption uppercase tracking-widest font-bold text-df-primary">Alumno Pro</p>
                                        </div>
                                    </div>
                                    <DFBadge variant={asgn.Replies?.some(r => !r.isReadByMaster) ? "primary" : "secondary"}>
                                        {asgn.Replies?.some(r => !r.isReadByMaster) ? 'Pendiente' : 'Revisado'}
                                    </DFBadge>
                                </div>

                                <div className="space-y-4 max-h-[240px] overflow-y-auto pr-3 custom-scrollbar">
                                    {asgn.Replies?.length === 0 ? (
                                        <div className="py-8 text-center opacity-30">
                                            <p className="df-caption italic">No hay mensajes en esta conversación</p>
                                        </div>
                                    ) : (
                                        asgn.Replies?.map((r, i) => (
                                            <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`p-4 rounded-2xl text-sm max-w-[90%] shadow-sm ${r.userId === user.id ? 'bg-df-primary/10 border border-df-primary/20 text-df-primary' : 'bg-df-surface-3 text-df-text-soft border border-df-border'}`}>
                                                    {r.content}
                                                    <div className="mt-2 df-caption text-right opacity-50 font-bold">
                                                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex items-center gap-3 bg-df-surface-3 rounded-2xl p-3 border border-df-border focus-within:border-df-primary/40 transition-all shadow-inner">
                                    <input
                                        placeholder="Escribe tu feedback maestro..."
                                        className="flex-1 bg-transparent px-3 py-1.5 df-body-sm outline-none text-df-text"
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
