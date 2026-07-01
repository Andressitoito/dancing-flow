import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import {
  Play,
  Mic,
  Send,
  ChevronRight,
  X,
  User,
  MessageSquare,
  Video,
  History,
  GraduationCap,
  Clock,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { getMediaUrl } from '../services/constants';
import Swal from 'sweetalert2';
import {
  DFCard,
  DFButton,
  DFIconButton,
  DFBadge,
  DFPageHeader,
  DFPageActions,
  DFEmptyState,
  DFContainer
} from '../components/ui';

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
        background: '#0A1828',
        color: '#D4AF37',
        customClass: { popup: 'df-card !border-df-primary/40' }
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
      <div className="space-y-10 pb-12">
        {!isAdminPreview && (
          <DFPageHeader
            title="Training Flow"
            subtitle="Tu evolución artística bajo la guía experta de nuestros mentores."
          >
            <div className="flex items-center gap-6 bg-df-surface-2 border border-df-border-subtle px-6 py-4 rounded-2xl shadow-inner">
               <div className="flex flex-col items-center">
                  <span className="df-title !text-df-text leading-none mb-1">{safeAssignments.length}</span>
                  <span className="df-label !text-[8px] text-df-text-muted">Módulos</span>
               </div>
               <div className="w-[1px] h-8 bg-df-border-subtle" />
               <div className="flex flex-col items-center">
                  <span className="df-title !text-df-primary leading-none mb-1">
                    {safeAssignments.filter(a => a.Replies?.length > 0).length}
                  </span>
                  <span className="df-label !text-[8px] text-df-text-muted">Activos</span>
               </div>
            </div>
          </DFPageHeader>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeAssignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="group df-card no-padding overflow-hidden hover:border-df-primary/40 transition-all duration-300 flex flex-col text-left bg-df-surface-1 shadow-lg"
            >
              <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center border-b border-df-border-subtle">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                {asgn.StudyBlock?.type === 'video' ? (
                   <div className="p-4 bg-df-primary/10 rounded-full text-df-primary group-hover:scale-110 group-hover:bg-df-primary group-hover:text-black transition-all duration-500 z-20 shadow-xl">
                     <Play size={24} fill="currentColor" />
                   </div>
                ) : (
                  <MessageSquare size={32} className="text-df-primary/40 z-20" />
                )}
                <div className="absolute top-4 left-4 z-20">
                  <DFBadge variant="primary" size="xs" className="!bg-black/60 backdrop-blur-md">
                    {asgn.StudyBlock?.level}
                  </DFBadge>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1">
                <h3 className="df-title uppercase italic text-df-text group-hover:text-df-primary transition-colors">{asgn.StudyBlock?.title}</h3>
                <p className="df-body-sm text-df-text-muted line-clamp-2">{asgn.StudyBlock?.description}</p>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-t border-df-border-subtle bg-df-primary/[0.02]">
                 <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-df-primary/60" />
                    <span className="df-caption uppercase font-bold text-df-text-muted">{asgn.Replies?.length || 0} Interacciones</span>
                 </div>
                 <ChevronRight size={18} className="text-df-primary translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </button>
          ))}

          {safeAssignments.length === 0 && (
            <div className="col-span-full py-20 bg-df-surface-2 border border-dashed border-df-border rounded-3xl text-center">
              <DFEmptyState
                title="Esperando contenido"
                description="Tu mentor está preparando tu próximo desafío artístico. Te notificaremos pronto."
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 top-[64px] z-40 bg-df-bg flex flex-col lg:flex-row animate-in slide-in-from-right duration-500 overflow-hidden`}>
      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-6 py-4 md:px-8 border-b border-df-border-subtle bg-df-surface-1 flex items-center justify-between sticky top-0 z-10">
          <DFButton
            variant="secondary"
            size="sm"
            onClick={() => setSelectedAssignment(null)}
            leftIcon={X}
          >
            Volver
          </DFButton>
          <div className="text-right">
            <p className="df-label text-df-primary mb-0.5">{currentAssignment.StudyBlock?.level}</p>
            <h2 className="df-title uppercase italic leading-none">{currentAssignment.StudyBlock?.title}</h2>
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-10 max-w-5xl mx-auto w-full">
           {currentAssignment.StudyBlock?.type === 'video' && currentAssignment.StudyBlock?.contentUrl && (
             <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-df-border-subtle shadow-2xl group">
                <video src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)} controls className="w-full h-full object-contain" />
             </div>
           )}

           <DFCard className="bg-df-surface-2 border-df-primary/10 shadow-lg">
              <div className="flex items-center gap-3 text-df-primary mb-4">
                <GraduationCap size={20} />
                <h3 className="df-label">Instrucciones del Mentor</h3>
              </div>
              <p className="df-body-lg text-df-text italic opacity-90 leading-relaxed border-l-2 border-df-primary/20 pl-6">
                {currentAssignment.StudyBlock?.description}
              </p>
           </DFCard>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full lg:w-[420px] bg-df-surface-1 flex flex-col border-l border-df-border-subtle shadow-2xl relative">
        <div className="p-6 border-b border-df-border-subtle flex items-center justify-between bg-df-surface-2">
           <div>
            <h3 className="df-title uppercase italic text-df-primary">Mentoria Personal</h3>
            <p className="df-label !text-[8px] text-df-text-muted">Directo con tu profesor</p>
           </div>
           <MessageSquare size={20} className="text-df-primary/40" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {currentAssignment.Replies?.map((reply, i) => {
            const isMentor = reply.User?.role === 'profesor';
            return (
              <div key={i} className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl transition-all shadow-md ${
                  isMentor
                  ? 'bg-df-surface-3 border border-df-border text-df-text-soft'
                  : 'bg-df-primary text-black font-bold'
                }`}>
                  {reply.content && <p className="df-body-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                  {reply.type === 'audio' && (
                     <div className={`mt-3 p-2 rounded-xl border ${isMentor ? 'bg-black/20 border-white/5' : 'bg-black/10 border-black/10'}`}>
                          <audio src={getMediaUrl(reply.audioUrl)} controls className={`w-full h-8 ${isMentor ? 'invert' : ''}`} />
                     </div>
                  )}

                  {reply.type === 'video' && (
                     <div className="mt-3 rounded-xl overflow-hidden border border-black/10 shadow-lg">
                          <video src={getMediaUrl(reply.videoUrl)} controls className="w-full" />
                     </div>
                  )}

                  <div className={`flex items-center justify-between mt-3 gap-4 df-caption !text-[7px] font-bold ${isMentor ? 'text-df-text-muted' : 'text-black/60'} uppercase tracking-widest`}>
                    <div className="flex items-center gap-1.5">
                        <User size={10} strokeWidth={3} />
                        <span>{isMentor ? 'Mentor' : 'Alumno'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={10} strokeWidth={3} />
                        <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-df-surface-2 border-t border-df-border-subtle space-y-4 shadow-inner">
          {(audioBlob || videoFile) && (
            <div className="bg-df-primary/10 border border-df-primary/20 text-df-primary df-label !text-[8px] p-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
               <div className="flex items-center gap-3">
                   {audioBlob ? <Mic size={14} /> : <Video size={14} />}
                   <span>{audioBlob ? 'Audio capturado' : `Video: ${videoFile.name}`}</span>
               </div>
               <button onClick={() => {setAudioBlob(null); setVideoFile(null)}} className="hover:text-white transition-colors">
                   <X size={16} strokeWidth={3} />
               </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 bg-df-bg rounded-2xl p-2 border border-df-border-subtle focus-within:border-df-primary/40 transition-all flex flex-col gap-2 shadow-inner">
              <textarea
                rows="2"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu mensaje artístico..."
                disabled={isAdminPreview}
                className="flex-1 bg-transparent px-3 py-2 df-body-sm outline-none text-df-text resize-none"
              />
              <div className="flex items-center gap-4 px-3 pb-1 border-t border-df-border-subtle/30 pt-2">
                {user?.isPro && (
                  <button onClick={() => !isAdminPreview && videoInputRef.current?.click()} className="text-df-text-muted hover:text-df-primary transition-colors cursor-pointer">
                    <Video size={18} />
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </button>
                )}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  className={`transition-all cursor-pointer ${isRecording ? 'text-df-danger scale-125 animate-pulse' : 'text-df-text-muted hover:text-df-primary'}`}
                >
                  <Mic size={18} />
                </button>
              </div>
            </div>
            <DFIconButton
              icon={Send}
              variant="primary"
              size="lg"
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="!rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
