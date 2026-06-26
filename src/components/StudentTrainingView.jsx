import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
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
      Swal.fire({ icon: 'error', title: 'Error al enviar' });
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
    } catch (err) { console.error(err); }
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
      <div className="space-y-8 pb-12">
        {!isAdminPreview && (
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div>
              <span className="label-luxury !text-[9px]">Plan de Estudio</span>
              <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white italic uppercase tracking-tighter leading-none mt-1">Mis <span className="text-primary">Clases</span></h1>
              <p className="font-sora text-zinc-500 text-sm font-light mt-2">Seguimiento personalizado para tu evolución artística.</p>
            </div>

            <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-lg border border-white/5">
               <div className="flex flex-col items-center">
                  <span className="font-sora text-xl font-bold text-white">{safeAssignments.length}</span>
                  <span className="label-luxury !text-[7px] !text-zinc-600">Total</span>
               </div>
               <div className="w-[1px] h-6 bg-white/10" />
               <div className="flex flex-col items-center">
                  <span className="font-sora text-xl font-bold text-primary">
                    {safeAssignments.filter(a => a.Replies?.length > 0).length}
                  </span>
                  <span className="label-luxury !text-[7px] !text-zinc-600">Activas</span>
               </div>
            </div>
          </header>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeAssignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="group glass-card border-white/5 bg-white/[0.01] overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col text-left"
            >
              <div className="aspect-video bg-black relative flex items-center justify-center border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <span className="material-symbols-outlined !text-[40px] text-zinc-800 z-20 group-hover:text-primary transition-colors group-hover:scale-110">
                  {asgn.StudyBlock?.type === 'video' ? 'play_circle' : 'chat_bubble'}
                </span>
                <div className="absolute top-3 left-3 z-20 bg-black/80 text-primary label-luxury !text-[7px] px-2 py-0.5 rounded border border-primary/20 backdrop-blur-md">
                  {asgn.StudyBlock?.level}
                </div>
              </div>

              <div className="p-6 space-y-2 flex-1">
                <h3 className="font-sora text-lg font-bold text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-tight">{asgn.StudyBlock?.title}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{asgn.StudyBlock?.description}</p>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 mt-2 bg-white/[0.01]">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary/30 !text-[14px]">forum</span>
                    <span className="label-luxury !text-[7px] !text-zinc-600">{asgn.Replies?.length || 0} Mensajes</span>
                 </div>
                 <span className="material-symbols-outlined text-primary !text-[18px] translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">chevron_right</span>
              </div>
            </button>
          ))}

          {safeAssignments.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card border-dashed border-white/5">
              <span className="material-symbols-outlined !text-[48px] text-zinc-900 mb-4">history</span>
              <h3 className="label-luxury !text-zinc-600">Esperando nuevas clases</h3>
              <p className="font-sora text-zinc-500 text-xs mt-1">Tu mentor te asignará contenido pronto.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 md:top-[56px] z-40 bg-black flex flex-col md:flex-row animate-in slide-in-from-right duration-300`}>
      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <header className="p-4 md:p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
          <button onClick={() => setSelectedAssignment(null)} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
            <span className="material-symbols-outlined !text-[20px]">close</span>
          </button>
          <div className="text-right">
            <span className="label-luxury !text-[7px] !text-primary uppercase">{currentAssignment.StudyBlock?.level}</span>
            <h2 className="font-sora text-xl md:text-2xl font-bold text-white italic uppercase tracking-tighter leading-none mt-1">{currentAssignment.StudyBlock?.title}</h2>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-4 md:p-10 gap-8 max-w-5xl mx-auto w-full">
           {currentAssignment.StudyBlock?.type === 'video' && currentAssignment.StudyBlock?.contentUrl && (
             <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/5 shadow-2xl relative group">
                <video src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)} controls className="w-full h-full object-contain" />
             </div>
           )}

           <div className="glass-card p-6 md:p-10 space-y-4 border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined !text-[20px]">school</span>
                <h3 className="label-luxury !text-[10px]">Guía de Entrenamiento</h3>
              </div>
              <p className="font-sora text-zinc-300 text-base md:text-xl leading-relaxed italic opacity-95">
                "{currentAssignment.StudyBlock?.description}"
              </p>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-[400px] bg-black flex flex-col border-l border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
           <div className="space-y-0.5">
            <h3 className="font-sora text-lg font-bold text-white italic tracking-tight uppercase">Mentoría <span className="text-primary">Directa</span></h3>
            <p className="label-luxury !text-[7px] !text-zinc-600">Feedback en tiempo real</p>
           </div>
           <span className="material-symbols-outlined text-primary/30 !text-[20px]">forum</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User?.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[85%] p-4 rounded-lg transition-all ${
                reply.User?.role === 'profesor'
                ? 'bg-white/5 border border-white/10 text-zinc-200'
                : 'bg-primary text-black font-bold'
              }`}>
                {reply.content && <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <div className="mt-3 bg-black/40 p-1.5 rounded-md border border-white/10">
                        <audio src={getMediaUrl(reply.audioUrl)} controls className={`w-full h-6 ${reply.User?.role === 'profesor' ? 'invert' : ''}`} />
                   </div>
                )}

                {reply.type === 'video' && (
                   <div className="mt-3 rounded-md overflow-hidden border border-white/10">
                        <video src={getMediaUrl(reply.videoUrl)} controls className="w-full" />
                   </div>
                )}

                <div className={`flex items-center justify-between mt-3 gap-4 label-luxury !text-[6px] ${reply.User?.role === 'profesor' ? '!text-zinc-600' : '!text-black/50'}`}>
                  <span>{reply.User?.role === 'profesor' ? 'MENTOR' : 'MI AVANCE'}</span>
                  <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-white/[0.02] border-t border-white/5 space-y-3">
          {(audioBlob || videoFile) && (
            <div className="bg-primary/5 border border-primary/20 text-primary label-luxury !text-[7px] px-3 py-2 rounded-md flex items-center justify-between">
               <div className="flex items-center gap-2">
                   <span className="material-symbols-outlined !text-[14px]">{audioBlob ? 'mic' : 'videocam'}</span>
                   {audioBlob ? 'Audio Listo' : `Video: ${videoFile.name}`}
               </div>
               <button onClick={() => {setAudioBlob(null); setVideoFile(null)}} className="hover:text-white transition-colors">
                   <span className="material-symbols-outlined !text-[14px]">close</span>
               </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 bg-black rounded-lg border border-white/10 p-2.5 flex flex-col gap-2.5">
              <textarea
                rows="1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Mensaje..."
                disabled={isAdminPreview}
                className="flex-1 !bg-transparent !p-1 !border-none !text-xs placeholder:text-zinc-800"
              />
              <div className="flex items-center gap-3 px-1">
                {user?.isPro && (
                  <button onClick={() => !isAdminPreview && videoInputRef.current?.click()} className="text-zinc-600 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined !text-[18px]">videocam</span>
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </button>
                )}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  className={`transition-all ${isRecording ? 'text-red-500 scale-110 animate-pulse' : 'text-zinc-600 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined !text-[18px]">mic</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="btn-primary !w-11 !h-11 !p-0 !rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <span className="material-symbols-outlined !text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
