import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Upload, Plus, Users, Play, Mic, Send, Trash2, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
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
      <div className="space-y-4 animate-in fade-in duration-500">
        <header className="flex justify-between items-center px-1">
          <h2 className="text-lg font-black text-primary uppercase flex items-center gap-2">
            <Eye className="text-zinc-400" size={18} />
            Vista Previa Alumno
          </h2>
          <button
            onClick={() => setViewAsStudent(false)}
            className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <EyeOff size={14} />
            Volver a Gestión
          </button>
        </header>
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4">
          <p className="text-[10px] text-primary font-bold text-center uppercase tracking-widest">
            Estás visualizando las clases como si fueras un alumno. Para asignar o editar, vuelve al panel de gestión.
          </p>
        </div>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <h2 className="text-lg font-black text-primary uppercase leading-tight">Gestión de Clases</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Administra bloques y feedback</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewAsStudent(true)}
            className="bg-zinc-800 text-white p-2 rounded-lg shadow-lg hover:bg-zinc-700 transition-all flex items-center gap-2"
            title="Ver como alumno"
          >
            <Eye size={18} />
            <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">Ver como alumno</span>
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-primary text-background p-2 rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isCreating ? <Trash2 size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="bg-surface p-5 rounded-2xl border border-outline space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Título</label>
            <input
              required
              placeholder="Ej. Práctica de Básico 1"
              className="w-full bg-background border border-outline rounded-xl p-3 text-xs outline-none focus:border-primary transition-all"
              value={newBlock.title}
              onChange={e => setNewBlock({...newBlock, title: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Descripción</label>
            <textarea
              placeholder="Instrucciones detalladas para el alumno..."
              className="w-full bg-background border border-outline rounded-xl p-3 text-xs outline-none focus:border-primary min-h-[100px] transition-all"
              value={newBlock.description}
              onChange={e => setNewBlock({...newBlock, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nivel</label>
              <select
                className="w-full bg-background border border-outline rounded-xl p-3 text-xs outline-none"
                value={newBlock.level}
                onChange={e => setNewBlock({...newBlock, level: e.target.value})}
              >
                <option value="principiante">Principiante</option>
                <option value="pre-intermedio">Pre-Intermedio</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tipo de Contenido</label>
              <select
                className="w-full bg-background border border-outline rounded-xl p-3 text-xs outline-none"
                value={newBlock.type}
                onChange={e => setNewBlock({...newBlock, type: e.target.value})}
              >
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="text">Solo Texto</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Archivo Multimedia</label>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-outline rounded-xl text-zinc-500 cursor-pointer hover:border-primary hover:text-primary transition-all text-xs"
            >
              <Upload size={18} />
              {selectedFile ? (
                <span className="text-primary font-bold">{selectedFile.name}</span>
              ) : (
                'Subir Video o Audio de Referencia'
              )}
            </label>
          </div>
          <button className="w-full bg-primary text-background font-black py-3 rounded-xl uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
            Crear Bloque de Estudio
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {blocks.map(block => (
          <div key={block.id} className="bg-surface rounded-2xl border border-outline overflow-hidden shadow-md group">
            <div className="p-4 border-b border-outline flex justify-between items-center bg-background/20 group-hover:bg-background/40 transition-all">
              <div>
                <h3 className="font-bold text-sm leading-tight text-white">{block.title}</h3>
                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-wider">{block.level} · {block.type}</p>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
                  activeBlockId === block.id ? 'bg-primary text-background' : 'bg-primary/10 text-primary'
                }`}
              >
                {activeBlockId === block.id ? 'Cerrar' : 'Feedback y Asignación'}
              </button>
            </div>

            {activeBlockId === block.id ? (
              <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Assignment Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Asignar a Alumnos</h4>
                    <span className="text-[9px] text-zinc-500 font-bold">{selectedStudents.length} seleccionados</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-background/40 rounded-xl border border-outline">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev =>
                          prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                        )}
                        className={`text-[9px] font-bold px-3 py-1 rounded-lg border transition-all ${
                          selectedStudents.includes(u.id) ? 'bg-primary border-primary text-background' : 'border-outline text-zinc-400 hover:border-zinc-500'
                        }`}
                      >
                        {u.username}
                      </button>
                    ))}
                    {users.filter(u => u.role === 'alumno').length === 0 && (
                      <p className="text-[10px] text-zinc-500 italic">No hay alumnos registrados para asignar.</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAssign(block.id)}
                    disabled={selectedStudents.length === 0}
                    className={`w-full font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all ${
                      selectedStudents.length > 0 ? 'bg-zinc-100 text-black hover:bg-white' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Confirmar Asignación
                  </button>
                </div>

                {/* Feedback Tracker */}
                <div className="space-y-4 border-t border-outline pt-6">
                   <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Seguimiento de Alumnos</h4>
                   <div className="grid grid-cols-1 gap-4">
                     {block.Assignments?.map(asgn => (
                       <div key={asgn.id} className="bg-background/60 border border-outline rounded-2xl p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-[12px] flex items-center gap-2 text-white">
                              <Users size={14} className="text-primary" />
                              {asgn.User.username}
                            </p>
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${
                               asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-background animate-pulse shadow-lg shadow-primary/40' : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              {asgn.Replies?.some(r => !r.isReadByMaster) ? 'Nueva Réplica' : 'Sin pendientes'}
                            </span>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto px-1 custom-scrollbar">
                            {asgn.Replies?.map((r, i) => (
                              <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`p-2.5 rounded-2xl text-[11px] max-w-[85%] ${
                                   r.userId === user.id ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-zinc-800 text-zinc-300'
                                 }`}>
                                   {r.content}
                                   {r.type === 'video' && <div className="mt-2 text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1"><Play size={10}/> Video adjunto</div>}
                                 </div>
                              </div>
                            ))}
                            {(!asgn.Replies || asgn.Replies.length === 0) && (
                              <p className="text-[10px] text-zinc-600 text-center italic py-2">No hay actividad aún.</p>
                            )}
                          </div>

                          <div className="flex gap-2 bg-background p-1 rounded-xl border border-outline focus-within:border-primary transition-all">
                             <input
                               placeholder="Escribir feedback para el alumno..."
                               className="flex-1 bg-transparent px-3 py-2 text-[11px] outline-none text-white"
                               value={profesorReply[asgn.id] || ''}
                               onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                               onKeyPress={e => e.key === 'Enter' && handleProfesorReply(asgn.id)}
                             />
                             <button
                               onClick={() => handleProfesorReply(asgn.id)}
                               className="bg-primary text-background p-2 rounded-lg hover:brightness-110 active:scale-95 transition-all"
                             >
                               <Send size={14} />
                             </button>
                          </div>
                       </div>
                     ))}
                     {(!block.Assignments || block.Assignments.length === 0) && (
                       <p className="text-[11px] text-zinc-500 text-center py-4 bg-background/20 rounded-xl border border-dashed border-outline">
                         Esta clase aún no ha sido asignada a ningún alumno.
                       </p>
                     )}
                   </div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      {block.Assignments?.slice(0, 4).map((asgn, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-surface flex items-center justify-center text-[8px] font-black text-zinc-400">
                          {asgn.User.username[0].toUpperCase()}
                        </div>
                      ))}
                      {block.Assignments?.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary border-2 border-surface flex items-center justify-center text-[8px] font-black">
                          +{block.Assignments.length - 4}
                        </div>
                      )}
                      {( !block.Assignments || block.Assignments.length === 0) && (
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-outline flex items-center justify-center">
                          <Users size={10} className="text-zinc-700" />
                        </div>
                      )}
                   </div>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                     {block.Assignments?.length || 0} Alumnos
                   </p>
                 </div>
                 <div className="flex gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter">Nivel Requerido</span>
                      <span className="text-[10px] text-zinc-400 font-bold">{block.level}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter">Tipo Contenido</span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">{block.type}</span>
                   </div>
                 </div>
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="py-20 text-center space-y-3 bg-surface/50 rounded-3xl border border-dashed border-outline">
            <GraduationCap className="mx-auto text-zinc-700" size={48} />
            <p className="text-zinc-500 font-bold text-sm">No has creado ninguna clase todavía.</p>
            <button onClick={() => setIsCreating(true)} className="text-primary text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Empezar a Crear</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClassesView;
