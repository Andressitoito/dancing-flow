import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Upload, Plus, Users, Play, Mic, Send, Trash2, CheckCircle, Clock, Eye, EyeOff, GraduationCap, Info, ChevronDown, ChevronUp, MessageSquare, Star } from 'lucide-react';
import { api } from '../services/api';
import Swal from 'sweetalert2';
import StudentTrainingView from './StudentTrainingView';

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
  }, []);

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
          background: '#18181b',
          color: '#fff',
          customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl' }
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
            background: '#18181b',
            color: '#fff',
            customClass: { popup: 'rounded-2xl border border-white/10' }
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
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-glass/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary text-background rounded-2xl shadow-lg shadow-primary/30">
                <Eye size={24} strokeWidth={3} />
            </div>
            <div>
                <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Previsualización</p>
                <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Vista de Alumno</h2>
            </div>
          </div>
          <button
            onClick={() => setViewAsStudent(false)}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 transition-all duration-500"
          >
            Cerrar Vista Previa
          </button>
        </header>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10 px-1">
        <div className="space-y-4">
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Curriculm & Contenido</p>
          <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Librería de <span className="text-primary">Clases</span></h2>
          <p className="text-zinc-500 text-base font-medium opacity-60">Diseña y asigna módulos de entrenamiento personalizados.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setViewAsStudent(true)}
            className="p-5 bg-surface-glass/40 border border-white/5 text-zinc-400 rounded-3xl hover:text-primary hover:border-primary/30 transition-all duration-500 shadow-xl backdrop-blur-xl"
            title="Ver como alumno"
          >
            <Eye size={24} />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center gap-3 px-8 py-5 rounded-3xl transition-all duration-500 font-black text-xs uppercase tracking-widest shadow-2xl ${isCreating ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary text-background border border-primary shadow-primary/20'}`}
          >
            {isCreating ? <Trash2 size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
            {isCreating ? 'Cancelar' : 'Nueva Clase'}
          </button>
        </div>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="bg-surface-glass/20 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl space-y-10 animate-in slide-in-from-top-10 duration-700">
          <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Título de la Clase</label>
                <input
                    required placeholder="Ej: Fundamentos de Bachata Sensual I"
                    className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-5 px-8 text-xl focus:border-primary/50 transition-all"
                    value={newBlock.title}
                    onChange={e => setNewBlock({...newBlock, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Instrucciones y Objetivos</label>
                <textarea
                    placeholder="Describe lo que el alumno debe practicar..."
                    className="w-full min-h-[140px] bg-zinc-950/50 border-white/5 rounded-2xl py-5 px-8 text-lg focus:border-primary/50 transition-all"
                    value={newBlock.description}
                    onChange={e => setNewBlock({...newBlock, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Nivel</label>
                    <select className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-5 px-8 text-lg appearance-none cursor-pointer" value={newBlock.level} onChange={e => setNewBlock({...newBlock, level: e.target.value})}>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Formato</label>
                    <select className="w-full bg-zinc-950/50 border-white/5 rounded-2xl py-5 px-8 text-lg appearance-none cursor-pointer" value={newBlock.type} onChange={e => setNewBlock({...newBlock, type: e.target.value})}>
                        <option value="video">🎥 Video Feedback</option>
                        <option value="audio">🎙️ Solo Audio</option>
                        <option value="text">📝 Solo Texto</option>
                    </select>
                </div>
              </div>

              <div className="relative">
                <input type="file" className="hidden" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])}/>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-4 w-full py-16 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-black/20 text-zinc-500 cursor-pointer hover:border-primary/30 hover:bg-black/40 transition-all duration-500">
                    <div className="p-6 bg-white/5 rounded-full">
                        <Upload size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-white mb-1">{selectedFile ? selectedFile.name : 'Selecciona o arrastra el archivo'}</p>
                        <p className="text-xs font-black uppercase tracking-widest opacity-40">{selectedFile ? 'Archivo listo para subir' : 'MP4, MOV o MP3 (Max 100MB)'}</p>
                    </div>
                </label>
              </div>
          </div>

          <button className="w-full py-6 bg-primary text-background font-black uppercase tracking-[0.3em] text-sm rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-2xl shadow-primary/30">
            Publicar Clase en Librería
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {blocks.map(block => (
          <div key={block.id} className="bg-surface-glass/10 backdrop-blur-2xl rounded-[3rem] border border-white/5 overflow-hidden group transition-all duration-700 hover:border-primary/20 shadow-xl">
            <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-black/20 group-hover:bg-black/40 transition-all">
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-white/5 rounded-[2rem] text-primary group-hover:scale-110 transition-transform duration-700 shadow-xl">
                    {block.type === 'video' ? <Play size={28} fill="currentColor" strokeWidth={0} /> : <MessageSquare size={28} />}
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none">{block.level}</p>
                    <h3 className="font-black text-2xl md:text-3xl text-white italic uppercase tracking-tighter leading-none">{block.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><Users size={12} /> {block.Assignments?.length || 0} Alumnos</span>
                       <span className="w-1 h-1 rounded-full bg-zinc-800" />
                       <span className="flex items-center gap-2"><Clock size={12} /> {block.type}</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl ${activeBlockId === block.id ? 'bg-primary text-background' : 'text-primary border border-primary/20 hover:bg-primary/10'}`}
              >
                {activeBlockId === block.id ? <ChevronUp size={16} strokeWidth={3} /> : <ChevronDown size={16} strokeWidth={3} />}
                {activeBlockId === block.id ? 'Cerrar Panel' : 'Gestionar Clase'}
              </button>
            </div>

            {activeBlockId === block.id && (
              <div className="p-8 md:p-12 space-y-12 animate-in slide-in-from-top-5 duration-700 bg-black/10">
                {/* Assignment System */}
                <section className="space-y-6">
                   <div className="flex items-center gap-3 text-zinc-400">
                      <Plus size={18} strokeWidth={3} className="text-primary" />
                      <h4 className="text-xs font-black uppercase tracking-[0.4em]">Asignar a Nuevos Alumnos</h4>
                   </div>
                   <div className="flex flex-wrap gap-3">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                        className={`px-5 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${selectedStudents.includes(u.id) ? 'bg-primary border-primary text-background shadow-lg shadow-primary/20 scale-105' : 'border-white/5 bg-zinc-900/50 text-zinc-500 hover:text-white hover:border-white/20'}`}
                      >
                        {u.username}
                      </button>
                    ))}
                   </div>
                   <button
                     onClick={() => handleAssign(block.id)}
                     disabled={selectedStudents.length === 0}
                     className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl ${selectedStudents.length > 0 ? 'bg-white text-black hover:scale-[1.01] active:scale-95' : 'bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'}`}
                   >
                    Asignar Contenido a {selectedStudents.length} {selectedStudents.length === 1 ? 'Alumno' : 'Alumnos'}
                   </button>
                </section>

                {/* Feedback Tracker */}
                <section className="space-y-8 pt-10 border-t border-white/5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-zinc-400">
                          <Activity size={18} strokeWidth={3} className="text-primary" />
                          <h4 className="text-xs font-black uppercase tracking-[0.4em]">Seguimiento de Progreso</h4>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {block.Assignments?.map(asgn => (
                        <div key={asgn.id} className="bg-surface-glass/10 p-8 rounded-[2.5rem] space-y-6 border border-white/5 shadow-2xl hover:border-white/10 transition-all">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">
                                        {asgn.User.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-lg text-white italic uppercase tracking-tight">{asgn.User.username}</p>
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Estado: Activo</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg ${asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-background animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {asgn.Replies?.some(r => !r.isReadByMaster) ? 'NUEVO MENSAJE' : 'SIN NOVEDAD'}
                                </span>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                {asgn.Replies?.length === 0 ? (
                                    <div className="py-10 text-center opacity-20">
                                        <MessageSquare size={32} className="mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Aún no hay interacciones</p>
                                    </div>
                                ) : (
                                    asgn.Replies?.map((r, i) => (
                                        <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-4 rounded-2xl text-xs md:text-sm max-w-[90%] shadow-xl ${r.userId === user.id ? 'bg-primary/20 text-primary border border-primary/20 rounded-tr-none' : 'bg-zinc-800/80 text-zinc-300 rounded-tl-none'}`}>
                                                {r.content}
                                                <div className={`mt-2 text-[8px] font-black uppercase opacity-40 text-right`}>
                                                    {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex items-end gap-3 bg-black/40 p-3 rounded-[2rem] border border-white/5 focus-within:border-primary/30 transition-all shadow-inner">
                                <textarea
                                    rows="1"
                                    placeholder="Escribe tu feedback maestro..."
                                    className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-white resize-none placeholder:text-zinc-700"
                                    value={profesorReply[asgn.id] || ''} onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                                    onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleProfesorReply(asgn.id))}
                                />
                                <button
                                    onClick={() => handleProfesorReply(asgn.id)}
                                    className="bg-primary text-background p-4 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    <Send size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                      ))}
                      {block.Assignments?.length === 0 && (
                          <div className="col-span-full py-16 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/5">
                              <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Esta clase aún no ha sido asignada a ningún alumno</p>
                          </div>
                      )}
                   </div>
                </section>
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && !isCreating && (
            <div className="py-40 text-center space-y-8 bg-surface-glass/10 rounded-[3rem] border border-dashed border-white/10 opacity-50">
                <GraduationCap size={80} className="mx-auto text-zinc-800" strokeWidth={1} />
                <div className="space-y-2">
                    <h3 className="text-3xl font-black text-zinc-700 uppercase italic tracking-tighter">Librería Vacía</h3>
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Comienza creando tu primera clase maestra</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-10 py-4 bg-zinc-900 hover:bg-primary hover:text-background rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500"
                >
                    Crear Clase Ahora
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

// Fallback icons
const Activity = ({ size, className, strokeWidth }) => <Users size={size} className={className} strokeWidth={strokeWidth} />;
const Heart = ({ size, className }) => <Star size={size} className={className} />;

export default AdminClassesView;
