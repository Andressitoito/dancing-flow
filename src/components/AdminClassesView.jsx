import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Upload, Plus, Users, Play, Mic, Send, Trash2, CheckCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../services/constants';
import Swal from 'sweetalert2';

const AdminClassesView = () => {
  const { user, users, fetchInitialData } = useStore();
  const [blocks, setBlocks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBlock, setNewBlock] = useState({
    title: '',
    description: '',
    type: 'video',
    level: 'principiante'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [masterReply, setMasterReply] = useState('');

  const fetchBlocks = async () => {
    const res = await fetch(`${API_BASE_URL}/study/blocks`);
    const data = await res.json();
    setBlocks(data);
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
    formData.append('creatorId', user.id);
    if (selectedFile) formData.append('file', selectedFile);

    const res = await fetch(`${API_BASE_URL}/study/blocks`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      setIsCreating(false);
      setNewBlock({ title: '', description: '', type: 'video', level: 'principiante' });
      setSelectedFile(null);
      fetchBlocks();
      Swal.fire({ title: 'Clase Creada', icon: 'success', background: '#18181b', color: '#fff' });
    }
  };

  const handleAssign = async (blockId) => {
    if (selectedStudents.length === 0) return;
    const res = await fetch(`${API_BASE_URL}/study/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studyBlockId: blockId, userIds: selectedStudents })
    });
    if (res.ok) {
      setSelectedStudents([]);
      fetchBlocks();
      Swal.fire({ title: 'Alumnos Asignados', icon: 'success', background: '#18181b', color: '#fff' });
    }
  };

  const handleMasterReply = async (assignmentId) => {
    if (!masterReply.trim()) return;
    const res = await fetch(`${API_BASE_URL}/study/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignmentId,
        userId: user.id,
        content: masterReply,
        type: 'text'
      })
    });
    if (res.ok) {
      setMasterReply('');
      fetchBlocks();
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black text-primary uppercase">Gestión de Clases</h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-primary text-background p-2 rounded-xl"
        >
          {isCreating ? <Trash2 size={20} /> : <Plus size={20} />}
        </button>
      </header>

      {isCreating && (
        <form onSubmit={handleCreateBlock} className="bg-surface p-4 rounded-3xl border border-outline space-y-4 animate-in fade-in slide-in-from-top-4">
          <input
            required
            placeholder="Título de la clase"
            className="w-full bg-background border border-outline rounded-xl p-3 text-sm outline-none focus:border-primary"
            value={newBlock.title}
            onChange={e => setNewBlock({...newBlock, title: e.target.value})}
          />
          <textarea
            placeholder="Instrucciones o descripción..."
            className="w-full bg-background border border-outline rounded-xl p-3 text-sm outline-none focus:border-primary min-h-[80px]"
            value={newBlock.description}
            onChange={e => setNewBlock({...newBlock, description: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              className="bg-background border border-outline rounded-xl p-3 text-sm outline-none"
              value={newBlock.level}
              onChange={e => setNewBlock({...newBlock, level: e.target.value})}
            >
              <option value="principiante">Principiante</option>
              <option value="pre-intermedio">Pre-Intermedio</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <select
              className="bg-background border border-outline rounded-xl p-3 text-sm outline-none"
              value={newBlock.type}
              onChange={e => setNewBlock({...newBlock, type: e.target.value})}
            >
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="text">Solo Texto</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-outline rounded-xl text-zinc-500 cursor-pointer hover:border-primary hover:text-primary transition-all"
            >
              <Upload size={20} />
              {selectedFile ? selectedFile.name : 'Subir Video/Audio'}
            </label>
          </div>
          <button className="w-full bg-primary text-background font-black py-3 rounded-xl uppercase tracking-widest text-xs">
            Crear Bloque de Estudio
          </button>
        </form>
      )}

      <div className="space-y-4">
        {blocks.map(block => (
          <div key={block.id} className="bg-surface rounded-3xl border border-outline overflow-hidden">
            <div className="p-4 border-b border-outline flex justify-between items-center bg-background/20">
              <div>
                <h3 className="font-bold text-base leading-tight">{block.title}</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-black">{block.level} · {block.type}</p>
              </div>
              <button
                onClick={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
                className="text-primary text-xs font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg"
              >
                {activeBlockId === block.id ? 'Cerrar' : 'Ver Feedback'}
              </button>
            </div>

            {activeBlockId === block.id ? (
              <div className="p-4 space-y-6">
                {/* Assignment Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Asignar a Alumnos</h4>
                  <div className="flex flex-wrap gap-2">
                    {users.filter(u => u.role === 'student').map(u => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedStudents(prev =>
                          prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                        )}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${
                          selectedStudents.includes(u.id) ? 'bg-primary border-primary text-background' : 'border-outline text-zinc-500'
                        }`}
                      >
                        {u.username}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAssign(block.id)}
                    className="w-full bg-zinc-800 text-white font-black py-2 rounded-xl text-[10px] uppercase tracking-widest"
                  >
                    Confirmar Asignación ({selectedStudents.length})
                  </button>
                </div>

                {/* Feedback Tracker */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Seguimiento de Alumnos</h4>
                   {block.Assignments?.map(asgn => (
                     <div key={asgn.id} className="bg-background/40 border border-outline rounded-2xl p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs flex items-center gap-2">
                            <Users size={12} className="text-primary" />
                            {asgn.User.username}
                          </p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                             asgn.Replies?.some(r => !r.isReadByMaster) ? 'bg-primary text-background animate-pulse' : 'bg-zinc-800 text-zinc-500'
                          }`}>
                            {asgn.Replies?.some(r => !r.isReadByMaster) ? 'Nueva Réplica' : 'Sin novedad'}
                          </span>
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto px-1">
                          {asgn.Replies?.map((r, i) => (
                            <div key={i} className={`flex ${r.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                               <div className={`p-2 rounded-xl text-[11px] max-w-[90%] ${
                                 r.userId === user.id ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-zinc-800 text-zinc-300'
                               }`}>
                                 {r.content}
                               </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                           <input
                             placeholder="Responder a este alumno..."
                             className="flex-1 bg-background border border-outline rounded-lg px-3 py-2 text-[11px] outline-none focus:border-primary"
                             value={asgn.id === activeBlockId + '_reply' ? masterReply : ''} // This logic is simplified for the demo
                             onChange={e => setMasterReply(e.target.value)}
                             onKeyPress={e => e.key === 'Enter' && handleMasterReply(asgn.id)}
                           />
                           <button
                             onClick={() => handleMasterReply(asgn.id)}
                             className="bg-primary text-background p-2 rounded-lg"
                           >
                             <Send size={14} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center gap-4">
                 <div className="flex -space-x-2">
                    {block.Assignments?.slice(0, 3).map((asgn, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-surface flex items-center justify-center text-[8px] font-black">
                        {asgn.User.username[0].toUpperCase()}
                      </div>
                    ))}
                    {block.Assignments?.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary border-2 border-surface flex items-center justify-center text-[8px] font-black">
                        +{block.Assignments.length - 3}
                      </div>
                    )}
                 </div>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase">
                   {block.Assignments?.length || 0} Alumnos asignados
                 </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClassesView;
