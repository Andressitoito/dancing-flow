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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary text-black rounded flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined !text-[24px]">visibility</span>
            </div>
            <div>
                <span className="label-luxury !text-[8px]">Previsualización</span>
                <h2 className="font-sora text-xl md:text-2xl font-bold text-white italic uppercase tracking-tighter leading-none">Vista de Alumno</h2>
            </div>
          </div>
          <button
            onClick={() => setViewAsStudent(false)}
            className="btn-secondary !py-1.5 !px-4 !text-[9px]"
          >
            Cerrar Vista Previa
          </button>
        </header>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="label-luxury !text-[9px]">Curriculum & Contenido</span>
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold text-white italic uppercase tracking-tighter mt-1 leading-none">Librería de <span className="text-primary">Clases</span></h2>
          <p className="font-sora text-zinc-500 text-sm font-light mt-2">Diseña y asigna módulos de entrenamiento personalizados.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewAsStudent(true)}
            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            title="Ver como alumno"
          >
            <span className="material-symbols-outlined !text-[20px]">visibility</span>
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`btn-primary !px-6 h-10 !text-[9px] ${isCreating ? '!bg-none !border-red-500/30 !text-red-500 !bg-red-500/5' : ''}`}
          >
            <span className="material-symbols-outlined !text-[18px]">{isCreating ? 'close' : 'add'}</span>
            <span>{isCreating ? 'Cancelar' : 'Nueva Clase'}</span>
          </button>
        </div>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="glass-card p-6 md:p-8 space-y-6 border-white/5 bg-white/[0.02] animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-6">
              <div className="space-y-2">
                <label className="label-luxury !text-[8px] !text-zinc-500">Título de la Clase</label>
                <input
                    required placeholder="Ej: Fundamentos de Bachata Sensual I"
                    className="h-10 text-sm"
                    value={newBlock.title}
                    onChange={e => setNewBlock({...newBlock, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="label-luxury !text-[8px] !text-zinc-500">Instrucciones y Objetivos</label>
                <textarea
                    placeholder="Describe lo que el alumno debe practicar..."
                    className="min-h-[100px] text-sm"
                    value={newBlock.description}
                    onChange={e => setNewBlock({...newBlock, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="label-luxury !text-[8px] !text-zinc-500">Nivel</label>
                    <select className="h-10 text-sm" value={newBlock.level} onChange={e => setNewBlock({...newBlock, level: e.target.value})}>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="label-luxury !text-[8px] !text-zinc-500">Formato</label>
                    <select className="h-10 text-sm" value={newBlock.type} onChange={e => setNewBlock({...newBlock, type: e.target.value})}>
                        <option value="video">🎥 Video Feedback</option>
                        <option value="audio">🎙️ Solo Audio</option>
                        <option value="text">📝 Solo Texto</option>
                    </select>
                </div>
              </div>

              <div className="relative">
                <input type="file" className="hidden" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])}/>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-2 w-full py-8 border border-dashed border-white/10 rounded-lg bg-black/40 text-zinc-500 cursor-pointer hover:border-primary/30 transition-all">
                    <span className="material-symbols-outlined text-primary text-[32px]">upload_file</span>
                    <div className="text-center">
                        <p className="font-sora text-sm text-white mb-0.5">{selectedFile ? selectedFile.name : 'Selecciona el contenido maestro'}</p>
                        <p className="label-luxury !text-[7px] !opacity-40">{selectedFile ? 'Archivo listo' : 'MP4 o MP3 (Max 100MB)'}</p>
                    </div>
                </label>
              </div>
          </div>

          <button className="btn-primary w-full h-12 text-sm">
            Publicar Clase Maestra
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 pb-12">
        {blocks.map(block => (
          <div key={block.id} className="glass-card overflow-hidden group transition-all duration-300 border-white/5 bg-white/[0.01] hover:bg-white/[0.02]">
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-[24px]">
                      {block.type === 'video' ? 'play_circle' : 'chat_bubble'}
                    </span>
                 </div>
                 <div className="space-y-1">
                    <span className="label-luxury !text-[8px] !text-primary leading-none uppercase">{block.level}</span>
                    <h3 className="font-sora text-xl md:text-2xl font-bold text-white italic uppercase tracking-tighter leading-none">{block.title}</h3>
                    <div className="flex items-center gap-4 label-luxury !text-[7px] !text-zinc-600">
                       <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-[12px]">group</span> {block.Assignments?.length || 0} Alumnos</span>
                       <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-[12px]">schedule</span> {block.type}</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`btn-secondary !py-2 !px-6 !text-[9px] ${activeBlockId === block.id ? '!bg-primary !text-black' : ''}`}
              >
                {activeBlockId === block.id ? 'Cerrar Panel' : 'Gestionar'}
              </button>
            </div>

            {activeBlockId === block.id && (
              <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-top-2 duration-200 bg-white/[0.01] border-t border-white/5">
                {/* Assignment System */}
                <section className="space-y-6">
                   <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary !text-[18px]">person_add</span>
                      <span className="label-luxury !text-[9px]">Asignar a Alumnos</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                        className={`px-3 py-2 rounded text-[9px] label-luxury transition-all duration-200 border ${
                            selectedStudents.includes(u.id)
                            ? 'bg-primary border-primary text-black'
                            : 'border-white/5 bg-black/40 text-zinc-600 hover:text-white'
                        }`}
                      >
                        {u.username}
                      </button>
                    ))}
                   </div>
                   <button
                     onClick={() => handleAssign(block.id)}
                     disabled={selectedStudents.length === 0}
                     className={`btn-primary w-full h-10 !text-[9px] ${selectedStudents.length === 0 ? '!opacity-20' : ''}`}
                   >
                    Asignar a {selectedStudents.length} Alumnos
                   </button>
                </section>

                {/* Feedback Tracker */}
                <section className="space-y-6 pt-8 border-t border-white/5">
                   <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary !text-[18px]">forum</span>
                      <span className="label-luxury !text-[9px]">Seguimiento de Feedback</span>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {block.Assignments?.map(asgn => (
                        <div key={asgn.id} className="glass-card p-6 space-y-4 bg-white/[0.02] border-white/5 rounded-lg">
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center text-primary font-bold text-xs">
                                        {asgn.User.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-sora font-bold text-sm text-white italic uppercase">{asgn.User.username}</p>
                                        <p className="label-luxury !text-[7px] !text-zinc-600">Estado: Activo</p>
                                    </div>
                                </div>
                                <span className={`label-luxury !text-[7px] px-2 py-0.5 rounded border ${asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary border-primary text-black' : 'border-white/10 text-zinc-600'}`}>
                                    {asgn.Replies?.some(r => !r.isReadByMaster) ? 'NUEVO' : 'VISTO'}
                                </span>
                            </div>

                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {asgn.Replies?.length === 0 ? (
                                    <div className="py-8 text-center opacity-20">
                                        <p className="label-luxury !text-[9px]">Sin interacciones</p>
                                    </div>
                                ) : (
                                    asgn.Replies?.map((r, i) => (
                                        <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-3 rounded text-xs max-w-[85%] ${r.userId === user.id ? 'bg-primary/5 border border-primary/20 text-primary' : 'bg-white/5 text-zinc-300'}`}>
                                                {r.content}
                                                <div className="mt-1.5 label-luxury !text-[6px] !text-zinc-600 text-right">
                                                    {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex items-end gap-2 bg-black/40 rounded p-2 border border-white/5 focus-within:border-primary/20 transition-all">
                                <textarea
                                    rows="1"
                                    placeholder="Feedback maestro..."
                                    className="flex-1 !bg-transparent !p-1.5 !text-xs !border-none"
                                    value={profesorReply[asgn.id] || ''} onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleProfesorReply(asgn.id)}
                                    className="w-8 h-8 bg-primary text-black rounded flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
                                >
                                    <span className="material-symbols-outlined !text-[16px]">send</span>
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
      </div>
    </div>
  );
};

export default AdminClassesView;
