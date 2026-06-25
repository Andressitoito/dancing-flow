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
        <header className="flex justify-between items-center p-4 bg-zinc-950 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <Eye className="text-primary" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-tight text-white">Vista Previa Alumno</h2>
          </div>
          <button
            onClick={() => setViewAsStudent(false)}
            className="text-[10px] font-black uppercase text-zinc-500 hover:text-white"
          >
            Volver
          </button>
        </header>
        <StudentTrainingView isAdminPreview={true} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Gestión de Clases</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewAsStudent(true)}
            className="p-2 bg-zinc-900 text-zinc-400 rounded-lg hover:text-white border border-white/5"
            title="Ver como alumno"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`p-2 rounded-lg transition-all border ${isCreating ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary text-black border-primary'}`}
          >
            {isCreating ? <Trash2 size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="card space-y-4 animate-in slide-in-from-top-4 duration-300">
          <input
            required placeholder="Título de la clase"
            className="w-full"
            value={newBlock.title}
            onChange={e => setNewBlock({...newBlock, title: e.target.value})}
          />
          <textarea
            placeholder="Instrucciones para el alumno..."
            className="w-full min-h-[80px]"
            value={newBlock.description}
            onChange={e => setNewBlock({...newBlock, description: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-3">
            <select className="w-full" value={newBlock.level} onChange={e => setNewBlock({...newBlock, level: e.target.value})}>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <select className="w-full" value={newBlock.type} onChange={e => setNewBlock({...newBlock, type: e.target.value})}>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="text">Texto</option>
            </select>
          </div>
          <div className="relative">
            <input type="file" className="hidden" id="file-upload" onChange={e => setSelectedFile(e.target.files[0])}/>
            <label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-white/5 rounded-xl text-zinc-500 cursor-pointer hover:border-primary/50 text-sm">
              <Upload size={16} /> {selectedFile ? selectedFile.name : 'Subir archivo'}
            </label>
          </div>
          <button className="btn-primary w-full">Crear Clase</button>
        </form>
      )}

      <div className="grid gap-3">
        {blocks.map(block => (
          <div key={block.id} className="card !p-0 overflow-hidden group">
            <div className="p-4 flex items-center justify-between bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-all">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-white">{block.title}</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{block.level} · {block.type}</p>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${activeBlockId === block.id ? 'bg-primary text-black' : 'text-primary bg-primary/5 hover:bg-primary/10'}`}
              >
                {activeBlockId === block.id ? 'Cerrar' : 'Feedback'}
              </button>
            </div>

            {activeBlockId === block.id && (
              <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-300">
                {/* Assignment */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Asignar Alumnos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {users.filter(u => u.role === 'alumno').map(u => (
                      <button key={u.id} onClick={() => setSelectedStudents(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${selectedStudents.includes(u.id) ? 'bg-primary border-primary text-black' : 'border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                      >
                        {u.username}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleAssign(block.id)} disabled={selectedStudents.length === 0} className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedStudents.length > 0 ? 'bg-zinc-100 text-black' : 'bg-zinc-800 text-zinc-600'}`}>
                    Confirmar ({selectedStudents.length})
                  </button>
                </div>

                {/* Feedback Tracker */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                   {block.Assignments?.map(asgn => (
                     <div key={asgn.id} className="bg-zinc-950 p-4 rounded-xl space-y-3 border border-white/5">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs flex items-center gap-2 text-white"><Users size={12} className="text-primary" /> {asgn.User.username}</p>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                            {asgn.Replies?.some(r => !r.isReadByMaster) ? 'NUEVO' : 'OK'}
                          </span>
                        </div>

                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                          {asgn.Replies?.map((r, i) => (
                            <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                               <div className={`p-2 rounded-lg text-[11px] max-w-[85%] ${r.userId === user.id ? 'bg-primary/5 text-primary border border-primary/20' : 'bg-zinc-800 text-zinc-300'}`}>
                                 {r.content}
                               </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5 focus-within:border-primary/40 transition-all">
                           <input
                             placeholder="Feedback..." className="flex-1 bg-transparent px-2 py-1.5 text-[11px] outline-none text-white"
                             value={profesorReply[asgn.id] || ''} onChange={e => setProfesorReply({ ...profesorReply, [asgn.id]: e.target.value })}
                             onKeyPress={e => e.key === 'Enter' && handleProfesorReply(asgn.id)}
                           />
                           <button onClick={() => handleProfesorReply(asgn.id)} className="bg-primary text-black p-1.5 rounded-md"><Send size={12} /></button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClassesView;
