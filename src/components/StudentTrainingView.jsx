import React, { useEffect, useState, useRef } from 'react';
import useStore from '../store/useStore';
import { Play, MessageCircle, Mic, Video, Send, ChevronRight, Clock, User } from 'lucide-react';
import Swal from 'sweetalert2';

const StudentTrainingView = () => {
  const { user, assignments, fetchAssignments, postReply } = useStore();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAssignment?.Replies]);

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    await postReply(selectedAssignment.id, replyContent);
    setReplyContent('');
    // Re-fetch or update local state if needed, although store handles it via socket
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${window.location.origin}/${path}`;
  };

  return (
    <div className="max-container flex flex-col lg:flex-row h-[calc(100vh-160px)] gap-6">
      {/* Sidebar: Assignments List */}
      <aside className="lg:w-1/3 flex flex-col gap-6">
        <header>
          <span className="font-sora text-[10px] text-primary mb-2 block uppercase tracking-[0.4em] font-bold">MI EVOLUCIÓN</span>
          <h2 className="font-sora text-3xl italic font-black text-on-surface uppercase tracking-tighter">Entrenamiento</h2>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {assignments.length === 0 ? (
            <div className="glass-card p-10 rounded-2xl text-center">
              <p className="font-inter text-on-surface-variant text-sm italic">Aún no tienes bloques de estudio asignados. Tu mentor lo hará pronto.</p>
            </div>
          ) : (
            assignments.map((asgn) => (
              <div
                key={asgn.id}
                onClick={() => setSelectedAssignment(asgn)}
                className={`glass-card p-6 rounded-2xl cursor-pointer transition-all border ${
                  selectedAssignment?.id === asgn.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-white/10 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-sora text-[10px] text-primary uppercase tracking-widest font-black italic">
                    Bloque #{asgn.StudyBlock?.id || '?' }
                  </span>
                  <span className={`font-sora text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    asgn.status === 'completado' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'
                  }`}>
                    {asgn.status}
                  </span>
                </div>
                <h3 className="font-sora text-lg text-on-surface font-bold mb-2 uppercase italic">{asgn.StudyBlock?.title}</h3>
                <div className="flex items-center gap-4 text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span className="font-inter text-[10px] uppercase font-bold tracking-widest">{asgn.StudyBlock?.duration || '15 min'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    <span className="font-inter text-[10px] uppercase font-bold tracking-widest">{asgn.Replies?.length || 0} Feedback</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content: Study Block Detail & Interaction */}
      <main className="lg:w-2/3 flex flex-col gap-6 h-full">
        {selectedAssignment ? (
          <>
            {/* Video Player / Instructions */}
            <div className="glass-card rounded-2xl overflow-hidden aspect-video relative group">
              {selectedAssignment.StudyBlock?.videoUrl ? (
                <video
                  src={getMediaUrl(selectedAssignment.StudyBlock.videoUrl)}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-background/50">
                   <Play size={64} className="text-primary/20 mb-4" />
                   <p className="font-sora text-sm text-on-surface-variant uppercase tracking-widest font-bold">Contenido no disponible</p>
                </div>
              )}
              <div className="absolute top-6 left-6 z-10">
                 <h2 className="font-sora text-2xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg">
                    {selectedAssignment.StudyBlock?.title}
                 </h2>
              </div>
            </div>

            {/* Interaction / Feedback Section */}
            <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden border-white/5">
               <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-sora text-xs font-black text-primary uppercase tracking-[0.2em] italic">Canal de Feedback Directo</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-sora text-[10px] text-on-surface-variant uppercase tracking-widest font-bold italic">Mentor Online</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {/* Assignment Instruction Message */}
                  <div className="flex gap-4 max-w-[80%]">
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                        <User size={20} className="text-primary" />
                     </div>
                     <div className="space-y-2">
                        <p className="font-sora text-[10px] text-primary uppercase tracking-widest font-black italic">Instructor</p>
                        <div className="bg-white/5 p-6 rounded-2xl rounded-tl-none border border-white/5">
                           <p className="font-inter text-sm text-on-surface leading-relaxed">
                              {selectedAssignment.StudyBlock?.description || 'En este bloque trabajaremos la técnica de giro y la disociación corporal. Presta atención al peso en el metatarso.'}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Replies */}
                  {selectedAssignment.Replies?.map((reply, i) => (
                    <div key={i} className={`flex gap-4 max-w-[80%] ${reply.User?.role === 'profesor' ? '' : 'ml-auto flex-row-reverse'}`}>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                         reply.User?.role === 'profesor' ? 'bg-primary/20 border-primary/30' : 'bg-white/10 border-white/10'
                       }`}>
                          <User size={20} className={reply.User?.role === 'profesor' ? 'text-primary' : 'text-on-surface-variant'} />
                       </div>
                       <div className={`space-y-2 ${reply.User?.role === 'profesor' ? '' : 'text-right'}`}>
                          <p className={`font-sora text-[10px] uppercase tracking-widest font-black italic ${
                            reply.User?.role === 'profesor' ? 'text-primary' : 'text-on-surface-variant'
                          }`}>
                            {reply.User?.username}
                          </p>
                          <div className={`p-6 rounded-2xl border ${
                            reply.User?.role === 'profesor'
                            ? 'bg-primary/5 border-primary/10 rounded-tl-none'
                            : 'bg-white/5 border-white/5 rounded-tr-none'
                          }`}>
                             <p className="font-inter text-sm text-on-surface leading-relaxed">{reply.content}</p>
                             {reply.videoUrl && (
                               <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                                  <video src={getMediaUrl(reply.videoUrl)} controls className="w-full max-h-[300px]" />
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>

               {/* Input Area */}
               <form onSubmit={handlePostReply} className="p-6 bg-background/50 border-t border-white/5 flex gap-4 items-center">
                  <div className="flex gap-2">
                    <button type="button" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-white/5">
                       <Mic size={20} />
                    </button>
                    <button type="button" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-white/5">
                       <Video size={20} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje o duda técnica..."
                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-6 h-12 text-on-surface placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all font-inter text-sm"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button type="submit" className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                     <Send size={20} />
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 glass-card rounded-2xl flex flex-col items-center justify-center text-center p-20 border-white/5 border-dashed border-2">
             <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-8">
                <Play size={40} className="text-primary/20" />
             </div>
             <h2 className="font-sora text-2xl font-black italic text-on-surface uppercase tracking-tighter mb-4">Selecciona un Bloque</h2>
             <p className="font-inter text-on-surface-variant max-w-sm">Elige una de tus tareas en la lista de la izquierda para comenzar el entrenamiento y el feedback.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentTrainingView;
