import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Play, Mic, Send, ChevronRight, X, User, MessageSquare, Video, History, Info } from 'lucide-react';
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
    if (isAdminPreview) {
      Swal.fire({
        title: 'Modo Vista Previa',
        text: 'En el modo profesor no puedes enviar réplicas reales.',
        icon: 'info',
        background: '#18181b',
        color: '#fff'
      });
      return;
    }
    if (!replyText.trim() && !audioBlob && !videoFile) return;

    Swal.fire({
      title: 'Enviando réplica...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      background: '#18181b',
      color: '#fff'
    });

    try {
      await postReply(selectedAssignment.id, replyText, audioBlob, videoFile);
      setReplyText('');
      setAudioBlob(null);
      setVideoFile(null);
      fetchAssignments();
      Swal.close();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al enviar', background: '#18181b', color: '#fff' });
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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Audio grabado',
          showConfirmButton: false,
          timer: 1500,
          background: '#18181b',
          color: '#fff'
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      Swal.fire({ icon: 'error', title: 'Permiso de audio denegado', background: '#18181b', color: '#fff' });
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
      <div className={`${isAdminPreview ? '' : 'py-12 px-6 lg:px-0 max-w-7xl mx-auto'} animate-in fade-in duration-500`}>
        {!isAdminPreview && (
          <header className="mb-10 bg-surface p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">Entrenamiento</h1>
              <p className="text-zinc-500 text-lg font-medium">Contenido personalizado y feedback para tu evolución artística.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          </header>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeAssignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="group bg-surface backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-500 text-left flex flex-col shadow-xl hover:shadow-primary/5 hover:translate-y-[-4px]"
            >
              <div className="aspect-video bg-black/40 relative flex items-center justify-center overflow-hidden">
                {asgn.StudyBlock?.type === 'video' ? (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-md border border-primary/20">
                        <Play size={32} className="text-primary group-hover:scale-110 transition-transform duration-500 ml-1" fill="currentColor" />
                      </div>
                   </div>
                ) : (
                  <MessageSquare size={48} className="text-primary opacity-20" />
                )}
                <div className="absolute top-4 left-4 bg-primary text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {asgn.StudyBlock?.level}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col space-y-4">
                <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-primary transition-colors">{asgn.StudyBlock?.title}</h3>
                <p className="text-zinc-400 text-base line-clamp-2 flex-1 leading-relaxed">{asgn.StudyBlock?.description}</p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
                        {asgn.Replies?.length || 0}
                      </div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Interacciones</span>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
                     <ChevronRight size={20} />
                   </div>
                </div>
              </div>
            </button>
          ))}

          {safeAssignments.length === 0 && (
            <div className="col-span-full py-32 text-center bg-surface/50 rounded-[3rem] border border-dashed border-white/10">
              <div className="bg-background inline-flex p-8 rounded-full mb-6 border border-white/5 shadow-inner">
                <History size={48} className="text-zinc-700" />
              </div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tight mb-2">No hay clases asignadas</h3>
              <p className="text-lg text-zinc-500 max-w-md mx-auto">Tus profesores te asignarán contenido personalizado pronto para que empieces a entrenar.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 z-[60] bg-background flex flex-col md:flex-row animate-in slide-in-from-right duration-500 ${isAdminPreview ? 'md:top-20' : ''}`}>
      {/* Left side: Content & Video (Main) */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-black/40">
        <header className="p-8 flex items-center justify-between md:absolute md:top-0 md:left-0 md:right-0 md:z-10 md:bg-gradient-to-b md:from-black/90 md:to-transparent">
          <button onClick={() => setSelectedAssignment(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-xl transition-all text-white border border-white/10 shadow-2xl">
            <X size={28} />
          </button>
          <div className="text-right hidden md:block">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{currentAssignment.StudyBlock?.title}</h2>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mt-2">{currentAssignment.StudyBlock?.level}</p>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-20 gap-10">
           {currentAssignment.StudyBlock?.type === 'video' ? (
             <div className="w-full max-w-5xl mx-auto aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               {currentAssignment.StudyBlock?.contentUrl ? (
                 <video
                  src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)}
                  controls
                  className="w-full h-full object-contain"
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-zinc-600 uppercase tracking-[0.4em] font-black">
                    <Video size={80} className="opacity-10" />
                    Sin video de referencia
                 </div>
               )}
             </div>
           ) : (
             <div className="w-full max-w-3xl mx-auto bg-surface p-16 rounded-[3rem] border border-white/5 text-center shadow-2xl">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Info size={40} className="text-primary" />
                </div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tight mb-4">{currentAssignment.StudyBlock?.title}</h2>
                <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold">{currentAssignment.StudyBlock?.level}</p>
             </div>
           )}

           <div className="w-full max-w-3xl mx-auto bg-surface p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" /> Instrucciones del Profesor
              </h3>
              <p className="text-zinc-100 text-xl font-medium leading-relaxed">
                {currentAssignment.StudyBlock?.description}
              </p>
           </div>
        </div>
      </div>

      {/* Right side: Comments/Replies (Private Chat) */}
      <div className="w-full md:w-[450px] lg:w-[500px] bg-surface flex flex-col border-l border-white/5 shadow-2xl relative z-10">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface/50 backdrop-blur-xl">
           <div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Seguimiento Directo</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Feedback Privado y Réplicas</p>
           </div>
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
             <MessageSquare size={24} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-zinc-950/20">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User?.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[85%] p-6 rounded-[1.5rem] shadow-xl ${
                reply.User?.role === 'profesor'
                ? 'bg-zinc-800 rounded-tl-none border border-white/5 text-zinc-100'
                : 'bg-primary rounded-tr-none text-background font-bold'
              }`}>
                {reply.content && <p className="text-base leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <div className="mt-4 bg-black/20 p-2 rounded-xl border border-white/5">
                      <audio src={getMediaUrl(reply.audioUrl)} controls className={`w-full h-10 ${reply.User?.role === 'profesor' ? 'invert' : ''}`} />
                   </div>
                )}

                {reply.type === 'video' && (
                  <div className="mt-4 rounded-2xl overflow-hidden border-2 border-black/20 shadow-inner bg-black/40">
                    <video
                      src={getMediaUrl(reply.videoUrl)}
                      controls
                      className="w-full"
                    />
                  </div>
                )}

                <div className={`flex items-center justify-between mt-4 gap-4 ${reply.User?.role === 'profesor' ? 'text-zinc-500' : 'text-background/60'}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {reply.User?.role === 'profesor' ? 'Profesor' : 'Mi Réplica'}
                  </span>
                  <span className="text-[10px] font-bold">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          {(!currentAssignment.Replies || currentAssignment.Replies.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
               <MessageSquare size={48} />
               <p className="text-base font-bold uppercase tracking-widest italic">Inicia la conversación</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Reply Input Area */}
        <div className="p-8 bg-background/50 border-t border-white/5 space-y-6 backdrop-blur-md">
          {audioBlob && (
            <div className="bg-primary/20 text-primary text-xs font-black p-4 rounded-2xl flex items-center justify-between uppercase tracking-widest border border-primary/20 animate-in slide-in-from-bottom-2">
               <div className="flex items-center gap-3"><Mic size={18}/> Audio grabado listo</div>
               <button onClick={() => setAudioBlob(null)} className="p-1 hover:bg-primary/20 rounded-full"><X size={18}/></button>
            </div>
          )}
          {videoFile && (
            <div className="bg-primary/20 text-primary text-xs font-black p-4 rounded-2xl flex items-center justify-between uppercase tracking-widest border border-primary/20 animate-in slide-in-from-bottom-2">
               <div className="flex items-center gap-3"><Video size={18}/> Video: {videoFile.name}</div>
               <button onClick={() => setVideoFile(null)} className="p-1 hover:bg-primary/20 rounded-full"><X size={18}/></button>
            </div>
          )}

          <div className="flex items-end gap-4">
            <div className="flex-1 bg-surface border border-white/5 rounded-[2rem] p-3 pl-8 shadow-inner focus-within:border-primary/40 transition-all flex items-center gap-4">
              <textarea
                rows="1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isAdminPreview ? "Solo lectura..." : "Escribe tu réplica..."}
                disabled={isAdminPreview}
                className="flex-1 bg-transparent text-lg outline-none resize-none py-3 max-h-40 text-white placeholder:text-zinc-600 disabled:opacity-50"
              />

              <div className="flex gap-2 pr-2 mb-1">
                {user?.isPro && (
                  <button
                    onClick={() => !isAdminPreview && videoInputRef.current?.click()}
                    className={`p-3 rounded-full transition-all ${videoFile ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    title="Adjuntar Video"
                  >
                    <Video size={24} />
                    <input
                      type="file"
                      ref={videoInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                  </button>
                )}

                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`p-3 rounded-full transition-all ${isRecording ? 'text-primary bg-primary/10 animate-pulse' : audioBlob ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                  title="Grabar Audio"
                >
                  <Mic size={24} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="bg-primary text-background p-5 rounded-full hover:scale-110 active:scale-95 disabled:opacity-20 disabled:scale-100 transition-all shadow-xl shadow-primary/20 mb-1"
            >
              <Send size={28} strokeWidth={3} />
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 text-center font-bold uppercase tracking-[0.3em] opacity-50">Canal Seguro & Encriptado con tu Profesor</p>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
