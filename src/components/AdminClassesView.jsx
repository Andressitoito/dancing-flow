import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Upload, Plus, Users, Play, Mic, Send, Trash2, CheckCircle, Clock, Eye, EyeOff, GraduationCap } from 'lucide-react';
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
        Swal.fire({ title: 'Clase Creada', icon: 'success', background: '#18181b', color: '#fff' });
      }
    } catch (e) {
      Swal.fire({ title: 'Error', text: e.message, icon: 'error' });
    }
  };

  const handleAssign = async (blockId) => {
    if (selectedStudents.length === 0) return;
    try {
      const res = await api.assignBlock(blockId, selectedStudents);
      if (res && !res.error) {
        setSelectedStudents([]);
        fetchBlocks();
        Swal.fire({ title: 'Alumnos Asignados', icon: 'success', background: '#18181b', color: '#fff' });
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
      <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-8 lg:px-0">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-primary uppercase italic tracking-tighter leading-none flex items-center gap-4">
              <Eye className="text-white" size={32} />
              Vista Previa Alumno
            </h2>
            <p className="text-zinc-500 text-lg font-medium mt-3">Estás visualizando las clases como si fueras un alumno.</p>
          </div>
          <button
            onClick={() => setViewAsStudent(false)}
            className="bg-zinc-800 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-700 transition-all z-10 shadow-xl"
          >
            <EyeOff size={20} />
            Volver a Gestión
          </button>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        </header>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-surface p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white italic uppercase leading-none tracking-tighter">Gestión de Clases</h2>
          <p className="text-zinc-500 text-lg font-medium mt-3">Administra bloques de estudio y feedback personalizado.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button
            onClick={() => setViewAsStudent(true)}
            className="bg-zinc-800 text-white p-5 rounded-2xl shadow-xl hover:bg-zinc-700 transition-all flex items-center gap-3 group"
            title="Ver como alumno"
          >
            <Eye size={24} className="group-hover:scale-110 transition-transform" />
            <span className="hidden md:block text-xs font-black uppercase tracking-widest">Ver como alumno</span>
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-primary text-background p-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            {isCreating ? <Trash2 size={24} /> : <Plus size={24} />}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="bg-surface p-10 rounded-[3rem] border border-outline space-y-8 animate-in fade-in slide-in-from-top-6 duration-500 shadow-2xl shadow-black/40">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-4">Título de la clase</label>
            <input
              required
              placeholder="Ej. Práctica de Básico 1: El compás y la acentuación"
              className="w-full bg-background border border-white/10 rounded-[1.5rem] p-5 text-lg outline-none focus:border-primary transition-all shadow-inner"
              value={newBlock.title}
              onChange={e => setNewBlock({...newBlock, title: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-4">Instrucciones Detalladas</label>
            <textarea
              placeholder="Explica qué debe practicar el alumno y en qué debe enfocarse..."
              className="w-full bg-background border border-white/10 rounded-[1.5rem] p-6 text-base outline-none focus:border-primary min-h-[150px] transition-all shadow-inner"
              value={newBlock.description}
              onChange={e => setNewBlock({...newBlock, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-4">Nivel Requerido</label>
              <select
                className="w-full bg-background border border-white/10 rounded-[1.5rem] p-5 text-base outline-none focus:border-primary shadow-inner"
                value={newBlock.level}
                onChange={e => setNewBlock({...newBlock, level: e.target.value})}
              >
                <option value="principiante">Principiante</option>
                <option value="pre-intermedio">Pre-Intermedio</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-4">Formato del Bloque</label>
              <select
                className="w-full bg-background border border-white/10 rounded-[1.5rem] p-5 text-base outline-none focus:border-primary shadow-inner"
                value={newBlock.type}
                onChange={e => setNewBlock({...newBlock, type: e.target.value})}
              >
                <option value="video">Video Interactivo</option>
                <option value="audio">Audio Guía</option>
                <option value="text">Solo Texto / Teoría</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-4">Material Multimedia</label>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-4 w-full p-8 border-2 border-dashed border-white/10 rounded-[2rem] text-zinc-500 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-base"
            >
              <Upload size={28} />
              {selectedFile ? (
                <span className="text-primary font-black uppercase italic tracking-widest">{selectedFile.name}</span>
              ) : (
                'Subir Video o Audio de Referencia'
              )}
            </label>
          </div>
          <button className="w-full bg-primary text-background font-black py-6 rounded-[1.5rem] uppercase tracking-[0.3em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            CREAR BLOQUE DE ESTUDIO
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-8">
        {blocks.map(block => (
          <div key={block.id} className="bg-surface rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group transition-all hover:border-primary/10">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-all">
              <div className="space-y-2">
                <h3 className="font-black text-2xl leading-none text-white italic uppercase tracking-tight">{block.title}</h3>
                <div className="flex gap-4">
                    <p className="text-[10px] text-primary uppercase font-black tracking-widest bg-primary/10 px-3 py-1 rounded-full">{block.level}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest bg-white/5 px-3 py-1 rounded-full">{block.type}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all shadow-xl ${
                  activeBlockId === block.id ? 'bg-primary text-background' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {activeBlockId === block.id ? 'Cerrar Panel' : 'Gestión & Feedback'}
              </button>
            </div>

            {activeBlockId === block.id ? (
              <div className="p-10 space-y-12 animate-in slide-in-from-top-4 duration-500">
                {/* Assignment Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Asignar a Alumnos</h4>
                    <span className="text-xs text-primary font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{selectedStudents.length} seleccionados</span>
                  </div>
                  <div className="flex flex-wrap gap-3 p-8 bg-background rounded-[2rem] border border-white/5 shadow-inner min-h-[120px]">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev =>
                          prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                        )}
                        className={`text-xs font-bold px-6 py-3 rounded-xl border-2 transition-all ${
                          selectedStudents.includes(u.id) ? 'bg-primary border-primary text-background shadow-lg' : 'border-white/5 text-zinc-500 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {u.username}
                      </button>
                    ))}
                    {users.filter(u => u.role === 'alumno').length === 0 && (
                      <div className="w-full flex items-center justify-center py-10 opacity-30 italic">
                        <Users size={24} className="mr-3"/> No hay alumnos disponibles para asignar.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleAssign(block.id)}
                    disabled={selectedStudents.length === 0}
                    className={`w-full font-black py-5 rounded-2xl text-xs uppercase tracking-[0.3em] transition-all shadow-xl ${
                      selectedStudents.length > 0 ? 'bg-white text-black hover:scale-[1.01]' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    CONFIRMAR ASIGNACIONES
                  </button>
                </div>

                {/* Feedback Tracker */}
                <div className="space-y-8 border-t border-white/5 pt-12">
                   <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Seguimiento Individual</h4>
                   <div className="grid grid-cols-1 gap-6">
                     {block.Assignments?.map(asgn => (
                       <div key={asgn.id} className="bg-background rounded-[2.5rem] border border-white/5 p-8 space-y-6 shadow-2xl relative overflow-hidden group/item">
                          <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black italic shadow-inner">
                                    {asgn.User.username[0].toUpperCase()}
                                </div>
                                <p className="font-black text-xl text-white italic uppercase tracking-tight">
                                  {asgn.User.username}
                                </p>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg ${
                               asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-background animate-pulse' : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              {asgn.Replies?.some(r => !r.isReadByMaster) ? 'Nueva Réplica' : 'Sin Pendientes'}
                            </span>
                          </div>

                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10 bg-zinc-950/20 p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                            {asgn.Replies?.map((r, i) => (
                              <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`p-5 rounded-2xl text-base max-w-[85%] shadow-lg ${
                                   r.userId === user.id ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-zinc-800 text-zinc-100'
                                 }`}>
                                   {r.content}
                                   {r.type === 'video' && <div className="mt-3 text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest"><Play size={12}/> Video adjunto del alumno</div>}
                                 </div>
                              </div>
                            ))}
                            {(!asgn.Replies || asgn.Replies.length === 0) && (
                              <p className="text-sm text-zinc-600 text-center italic py-6">No hay actividad registrada en este bloque.</p>
                            )}
                          </div>

                          <div className="flex gap-4 bg-zinc-900 p-2 rounded-[2rem] border border-white/5 focus-within:border-primary/40 transition-all relative z-10 shadow-xl">
                             <input
                               placeholder="Escribir feedback directo para el alumno..."
                               className="flex-1 bg-transparent px-6 py-4 text-base outline-none text-white placeholder:text-zinc-600"
                               value={profesorReply[asgn.id] || ''}
                               onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                               onKeyPress={e => e.key === 'Enter' && handleProfesorReply(asgn.id)}
                             />
                             <button
                               onClick={() => handleProfesorReply(asgn.id)}
                               className="bg-primary text-background p-4 rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-lg"
                             >
                               <Send size={24} />
                             </button>
                          </div>
                          {/* Decorative accent */}
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mb-16 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                       </div>
                     ))}
                     {(!block.Assignments || block.Assignments.length === 0) && (
                       <div className="py-16 bg-background/40 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center space-y-4 text-zinc-600">
                         <Users size={48} className="opacity-20" />
                         <p className="text-lg font-black uppercase tracking-widest italic">Clase sin alumnos asignados</p>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ) : (
              <div className="p-8 flex items-center justify-between bg-zinc-900/10">
                 <div className="flex items-center gap-6">
                   <div className="flex -space-x-3">
                      {block.Assignments?.slice(0, 5).map((asgn, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-4 border-surface flex items-center justify-center text-[10px] font-black text-zinc-400 shadow-md">
                          {asgn.User.username[0].toUpperCase()}
                        </div>
                      ))}
                      {block.Assignments?.length > 5 && (
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary border-4 border-surface flex items-center justify-center text-[10px] font-black shadow-md">
                          +{block.Assignments.length - 5}
                        </div>
                      )}
                      {( !block.Assignments || block.Assignments.length === 0) && (
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-white/5 flex items-center justify-center text-zinc-800">
                          <Users size={16} />
                        </div>
                      )}
                   </div>
                   <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.2em]">
                     {block.Assignments?.length || 0} Alumnos Inscritos
                   </p>
                 </div>
                 <div className="hidden sm:flex gap-8">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Nivel</span>
                      <span className="text-sm text-zinc-400 font-bold uppercase">{block.level}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Contenido</span>
                      <span className="text-sm text-zinc-400 font-bold uppercase">{block.type}</span>
                   </div>
                 </div>
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="py-40 text-center space-y-6 bg-surface/50 rounded-[4rem] border-2 border-dashed border-white/5 shadow-inner flex flex-col items-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="text-zinc-700" size={56} />
            </div>
            <p className="text-zinc-500 font-black text-2xl italic uppercase tracking-tight">Tu catálogo de clases está vacío</p>
            <p className="text-zinc-600 max-w-sm text-lg">Crea tu primer bloque de estudio para empezar a mentorizar a tus alumnos.</p>
            <button onClick={() => setIsCreating(true)} className="text-primary text-xs font-black uppercase tracking-[0.3em] underline decoration-2 underline-offset-8 hover:text-white transition-colors mt-4">EMPEZAR A CREAR AHORA</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClassesView;
