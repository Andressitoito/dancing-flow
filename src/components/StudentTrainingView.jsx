import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Play, Mic, Send, ChevronRight, X, User, MessageSquare, Video, History, Info, GraduationCap, Clock } from 'lucide-react';
import { getMediaUrl } from '../services/constants';
import Swal from 'sweetalert2';

const StudentTrainingView = ({ isAdminPreview = false }) => {
  const { assignments, fetchAssignments, postReply, user } = useStore();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chatEndRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAssignment?.Replies]);

  const handleSendReply = async () => {
    if (isAdminPreview) return;
    if (!replyText.trim() && !audioBlob && !videoFile) return;

    try {
      await postReply(selectedAssignment.id, replyText, audioBlob, videoFile);
      setReplyText('');
      setAudioBlob(null);
      setVideoFile(null);
      fetchAssignments();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        background: '#18181b',
        color: '#fff',
        customClass: { popup: 'rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl bg-surface-glass/90' }
      });
    }
  };

  const startRecording = async () => {
    if (isAdminPreview) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error micro:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const safeAssignments = Array.isArray(assignments) ? assignments : [];

  if (!selectedAssignment) {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        {!isAdminPreview && (
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-4">
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Plan de Estudio</p>
              <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Mis <span className="text-primary">Clases</span></h1>
              <p className="text-zinc-500 text-base font-medium opacity-60">Seguimiento personalizado para tu evolución en Dancing Flow.</p>
            </div>

            <div className="flex items-center gap-6 bg-surface-glass/40 backdrop-blur-2xl px-8 py-6 rounded-3xl border border-white/5 shadow-xl">
               <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{safeAssignments.length}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Módulos</span>
               </div>
               <div className="w-[1px] h-10 bg-white/10" />
               <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-primary">
                    {safeAssignments.filter(a => a.Replies?.length > 0).length}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Activos</span>
               </div>
            </div>
          </header>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeAssignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="group bg-surface-glass/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-primary/40 hover:scale-[1.02] transition-all duration-700 shadow-2xl flex flex-col"
            >
              <div className="aspect-video bg-black/60 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                {asgn.StudyBlock?.type === 'video' ? (
                   <div className="p-5 bg-primary/10 rounded-full text-primary group-hover:scale-125 group-hover:bg-primary group-hover:text-black transition-all duration-700 z-20">
                     <Play size={28} fill="currentColor" strokeWidth={0} />
                   </div>
                ) : (
                  <MessageSquare size={32} className="text-zinc-800 z-20" />
                )}
                <div className="absolute top-6 left-6 z-20 bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20 backdrop-blur-xl">
                  {asgn.StudyBlock?.level}
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{asgn.StudyBlock?.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed font-medium">{asgn.StudyBlock?.description}</p>
              </div>

              <div className="p-8 pt-0 flex items-center justify-between border-t border-white/5 mt-4 pt-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-xl text-zinc-500">
                        <MessageSquare size={14} />
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{asgn.Replies?.length || 0} Mensajes</span>
                 </div>
                 <ChevronRight size={18} className="text-primary translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </button>
          ))}

          {safeAssignments.length === 0 && (
            <div className="col-span-full py-32 text-center bg-surface-glass/10 rounded-[3rem] border border-dashed border-white/5">
              <History size={64} className="mx-auto text-zinc-800 mb-8 opacity-20" />
              <h3 className="text-2xl font-black text-zinc-600 uppercase italic tracking-tight">Esperando nuevas clases</h3>
              <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs mt-2">Tu mentor te asignará contenido pronto</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 md:top-[80px] bottom-[72px] md:bottom-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col md:flex-row animate-in slide-in-from-right duration-500`}>
      {/* Left side: Content & Video */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <header className="p-6 md:p-10 flex items-center justify-between border-b border-white/5 bg-black/40">
          <button onClick={() => setSelectedAssignment(null)} className="p-4 bg-white/5 hover:bg-primary hover:text-black rounded-2xl text-zinc-400 transition-all duration-500">
            <X size={24} strokeWidth={3} />
          </button>
          <div className="text-right space-y-1">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{currentAssignment.StudyBlock?.level}</p>
            <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{currentAssignment.StudyBlock?.title}</h2>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6 md:p-12 gap-10 max-w-5xl mx-auto w-full">
           {currentAssignment.StudyBlock?.type === 'video' && currentAssignment.StudyBlock?.contentUrl && (
             <div className="aspect-video bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                <video src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)} controls className="w-full h-full object-contain" />
             </div>
           )}

           <div className="bg-surface-glass/20 p-8 md:p-12 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
              <div className="flex items-center gap-4 text-primary">
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-widest">Guía de Entrenamiento</h3>
              </div>
              <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-medium italic opacity-90">
                "{currentAssignment.StudyBlock?.description}"
              </p>
           </div>
        </div>
      </div>

      {/* Right side: Mentorship Chat */}
      <div className="w-full md:w-[400px] lg:w-[500px] bg-surface-glass/40 backdrop-blur-3xl flex flex-col border-l border-white/5 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
           <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Mentoria <span className="text-primary">Flow</span></h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Feedback Directo</p>
           </div>
           <div className="p-3 bg-white/5 rounded-2xl text-zinc-500">
               <MessageSquare size={20} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User?.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[95%] p-5 md:p-6 rounded-[2rem] shadow-2xl transition-all duration-500 ${
                reply.User?.role === 'profesor'
                ? 'bg-surface-glass border border-white/10 text-zinc-200 rounded-tl-none'
                : 'bg-primary text-background font-bold rounded-tr-none shadow-primary/20'
              }`}>
                {reply.content && <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <div className="mt-4 bg-black/20 p-2 rounded-2xl border border-white/5">
                        <audio src={getMediaUrl(reply.audioUrl)} controls className={`w-full h-8 ${reply.User?.role === 'profesor' ? 'invert' : ''}`} />
                   </div>
                )}

                {reply.type === 'video' && (
                   <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
                        <video src={getMediaUrl(reply.videoUrl)} controls className="w-full" />
                   </div>
                )}

                <div className={`flex items-center justify-between mt-4 gap-4 text-[10px] font-black uppercase tracking-widest ${reply.User?.role === 'profesor' ? 'text-zinc-500' : 'text-background/60'}`}>
                  <div className="flex items-center gap-2">
                      <User size={10} strokeWidth={4} />
                      <span>{reply.User?.role === 'profesor' ? 'Andrés (Mentor)' : 'Mi Avance'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <Clock size={10} strokeWidth={4} />
                      <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Action Area */}
        <div className="p-6 md:p-8 bg-black/60 border-t border-white/5 space-y-4">
          {(audioBlob || videoFile) && (
            <div className="bg-primary/20 border border-primary/30 text-primary text-[10px] font-black p-4 rounded-2xl flex items-center justify-between uppercase tracking-widest shadow-lg shadow-primary/10 animate-in slide-in-from-bottom-5">
               <div className="flex items-center gap-3">
                   {audioBlob ? <Mic size={14} /> : <Video size={14} />}
                   {audioBlob ? 'Grabación de Audio Lista' : `Video: ${videoFile.name}`}
               </div>
               <button onClick={() => {setAudioBlob(null); setVideoFile(null)}} className="hover:scale-125 transition-transform">
                   <X size={16} strokeWidth={3} />
               </button>
            </div>
          )}

          <div className="flex items-end gap-4">
            <div className="flex-1 bg-zinc-950 border border-white/5 rounded-[2rem] p-4 flex flex-col gap-4 shadow-inner">
              <textarea
                rows="1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isAdminPreview ? "Modo vista previa..." : "Deja tu comentario o pregunta..."}
                disabled={isAdminPreview}
                className="flex-1 bg-transparent text-base md:text-lg outline-none resize-none py-2 max-h-48 text-white border-none !p-2 placeholder:text-zinc-700 font-medium"
              />
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                {user?.isPro && (
                  <button onClick={() => !isAdminPreview && videoInputRef.current?.click()} className="p-3 rounded-xl text-zinc-500 hover:text-primary hover:bg-primary/10 transition-all">
                    <Video size={22} />
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </button>
                )}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  className={`p-3 rounded-xl transition-all duration-300 ${isRecording ? 'text-primary bg-primary/20 scale-125 animate-pulse' : 'text-zinc-500 hover:text-primary hover:bg-primary/10'}`}
                >
                  <Mic size={22} />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="bg-primary text-background p-6 rounded-[2rem] hover:scale-105 disabled:opacity-10 active:scale-95 transition-all duration-500 shadow-2xl shadow-primary/30"
            >
              <Send size={24} strokeWidth={4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
