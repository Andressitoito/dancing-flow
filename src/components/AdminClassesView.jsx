import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-primary text-black rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 kinetic-skew">
                <span className="material-symbols-outlined !text-[28px] font-black">visibility</span>
            </div>
            <div>
                <span className="font-sora text-[10px] font-black text-zinc-500 uppercase tracking-widest">Previsualización en tiempo real</span>
                <h2 className="font-sora text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none mt-1">Vista de Alumno</h2>
            </div>
          </div>
          <button
            onClick={() => setViewAsStudent(false)}
            className="btn-secondary !py-3 !px-8 !text-[10px] font-black uppercase tracking-widest rounded-xl border-white/10"
          >
            Cerrar Vista Previa
          </button>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <StudentTrainingView isAdminPreview={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-10">
        <div>
          <span className="label-luxury !text-[10px] !text-primary !mb-2 uppercase tracking-[0.2em] font-black">Content Management</span>
          <h2 className="font-sora text-[40px] md:text-[60px] font-extrabold text-white italic uppercase tracking-tighter mt-1 leading-[0.9]">
            LIBRERÍA DE <span className="text-primary">CLASES</span>
          </h2>
          <p className="font-sora text-zinc-500 text-sm md:text-base font-light mt-4 max-w-xl">
            Diseña trayectorias de aprendizaje y asigna módulos de entrenamiento técnico a tus alumnos.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewAsStudent(true)}
            className="w-14 h-14 rounded-2xl bg-surface-container border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary transition-all duration-500 hover:scale-110 shadow-xl"
            title="Vista de Alumno"
          >
            <span className="material-symbols-outlined !text-[24px]">visibility</span>
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`btn-primary !h-14 !px-8 !text-[10px] font-black uppercase tracking-widest kinetic-skew shadow-[0_0_20px_rgba(212,175,55,0.2)] ${isCreating ? '!bg-red-500/10 !border-red-500/50 !text-red-500' : ''}`}
          >
            <span className="material-symbols-outlined !text-[20px]">{isCreating ? 'close' : 'add'}</span>
            <span className="ml-2">{isCreating ? 'CANCELAR' : 'CREAR CLASE'}</span>
          </button>
        </div>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="bg-surface-container rounded-[2.5rem] p-8 md:p-12 space-y-10 border border-white/10 shadow-2xl animate-in slide-in-from-top-6 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
             <span className="material-symbols-outlined !text-[140px]">edit_note</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="font-sora text-[10px] font-black text-zinc-500 tracking-widest uppercase">Título del Módulo</label>
                    <input
                        required placeholder="Ej: Disociación y Fluidez Avanzada"
                        className="h-14 text-base bg-black/40 border-white/10 rounded-2xl focus:border-primary transition-all px-6 italic font-bold"
                        value={newBlock.title}
                        onChange={e => setNewBlock({...newBlock, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-sora text-[10px] font-black text-zinc-500 tracking-widest uppercase">Guía de Entrenamiento</label>
                    <textarea
                        placeholder="Detalla los ejercicios y focos técnicos de esta clase..."
                        className="min-h-[160px] text-base bg-black/40 border-white/10 rounded-2xl focus:border-primary transition-all p-6 resize-none italic font-light leading-relaxed"
                        value={newBlock.description}
                        onChange={e => setNewBlock({...newBlock, description: e.target.value})}
                    />
                  </div>
              </div>

              <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="font-sora text-[10px] font-black text-zinc-500 tracking-widest uppercase">Nivel Técnico</label>
                        <select className="h-14 text-sm bg-black/40 border-white/10 rounded-2xl focus:border-primary transition-all px-6 font-bold uppercase" value={newBlock.level} onChange={e => setNewBlock({...newBlock, level: e.target.value})}>
                            <option value="principiante">Principiante</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="font-sora text-[10px] font-black text-zinc-500 tracking-widest uppercase">Tipo de Entrega</label>
                        <select className="h-14 text-sm bg-black/40 border-white/10 rounded-2xl focus:border-primary transition-all px-6 font-bold uppercase" value={newBlock.type} onChange={e => setNewBlock({...newBlock, type: e.target.value})}>
                            <option value="video">🎥 Video Feedback</option>
                            <option value="audio">🎙️ Podcast Técnico</option>
                            <option value="text">📝 Guía Teórica</option>
                        </select>
                    </div>
                  </div>

                  <div className="relative">
                    <input type="file" className="hidden" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])}/>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-4 w-full py-12 border-2 border-dashed border-white/10 rounded-[2rem] bg-black/20 text-zinc-500 cursor-pointer hover:border-primary/40 hover:bg-black/40 transition-all duration-500 group/file">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover/file:scale-110 transition-transform">
                            <span className="material-symbols-outlined !text-[32px]">cloud_upload</span>
                        </div>
                        <div className="text-center">
                            <p className="font-sora text-base text-white mb-1 italic font-bold">{selectedFile ? selectedFile.name : 'Subir Contenido Maestro'}</p>
                            <p className="font-sora text-[10px] font-black text-zinc-600 uppercase tracking-widest">{selectedFile ? 'CONTENIDO CARGADO' : 'MP4, MOV o MP3 (MAX 100MB)'}</p>
                        </div>
                    </label>
                  </div>

                  <button className="btn-primary w-full h-16 text-[12px] font-black uppercase tracking-[0.3em] kinetic-skew shadow-2xl">
                    Publicar Módulo en la Academia
                  </button>
              </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-8 pb-20">
        {blocks.map(block => (
          <div key={block.id} className="bg-surface-container rounded-[2.5rem] overflow-hidden group transition-all duration-500 border border-white/5 hover:border-white/10 shadow-2xl relative">
            <div className="p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 bg-black/40 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                    <span className="material-symbols-outlined !text-[32px]">
                      {block.type === 'video' ? 'play_circle' : 'auto_stories'}
                    </span>
                 </div>
                 <div className="space-y-2">
                    <span className="bg-primary/10 text-primary text-[10px] font-black italic px-3 py-1 rounded border border-primary/20 uppercase tracking-tighter">{block.level}</span>
                    <h3 className="font-sora text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{block.title}</h3>
                    <div className="flex items-center gap-6 font-sora text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">
                       <span className="flex items-center gap-2 italic"><span className="material-symbols-outlined !text-[16px]">group</span> {block.Assignments?.length || 0} ESTUDIANTES</span>
                       <span className="flex items-center gap-2 italic"><span className="material-symbols-outlined !text-[16px]">category</span> {block.type}</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`group/btn h-14 px-10 rounded-2xl font-sora text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 ${activeBlockId === block.id ? 'bg-primary text-black kinetic-skew shadow-xl' : 'bg-black/40 text-zinc-500 hover:text-white border border-white/10'}`}
              >
                {activeBlockId === block.id ? 'CERRAR PANEL' : 'GESTIONAR MÓDULO'}
                <span className={`material-symbols-outlined !text-[18px] transition-transform duration-500 ${activeBlockId === block.id ? 'rotate-180' : 'group-hover/btn:translate-x-1'}`}>expand_more</span>
              </button>
            </div>

            {activeBlockId === block.id && (
              <div className="p-8 md:p-12 space-y-12 animate-in slide-in-from-top-6 duration-500 bg-black/20 border-t border-white/5">
                {/* Assignment System */}
                <section className="space-y-8">
                   <div className="flex items-center gap-4 text-primary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined !text-[20px]">person_add</span>
                      </div>
                      <span className="font-sora text-sm font-black uppercase tracking-widest italic">Inscribir Alumnos</span>
                   </div>
                   <div className="flex flex-wrap gap-3">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                        className={`px-5 py-3 rounded-xl font-sora text-[10px] font-black italic uppercase transition-all duration-300 border-2 ${
                            selectedStudents.includes(u.id)
                            ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20'
                            : 'border-white/5 bg-black/40 text-zinc-600 hover:border-primary/40 hover:text-white'
                        }`}
                      >
                        {u.username}
                      </button>
                    ))}
                   </div>
                   <button
                     onClick={() => handleAssign(block.id)}
                     disabled={selectedStudents.length === 0}
                     className={`btn-primary w-full h-14 !text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl ${selectedStudents.length === 0 ? '!opacity-10 grayscale' : ''}`}
                   >
                    CONFIRMAR INSCRIPCIÓN DE {selectedStudents.length} ALUMNOS
                   </button>
                </section>

                {/* Feedback Tracker */}
                <section className="space-y-8 pt-12 border-t border-white/10">
                   <div className="flex items-center gap-4 text-primary">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined !text-[20px]">forum</span>
                      </div>
                      <span className="font-sora text-sm font-black uppercase tracking-widest italic">Monitor de Evolución</span>
                   </div>

                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {block.Assignments?.map(asgn => (
                        <div key={asgn.id} className="bg-surface-container rounded-[2rem] p-8 space-y-6 border border-white/10 shadow-xl group/asgn hover:border-primary/20 transition-all duration-500">
                            <div className="flex justify-between items-center pb-5 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center text-primary font-black italic border border-white/10 group-hover/asgn:border-primary/40 transition-all">
                                        {asgn.User.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-sora font-black text-xl text-white italic uppercase tracking-tighter leading-none group-hover/asgn:text-primary transition-colors">{asgn.User.username}</p>
                                        <p className="font-sora text-label-sm text-zinc-600 font-black tracking-widest uppercase mt-2">Seguimiento Activo</p>
                                    </div>
                                </div>
                                <div className={`h-8 px-4 flex items-center rounded-full font-sora text-label-sm font-black italic uppercase tracking-tighter ${asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-black shadow-lg animate-pulse' : 'bg-black/40 text-zinc-700 border border-white/5'}`}>
                                    {asgn.Replies?.some(r => !r.isReadByMaster) ? 'NUEVO MENSAJE' : 'SIN NOVEDAD'}
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-4 custom-scrollbar bg-black/20 p-4 rounded-2xl border border-white/5">
                                {asgn.Replies?.length === 0 ? (
                                    <div className="py-12 text-center opacity-10">
                                        <span className="material-symbols-outlined !text-[32px] mb-2">pending</span>
                                        <p className="font-sora text-[10px] font-black uppercase italic tracking-widest">Esperando primer envío</p>
                                    </div>
                                ) : (
                                    asgn.Replies?.map((r, i) => (
                                        <div key={i} className={`flex flex-col ${r.userId === user.id ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-4 rounded-2xl text-sm max-w-[90%] shadow-lg ${r.userId === user.id ? 'bg-primary/10 border border-primary/20 text-primary rounded-tr-none' : 'bg-surface-bright border border-white/10 text-zinc-300 rounded-tl-none'}`}>
                                                <p className="tracking-tight leading-relaxed">{r.content}</p>
                                                <div className="mt-2 flex items-center justify-between gap-4 font-sora text-label-sm font-black italic opacity-40 uppercase tracking-widest">
                                                    <span>{r.userId === user.id ? 'YO' : 'ALUMNO'}</span>
                                                    <span>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex items-end gap-3 bg-black/60 rounded-2xl p-3 border border-white/10 focus-within:border-primary/40 transition-all shadow-inner">
                                <textarea
                                    rows="1"
                                    placeholder="Enviar corrección técnica o feedback..."
                                    className="flex-1 !bg-transparent !p-2 !text-sm !border-none !text-white placeholder:text-zinc-800 resize-none font-light italic"
                                    value={profesorReply[asgn.id] || ''} onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleProfesorReply(asgn.id)}
                                    className="w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    <span className="material-symbols-outlined !text-[20px] font-black">send</span>
                                </button>
                            </div>
                        </div>
                      ))}
                   </div>
                </section>
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
            <div className="py-32 text-center bg-surface-container rounded-[3rem] border-2 border-dashed border-white/5 opacity-40">
                <span className="material-symbols-outlined !text-[64px] mb-4">folder_off</span>
                <h3 className="font-sora text-xl font-black italic uppercase">Librería Vacía</h3>
                <p className="font-sora text-sm mt-2 uppercase tracking-widest font-black">Comienza creando tu primer bloque de entrenamiento</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminClassesView;
