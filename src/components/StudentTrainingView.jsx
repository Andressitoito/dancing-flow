import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Play, Mic, Send, ChevronRight, X, User, MessageSquare, Video, History, Info } from 'lucide-react';
import { API_BASE_URL, getMediaUrl } from '../services/constants';
import Swal from 'sweetalert2';

const StudentTrainingView = () => {
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

  if (!selectedAssignment) {
    return (
      <div className="py-10 px-4 md:px-8 lg:px-0 max-w-7xl mx-auto animate-in fade-in duration-500">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter mb-2">Entrenamiento</h1>
          <p className="text-zinc-500 text-sm md:text-base font-medium">Contenido personalizado para tu evolución.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="group bg-surface-glass backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 text-left flex flex-col shadow-2xl"
            >
              <div className="aspect-video bg-black/40 relative flex items-center justify-center overflow-hidden">
                {asgn.StudyBlock.type === 'video' ? (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={48} className="text-primary opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" fill="currentColor" />
                   </div>
                ) : (
                  <MessageSquare size={48} className="text-primary opacity-20" />
                )}
                <div className="absolute top-4 left-4 bg-primary text-background text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  {asgn.StudyBlock.level}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{asgn.StudyBlock.title}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-6 flex-1">{asgn.StudyBlock.description}</p>

                <div className="flex items-center justify-between mt-auto">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-surface flex items-center justify-center text-[10px] font-bold">
                        {asgn.Replies?.length || 0}
                      </div>
                   </div>
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                     Entrar <ChevronRight size={14} />
                   </span>
                </div>
              </div>
            </button>
          ))}

          {assignments.length === 0 && (
            <div className="col-span-full py-32 text-center">
              <div className="bg-surface-glass border border-white/5 inline-flex p-8 rounded-full mb-6">
                <History size={48} className="text-zinc-700" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-500 italic">No hay clases asignadas todavía</h3>
              <p className="text-zinc-600 mt-2">Tus profesores te asignarán contenido pronto.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = assignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col md:flex-row animate-in slide-in-from-right duration-500">
      {/* Left side: Content & Video (Main) */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-black/20">
        <header className="p-6 flex items-center justify-between md:absolute md:top-0 md:left-0 md:right-0 md:z-10 md:bg-gradient-to-b md:from-black/80 md:to-transparent">
          <button onClick={() => setSelectedAssignment(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all text-white">
            <X size={24} />
          </button>
          <div className="text-right hidden md:block">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">{currentAssignment.StudyBlock.title}</h2>
            <p className="text-primary text-[9px] font-black uppercase tracking-widest">{currentAssignment.StudyBlock.level}</p>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center p-4 md:p-12 gap-8">
           {currentAssignment.StudyBlock.type === 'video' ? (
             <div className="w-full max-w-5xl mx-auto aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <video
                src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)}
                controls
                className="w-full h-full object-contain"
               />
             </div>
           ) : (
             <div className="w-full max-w-3xl mx-auto bg-surface-glass backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 text-center">
                <Info size={48} className="mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-black text-white italic uppercase mb-4">{currentAssignment.StudyBlock.title}</h2>
             </div>
           )}

           <div className="w-full max-w-3xl mx-auto bg-surface-glass backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Info size={14} /> Instrucciones del Profesor
              </h3>
              <p className="text-white text-lg font-medium leading-relaxed">
                {currentAssignment.StudyBlock.description}
              </p>
           </div>
        </div>
      </div>

      {/* Right side: Comments/Replies (Private Chat) */}
      <div className="w-full md:w-[380px] lg:w-[450px] bg-surface flex flex-col border-l border-white/5 shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div>
            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Tu Seguimiento</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Chat privado con el profe</p>
           </div>
           <div className="bg-primary/10 p-2 rounded-xl text-primary">
             <MessageSquare size={20} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[90%] p-4 rounded-2xl ${
                reply.User.role === 'profesor'
                ? 'bg-zinc-800 rounded-tl-none border border-white/5 text-white'
                : 'bg-primary rounded-tr-none text-background font-bold'
              }`}>
                {reply.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <audio src={getMediaUrl(reply.audioUrl)} controls className={`mt-3 w-full h-8 ${reply.User.role === 'profesor' ? 'invert' : ''}`} />
                )}

                {reply.type === 'video' && (
                  <video
                    src={getMediaUrl(reply.videoUrl)}
                    controls
                    className="mt-3 w-full rounded-xl border border-black/20"
                  />
                )}

                <div className={`flex items-center justify-between mt-2 gap-4 ${reply.User.role === 'profesor' ? 'text-zinc-500' : 'text-background/50'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {reply.User.role === 'profesor' ? 'PROFESOR' : 'MI RÉPLICA'}
                  </span>
                  <span className="text-[9px] font-medium">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Reply Input Area */}
        <div className="p-6 bg-background border-t border-white/5 space-y-4">
          {audioBlob && (
            <div className="bg-primary/20 text-primary text-[10px] font-black p-2 rounded-lg flex items-center justify-between uppercase tracking-widest">
               Audio grabado listo para enviar
               <button onClick={() => setAudioBlob(null)}><X size={14}/></button>
            </div>
          )}
          {videoFile && (
            <div className="bg-primary/20 text-primary text-[10px] font-black p-2 rounded-lg flex items-center justify-between uppercase tracking-widest">
               Video seleccionado: {videoFile.name}
               <button onClick={() => setVideoFile(null)}><X size={14}/></button>
            </div>
          )}

          <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-2xl p-2 pl-4 shadow-inner">
            <textarea
              rows="1"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escribe tu réplica..."
              className="flex-1 bg-transparent text-sm outline-none resize-none py-2 max-h-32 text-white"
            />

            <div className="flex gap-1 pr-1">
              {user?.isPro && (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className={`p-2 rounded-xl transition-all ${videoFile ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Video size={20} />
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
                className={`p-2 rounded-xl transition-all ${isRecording ? 'text-primary bg-primary/10 animate-pulse' : audioBlob ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-white'}`}
              >
                <Mic size={20} />
              </button>

              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() && !audioBlob && !videoFile}
                className="bg-primary text-background p-3 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-lg"
              >
                <Send size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
          <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">Solo tú y el profesor pueden ver este chat.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
