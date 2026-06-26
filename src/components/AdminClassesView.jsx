import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Upload, Plus, Users, Play, Send, Trash2, Eye, GraduationCap, Clock, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
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
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card p-8 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary text-black rounded shadow-lg">
                <Eye size={24} />
            </div>
            <div>
                <span className="label-luxury !text-[8px]">Previsualización</span>
                <h2 className="font-sora text-2xl md:text-3xl font-bold text-white italic uppercase tracking-tighter leading-none">Vista de Alumno</h2>
            </div>
          </div>
          <button
            onClick={() => setViewAsStudent(false)}
            className="btn-secondary !py-2 !px-6 !text-[10px]"
          >
            Cerrar Vista Previa
          </button>
        </header>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-12">
        <div className="space-y-4">
          <span className="label-luxury">Curriculm & Contenido</span>
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold text-white italic uppercase tracking-tighter leading-none">Librería de <span className="text-primary">Clases</span></h2>
          <p className="font-sora text-zinc-500 text-lg font-light">Diseña y asigna módulos de entrenamiento personalizados.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setViewAsStudent(true)}
            className="btn-secondary !p-4 !rounded"
            title="Ver como alumno"
          >
            <Eye size={24} />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`btn-primary flex items-center gap-3 !px-8 ${isCreating ? '!bg-none !border-red-500/50 !text-red-500' : ''}`}
          >
            {isCreating ? <Trash2 size={18} /> : <Plus size={18} />}
            <span>{isCreating ? 'Cancelar' : 'Nueva Clase'}</span>
          </button>
        </div>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="glass-card p-8 md:p-12 space-y-10 animate-in slide-in-from-top-10 duration-500">
          <div className="space-y-8">
              <div className="space-y-3">
                <label className="label-luxury !text-[9px] !text-zinc-500">Título de la Clase</label>
                <input
                    required placeholder="Ej: Fundamentos de Bachata Sensual I"
                    value={newBlock.title}
                    onChange={e => setNewBlock({...newBlock, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="label-luxury !text-[9px] !text-zinc-500">Instrucciones y Objetivos</label>
                <textarea
                    placeholder="Describe lo que el alumno debe practicar..."
                    className="min-h-[140px]"
                    value={newBlock.description}
                    onChange={e => setNewBlock({...newBlock, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="label-luxury !text-[9px] !text-zinc-500">Nivel</label>
                    <select value={newBlock.level} onChange={e => setNewBlock({...newBlock, level: e.target.value})}>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzado">Avanzado</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="label-luxury !text-[9px] !text-zinc-500">Formato</label>
                    <select value={newBlock.type} onChange={e => setNewBlock({...newBlock, type: e.target.value})}>
                        <option value="video">🎥 Video Feedback</option>
                        <option value="audio">🎙️ Solo Audio</option>
                        <option value="text">📝 Solo Texto</option>
                    </select>
                </div>
              </div>

              <div className="relative">
                <input type="file" className="hidden" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])}/>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-4 w-full py-16 border-2 border-dashed border-primary/10 rounded glass-card bg-black/40 text-zinc-500 cursor-pointer hover:border-primary/30 transition-all">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Upload size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                        <p className="font-sora text-lg text-white mb-1">{selectedFile ? selectedFile.name : 'Selecciona el contenido maestro'}</p>
                        <p className="label-luxury !text-[8px] !opacity-40">{selectedFile ? 'Archivo listo' : 'MP4 o MP3 (Max 100MB)'}</p>
                    </div>
                </label>
              </div>
          </div>

          <button className="btn-primary w-full h-16 text-lg">
            Publicar Clase Maestra
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-8 pb-24">
        {blocks.map(block => (
          <div key={block.id} className="glass-card overflow-hidden group transition-all duration-500 hover:border-primary/20">
            <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-black/40">
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-primary/5 rounded border border-primary/10 text-primary group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    {block.type === 'video' ? <Play size={28} fill="currentColor" /> : <MessageSquare size={28} />}
                 </div>
                 <div className="space-y-2">
                    <span className="label-luxury !text-[9px] !text-primary leading-none">{block.level}</span>
                    <h3 className="font-sora text-2xl md:text-3xl font-bold text-white italic uppercase tracking-tighter leading-none">{block.title}</h3>
                    <div className="flex items-center gap-6 label-luxury !text-[8px] !text-zinc-600">
                       <span className="flex items-center gap-2"><Users size={12} /> {block.Assignments?.length || 0} Alumnos</span>
                       <span className="flex items-center gap-2"><Clock size={12} /> {block.type}</span>
                    </div>
                 </div>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`btn-secondary !py-3 !px-8 !text-[10px] ${activeBlockId === block.id ? '!bg-primary !text-black' : ''}`}
              >
                {activeBlockId === block.id ? 'Cerrar Panel' : 'Gestionar'}
              </button>
            </div>

            {activeBlockId === block.id && (
              <div className="p-8 md:p-12 space-y-12 animate-in slide-in-from-top-5 duration-500 bg-black/20 border-t border-primary/10">
                {/* Assignment System */}
                <section className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Plus size={18} className="text-primary" />
                      <span className="label-luxury">Asignar a Alumnos</span>
                   </div>
                   <div className="flex flex-wrap gap-3">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                        className={`px-5 py-3 rounded text-[10px] label-luxury transition-all duration-300 border ${
                            selectedStudents.includes(u.id)
                            ? 'bg-primary border-primary text-black scale-105 shadow-lg'
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
                     className={`btn-primary w-full h-14 !text-[10px] ${selectedStudents.length === 0 ? '!opacity-30' : ''}`}
                   >
                    Asignar a {selectedStudents.length} Alumnos
                   </button>
                </section>

                {/* Feedback Tracker */}
                <section className="space-y-10 pt-12 border-t border-primary/10">
                   <div className="flex items-center gap-3">
                      <MessageSquare size={18} className="text-primary" />
                      <span className="label-luxury">Seguimiento de Feedback</span>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {block.Assignments?.map(asgn => (
                        <div key={asgn.id} className="glass-card p-8 space-y-6 bg-black/40">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary font-bold">
                                        {asgn.User.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-sora font-bold text-lg text-white italic uppercase">{asgn.User.username}</p>
                                        <p className="label-luxury !text-[8px] !text-zinc-600">Estado: Activo</p>
                                    </div>
                                </div>
                                <span className={`label-luxury !text-[8px] px-3 py-1 rounded-full ${asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-black animate-pulse' : 'bg-white/5 text-zinc-600'}`}>
                                    {asgn.Replies?.some(r => !r.isReadByMaster) ? 'NUEVO' : 'VISTO'}
                                </span>
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                {asgn.Replies?.length === 0 ? (
                                    <div className="py-12 text-center opacity-30">
                                        <p className="label-luxury !text-[10px]">Sin interacciones aún</p>
                                    </div>
                                ) : (
                                    asgn.Replies?.map((r, i) => (
                                        <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-4 rounded text-sm max-w-[90%] ${r.userId === user.id ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-white/5 text-zinc-300'}`}>
                                                {r.content}
                                                <div className="mt-2 label-luxury !text-[7px] !text-zinc-600 text-right">
                                                    {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex items-end gap-3 bg-black rounded p-3 border border-primary/10 focus-within:border-primary/40 transition-all">
                                <textarea
                                    rows="1"
                                    placeholder="Feedback maestro..."
                                    className="flex-1 !bg-transparent !p-2 !text-sm !border-none"
                                    value={profesorReply[asgn.id] || ''} onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                                />
                                <button
                                    onClick={() => handleProfesorReply(asgn.id)}
                                    className="btn-primary !p-3 !rounded !h-auto"
                                >
                                    <Send size={16} strokeWidth={3} />
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
