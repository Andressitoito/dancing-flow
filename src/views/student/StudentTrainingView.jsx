import React, { useState, useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import { Play, Mic, Send, ChevronRight, X, User, MessageSquare, Video, History, GraduationCap, Clock } from 'lucide-react';
import { getMediaUrl } from '../../services/constants';
import Swal from 'sweetalert2';
import {
  DFCard,
  DFButton,
  DFPageHeader,
  DFContainer,
  DFTextarea
} from '../../components/ui/index';

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
        background: '#051424',
        color: '#D4AF37',
        customClass: { popup: 'glass-card border-primary/40' }
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
      <DFContainer className="pb-24">
        {!isAdminPreview && (
          <DFPageHeader
            title={
              <>Mis <span className="text-primary">Clases</span></>
            }
            subtitle="Seguimiento personalizado para tu evolución artística."
          >
            <div className="flex items-center gap-8 bg-white/5 px-8 py-6 rounded-2xl border border-white/5">
               <div className="flex flex-col items-center">
                  <span className="font-sora text-2xl font-bold text-white">{safeAssignments.length}</span>
                  <span className="df-label !text-[8px] !text-zinc-500">Módulos</span>
               </div>
               <div className="w-[1px] h-10 bg-primary/20" />
               <div className="flex flex-col items-center">
                  <span className="font-sora text-2xl font-bold text-primary">
                    {safeAssignments.filter(a => a.Replies?.length > 0).length}
                  </span>
                  <span className="df-label !text-[8px] !text-zinc-500">Activos</span>
               </div>
            </div>
          </DFPageHeader>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {safeAssignments.map((asgn) => (
            <DFCard
              key={asgn.id}
              as="button"
              padding="none"
              onClick={() => setSelectedAssignment(asgn)}
              className="group overflow-hidden flex flex-col text-left"
            >
              <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center border-b border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                {asgn.StudyBlock?.type === 'video' ? (
                   <div className="p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500 z-20">
                     <Play size={24} fill="currentColor" />
                   </div>
                ) : (
                  <MessageSquare size={32} className="text-zinc-800 z-20" />
                )}
                <div className="absolute top-4 left-4 z-20 bg-black/60 text-primary df-label !text-[8px] px-3 py-1 rounded border border-primary/20 backdrop-blur-md">
                  {asgn.StudyBlock?.level}
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1">
                <h3 className="font-sora text-xl font-bold text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{asgn.StudyBlock?.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{asgn.StudyBlock?.description}</p>
              </div>

              <div className="p-8 pt-0 flex items-center justify-between border-t border-primary/5 mt-4 pt-6">
                 <div className="flex items-center gap-3">
                    <MessageSquare size={14} className="text-primary/40" />
                    <span className="df-label !text-[8px] !text-zinc-500">{asgn.Replies?.length || 0} Mensajes</span>
                 </div>
                 <ChevronRight size={18} className="text-primary translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            </DFCard>
          ))}

          {safeAssignments.length === 0 && (
            <DFCard padding="xl" className="col-span-full text-center border-dashed border-2 bg-transparent" hover={false}>
              <History size={48} className="mx-auto text-zinc-800 mb-6" />
              <h3 className="df-label !text-zinc-600">Esperando nuevas clases</h3>
              <p className="font-sora text-zinc-500 text-sm mt-2">Tu mentor te asignará contenido pronto.</p>
            </DFCard>
          )}
        </div>
      </DFContainer>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 md:top-[80px] z-40 bg-black/95 flex flex-col md:flex-row animate-in slide-in-from-right duration-500`}>
      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="p-6 md:p-10 flex items-center justify-between border-b border-primary/10 bg-black/40">
          <DFButton variant="secondary" size="icon" onClick={() => setSelectedAssignment(null)} className="!rounded-full">
            <X size={20} strokeWidth={3} />
          </DFButton>
          <div className="text-right space-y-1">
            <span className="df-label !text-[8px] !text-primary">{currentAssignment.StudyBlock?.level}</span>
            <h2 className="font-sora text-2xl md:text-3xl font-bold text-white italic uppercase tracking-tighter leading-none">{currentAssignment.StudyBlock?.title}</h2>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6 md:p-12 gap-10 max-w-5xl mx-auto w-full">
           {currentAssignment.StudyBlock?.type === 'video' && currentAssignment.StudyBlock?.contentUrl && (
             <div className="aspect-video bg-black rounded-xl overflow-hidden border border-primary/20 shadow-2xl relative group">
                <video src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)} controls className="w-full h-full object-contain" />
             </div>
           )}

           <DFCard padding="lg" className="space-y-6" hover={false}>
              <div className="flex items-center gap-4 text-primary">
                <GraduationCap size={24} />
                <h3 className="df-label">Guía de Entrenamiento</h3>
              </div>
              <p className="font-sora text-zinc-300 text-lg md:text-xl leading-relaxed italic opacity-95">
                "{currentAssignment.StudyBlock?.description}"
              </p>
           </DFCard>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-[450px] bg-df-surface-1 flex flex-col border-l border-primary/10 shadow-2xl">
        <div className="p-8 border-b border-primary/10 flex items-center justify-between bg-black/40">
           <div className="space-y-1">
            <h3 className="font-sora text-xl font-bold text-white italic tracking-tight">Mentoría <span className="text-primary neon-gold">Flow</span></h3>
            <p className="df-label !text-[8px] !text-zinc-600">Feedback Directo</p>
           </div>
           <MessageSquare size={20} className="text-primary/40" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User?.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[90%] p-6 rounded-lg transition-all duration-500 ${
                reply.User?.role === 'profesor'
                ? 'bg-white/5 border border-primary/20 text-zinc-200'
                : 'bg-primary text-black font-bold'
              }`}>
                {reply.content && <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <div className="mt-4 bg-black/20 p-2 rounded border border-white/10">
                        <audio src={getMediaUrl(reply.audioUrl)} controls className={`w-full h-8 ${reply.User?.role === 'profesor' ? 'invert' : ''}`} />
                   </div>
                )}

                {reply.type === 'video' && (
                   <div className="mt-4 rounded overflow-hidden border border-white/10">
                        <video src={getMediaUrl(reply.videoUrl)} controls className="w-full" />
                   </div>
                )}

                <div className={`flex items-center justify-between mt-4 gap-4 df-label !text-[8px] ${reply.User?.role === 'profesor' ? '!text-zinc-600' : '!text-black/60'}`}>
                  <div className="flex items-center gap-2">
                      <User size={10} strokeWidth={4} />
                      <span>{reply.User?.role === 'profesor' ? 'Mentor' : 'Mi Avance'}</span>
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

        <div className="p-6 md:p-8 bg-black/40 border-t border-primary/10 space-y-4">
          {(audioBlob || videoFile) && (
            <div className="bg-primary/10 border border-primary/30 text-primary df-label !text-[8px] p-4 rounded flex items-center justify-between">
               <div className="flex items-center gap-3">
                   {audioBlob ? <Mic size={14} /> : <Video size={14} />}
                   {audioBlob ? 'Audio Listo' : `Video: ${videoFile.name}`}
               </div>
               <button onClick={() => {setAudioBlob(null); setVideoFile(null)}}>
                   <X size={16} strokeWidth={3} />
               </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 bg-black rounded p-3 flex flex-col gap-3">
              <DFTextarea
                rows="1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isAdminPreview}
                className="!bg-transparent !p-2 !border-none !text-sm"
              />
              <div className="flex items-center gap-4 px-2">
                {user?.isPro && (
                  <button onClick={() => !isAdminPreview && videoInputRef.current?.click()} className="text-zinc-700 hover:text-primary transition-colors">
                    <Video size={18} />
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </button>
                )}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  className={`transition-colors ${isRecording ? 'text-red-500 scale-125 animate-pulse' : 'text-zinc-700 hover:text-primary'}`}
                >
                  <Mic size={18} />
                </button>
              </div>
            </div>
            <DFButton
              size="icon"
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="!h-14 !w-14"
            >
              <Send size={20} strokeWidth={3} />
            </DFButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
