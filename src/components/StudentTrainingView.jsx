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
    if (isAdminPreview) return;
    if (!replyText.trim() && !audioBlob && !videoFile) return;

    try {
      await postReply(selectedAssignment.id, replyText, audioBlob, videoFile);
      setReplyText('');
      setAudioBlob(null);
      setVideoFile(null);
      fetchAssignments();
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
      <div className="space-y-6 animate-in fade-in duration-500">
        {!isAdminPreview && (
          <header className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-extrabold text-white">Entrenamiento</h1>
            <p className="text-zinc-500 text-sm mt-1">Clases personalizadas y feedback para tu evolución.</p>
          </header>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeAssignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="card flex flex-col gap-3 text-left hover:border-primary/30 group"
            >
              <div className="aspect-video bg-zinc-950 rounded-lg relative overflow-hidden flex items-center justify-center">
                {asgn.StudyBlock?.type === 'video' ? (
                   <Play size={24} className="text-primary/40 group-hover:scale-110 transition-transform" fill="currentColor" />
                ) : (
                  <MessageSquare size={24} className="text-zinc-800" />
                )}
                <div className="absolute top-2 left-2 bg-primary/20 text-primary text-[9px] font-black px-2 py-0.5 rounded uppercase border border-primary/20">
                  {asgn.StudyBlock?.level}
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">{asgn.StudyBlock?.title}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{asgn.StudyBlock?.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{asgn.Replies?.length || 0} Interacciones</span>
                 <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}

          {safeAssignments.length === 0 && (
            <div className="col-span-full py-20 text-center bg-zinc-900/50 rounded-2xl border border-dashed border-white/5">
              <History size={32} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Sin clases asignadas aún</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 z-[60] bg-background flex flex-col md:flex-row animate-in slide-in-from-right duration-300 ${isAdminPreview ? 'md:top-16' : ''}`}>
      {/* Left side: Content & Video */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-black/20">
        <header className="p-4 flex items-center justify-between border-b border-white/5 bg-zinc-950/50">
          <button onClick={() => setSelectedAssignment(null)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
            <X size={20} />
          </button>
          <div className="text-right">
            <h2 className="text-base font-bold text-white leading-none">{currentAssignment.StudyBlock?.title}</h2>
            <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">{currentAssignment.StudyBlock?.level}</p>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-4xl mx-auto w-full">
           {currentAssignment.StudyBlock?.type === 'video' && currentAssignment.StudyBlock?.contentUrl && (
             <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <video src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)} controls className="w-full h-full object-contain" />
             </div>
           )}

           <div className="card space-y-3">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <Info size={14} /> Instrucciones
              </h3>
              <p className="text-zinc-300 text-base leading-relaxed">
                {currentAssignment.StudyBlock?.description}
              </p>
           </div>
        </div>
      </div>

      {/* Right side: Comments/Replies */}
      <div className="w-full md:w-[320px] lg:w-[400px] bg-zinc-900 flex flex-col border-l border-white/5">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900">
           <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Seguimiento</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Chat con el profe</p>
           </div>
           <MessageSquare size={16} className="text-zinc-600" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User?.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[90%] p-3 rounded-xl text-sm ${
                reply.User?.role === 'profesor'
                ? 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5'
                : 'bg-primary text-black font-bold rounded-tr-none'
              }`}>
                {reply.content && <p className="leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <audio src={getMediaUrl(reply.audioUrl)} controls className={`mt-2 w-full h-8 ${reply.User?.role === 'profesor' ? 'invert' : ''}`} />
                )}

                {reply.type === 'video' && (
                   <video src={getMediaUrl(reply.videoUrl)} controls className="mt-2 w-full rounded-lg" />
                )}

                <div className={`flex items-center justify-between mt-2 gap-3 text-[9px] font-bold uppercase ${reply.User?.role === 'profesor' ? 'text-zinc-600' : 'text-black/40'}`}>
                  <span>{reply.User?.role === 'profesor' ? 'Profesor' : 'Yo'}</span>
                  <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-zinc-950 border-t border-white/5 space-y-2">
          {(audioBlob || videoFile) && (
            <div className="bg-primary/10 text-primary text-[10px] font-black p-2 rounded-lg flex items-center justify-between uppercase">
               {audioBlob ? 'Audio listo' : `Video: ${videoFile.name}`}
               <button onClick={() => {setAudioBlob(null); setVideoFile(null)}}><X size={12}/></button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 bg-zinc-900 border border-white/10 rounded-xl p-2 flex flex-col gap-2">
              <textarea
                rows="1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isAdminPreview ? "Solo lectura..." : "Escribir..."}
                disabled={isAdminPreview}
                className="flex-1 bg-transparent text-sm outline-none resize-none py-1 max-h-32 text-white border-none !p-0"
              />
              <div className="flex items-center gap-1">
                {user?.isPro && (
                  <button onClick={() => !isAdminPreview && videoInputRef.current?.click()} className="p-1.5 rounded-lg text-zinc-500 hover:text-white">
                    <Video size={16} />
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </button>
                )}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  className={`p-1.5 rounded-lg transition-all ${isRecording ? 'text-primary bg-primary/10 animate-pulse' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Mic size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="bg-primary text-black p-3 rounded-xl hover:scale-105 disabled:opacity-20 active:scale-95 transition-all"
            >
              <Send size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
