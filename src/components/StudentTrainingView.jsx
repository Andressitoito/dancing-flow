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
      <div className="space-y-12 pb-20 max-w-[1440px] mx-auto">
        {!isAdminPreview && (
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-10">
            <div>
              <span className="label-luxury !text-[10px] !text-primary !mb-2 uppercase tracking-[0.2em]">Curriculum Personalizado</span>
              <h1 className="font-sora text-[40px] md:text-[64px] font-extrabold text-white italic uppercase tracking-tighter leading-[0.9] mt-1">
                MIS <span className="text-primary">CLASES</span>
              </h1>
              <p className="font-sora text-zinc-500 text-sm font-light mt-4 max-w-xl">
                Accede a tu material de estudio y recibe correcciones directas de tu mentor.
              </p>
            </div>

            <div className="flex items-center gap-8 bg-surface-container p-6 rounded-2xl border border-white/5 shadow-2xl">
               <div className="flex flex-col items-center">
                  <span className="font-sora text-2xl font-black text-white">{safeAssignments.length}</span>
                  <span className="label-luxury !text-[8px] !text-zinc-600 uppercase">Asignadas</span>
               </div>
               <div className="w-[1px] h-10 bg-white/10" />
               <div className="flex flex-col items-center">
                  <span className="font-sora text-2xl font-black text-primary">
                    {safeAssignments.filter(a => a.Replies?.length > 0).length}
                  </span>
                  <span className="label-luxury !text-[8px] !text-zinc-600 uppercase">Con Feedback</span>
               </div>
            </div>
          </header>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeAssignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="group bg-surface-container border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-500 flex flex-col text-left shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="material-symbols-outlined !text-[56px] text-zinc-800 z-20 group-hover:text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  {asgn.StudyBlock?.type === 'video' ? 'play_circle' : 'description'}
                </span>
                <div className="absolute top-4 left-4 z-20 bg-primary text-black font-black italic text-[9px] px-3 py-1 rounded uppercase tracking-tighter kinetic-skew shadow-lg">
                  {asgn.StudyBlock?.level}
                </div>
              </div>

              <div className="p-8 space-y-3 flex-1">
                <h3 className="font-sora text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">{asgn.StudyBlock?.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-light">{asgn.StudyBlock?.description}</p>
              </div>

              <div className="px-8 py-5 flex items-center justify-between border-t border-white/5 bg-black/20">
                 <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary !text-[12px]">forum</span>
                        </div>
                    </div>
                    <span className="label-luxury !text-[9px] !text-zinc-500 uppercase tracking-widest">{asgn.Replies?.length || 0} Interacciones</span>
                 </div>
                 <span className="material-symbols-outlined text-primary !text-[20px] translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">arrow_forward</span>
              </div>
            </button>
          ))}

          {safeAssignments.length === 0 && (
            <div className="col-span-full py-32 text-center bg-surface-container rounded-[3rem] border-2 border-dashed border-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined !text-[40px] text-zinc-800">auto_stories</span>
              </div>
              <h3 className="font-sora text-xl font-bold text-white uppercase italic">Tu camino está por comenzar</h3>
              <p className="font-sora text-zinc-500 text-sm mt-2 max-w-xs mx-auto">Pronto recibirás tus primeras clases personalizadas del mentor.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = safeAssignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className={`fixed inset-0 md:top-[56px] z-40 bg-background flex flex-col md:flex-row animate-in slide-in-from-right duration-500`}>
      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
        <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-surface-container/50 backdrop-blur-xl sticky top-0 z-30">
          <button onClick={() => setSelectedAssignment(null)} className="group w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/40 transition-all duration-300">
            <span className="material-symbols-outlined !text-[24px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          <div className="text-right">
            <div className="flex items-center justify-end gap-3 mb-1">
               <span className="bg-primary/10 text-primary text-[9px] font-black italic px-2 py-0.5 rounded border border-primary/20 uppercase tracking-tighter">{currentAssignment.StudyBlock?.level}</span>
               <span className="label-luxury !text-[9px] !text-zinc-600 uppercase tracking-widest">Módulo de Estudio</span>
            </div>
            <h2 className="font-sora text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{currentAssignment.StudyBlock?.title}</h2>
          </div>
        </header>

        <div className="flex-1 flex flex-col p-6 md:p-12 gap-10 max-w-6xl mx-auto w-full">
           {currentAssignment.StudyBlock?.type === 'video' && currentAssignment.StudyBlock?.contentUrl && (
             <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] relative group ring-1 ring-white/5">
                <video src={getMediaUrl(currentAssignment.StudyBlock.contentUrl)} controls className="w-full h-full object-contain" />
             </div>
           )}

           <div className="bg-surface-container rounded-[2rem] p-8 md:p-12 space-y-6 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                 <span className="material-symbols-outlined !text-[120px]">school</span>
              </div>
              <div className="flex items-center gap-4 text-primary relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined !text-[20px]">menu_book</span>
                </div>
                <h3 className="label-luxury !text-[10px] uppercase tracking-[0.2em] font-black">Instrucciones del Mentor</h3>
              </div>
              <p className="font-sora text-zinc-300 text-xl md:text-3xl leading-snug italic font-light relative z-10">
                "{currentAssignment.StudyBlock?.description}"
              </p>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-[450px] bg-surface-container flex flex-col border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
           <div className="space-y-1">
            <h3 className="font-sora text-xl font-black text-white italic tracking-tighter uppercase leading-none">FEEDBACK <span className="text-primary">DIRECTO</span></h3>
            <p className="label-luxury !text-[8px] !text-zinc-600 uppercase tracking-widest font-bold">Canal Privado de Evolución</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/40 !text-[22px]">auto_awesome</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-black/10">
          {currentAssignment.Replies?.map((reply, i) => (
            <div key={i} className={`flex flex-col ${reply.User?.role === 'profesor' ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[90%] p-5 rounded-2xl transition-all shadow-xl ${
                reply.User?.role === 'profesor'
                ? 'bg-surface-bright border border-white/10 text-zinc-200 rounded-tl-none'
                : 'bg-primary text-black font-bold rounded-tr-none shadow-primary/10'
              }`}>
                {reply.content && <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap tracking-tight">{reply.content}</p>}

                {reply.type === 'audio' && (
                   <div className="mt-4 bg-black/60 p-2 rounded-xl border border-white/10">
                        <audio src={getMediaUrl(reply.audioUrl)} controls className={`w-full h-8 ${reply.User?.role === 'profesor' ? 'invert' : ''}`} />
                   </div>
                )}

                {reply.type === 'video' && (
                   <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <video src={getMediaUrl(reply.videoUrl)} controls className="w-full" />
                   </div>
                )}

                <div className={`flex items-center justify-between mt-4 gap-6 label-luxury !text-[7px] font-black italic tracking-widest ${reply.User?.role === 'profesor' ? '!text-zinc-600' : '!text-black/40'}`}>
                  <span>{reply.User?.role === 'profesor' ? 'MASTER MENTOR' : 'MI REGISTRO'}</span>
                  <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 md:p-8 bg-black/40 border-t border-white/10 space-y-4 backdrop-blur-md">
          {(audioBlob || videoFile) && (
            <div className="bg-primary/10 border border-primary/30 text-primary label-luxury !text-[8px] px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
               <div className="flex items-center gap-3">
                   <span className="material-symbols-outlined !text-[16px] animate-pulse">{audioBlob ? 'mic' : 'videocam'}</span>
                   <span className="font-bold tracking-widest uppercase">{audioBlob ? 'Audio Preparado' : `Video: ${videoFile.name}`}</span>
               </div>
               <button onClick={() => {setAudioBlob(null); setVideoFile(null)}} className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 hover:text-white transition-all">
                   <span className="material-symbols-outlined !text-[14px]">close</span>
               </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 bg-black/60 rounded-2xl border border-white/10 p-3 flex flex-col gap-3 focus-within:border-primary/50 transition-all shadow-inner">
              <textarea
                rows="1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu mensaje o consulta..."
                disabled={isAdminPreview}
                className="flex-1 !bg-transparent !p-1 !border-none !text-sm placeholder:text-zinc-800 focus:ring-0 resize-none min-h-[24px]"
              />
              <div className="flex items-center gap-4 px-1">
                {user?.isPro && (
                  <button onClick={() => !isAdminPreview && videoInputRef.current?.click()} className="text-zinc-600 hover:text-primary transition-all duration-300 hover:scale-110">
                    <span className="material-symbols-outlined !text-[20px]">videocam</span>
                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                  </button>
                )}
                <button
                  onMouseDown={startRecording} onMouseUp={stopRecording}
                  onTouchStart={startRecording} onTouchEnd={stopRecording}
                  className={`transition-all duration-300 ${isRecording ? 'text-red-500 scale-125 animate-pulse' : 'text-zinc-600 hover:text-primary hover:scale-110'}`}
                >
                  <span className="material-symbols-outlined !text-[20px]">mic</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleSendReply}
              disabled={(!replyText.trim() && !audioBlob && !videoFile) || isAdminPreview}
              className="group btn-primary !w-14 !h-14 !p-0 !rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_10px_20px_-5px_rgba(212,175,55,0.3)] hover:shadow-primary/40 transition-all active:scale-90"
            >
              <span className="material-symbols-outlined !text-[24px] group-hover:rotate-12 transition-transform">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
