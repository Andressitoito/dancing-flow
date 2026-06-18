import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { Play, Mic, Send, ChevronRight, X, User } from 'lucide-react';
import { API_BASE_URL } from '../services/constants';

const StudentTrainingView = () => {
  const { assignments, fetchAssignments, postReply, user } = useStore();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAssignment?.Replies]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    await postReply(selectedAssignment.id, replyText);
    setReplyText('');
    // Re-fetch to get the updated assignment with new reply
    fetchAssignments();
  };

  if (!selectedAssignment) {
    return (
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-black text-primary italic uppercase">Mis Clases</h1>
          <p className="text-zinc-500 text-sm">Entrena con el contenido personalizado para ti.</p>
        </header>

        <div className="grid gap-4">
          {assignments.map((asgn) => (
            <button
              key={asgn.id}
              onClick={() => setSelectedAssignment(asgn)}
              className="bg-surface border border-outline p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Play size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">{asgn.StudyBlock.title}</h3>
                  <p className="text-xs text-zinc-500 uppercase font-black mt-1">Nivel: {asgn.StudyBlock.level}</p>
                </div>
              </div>
              <ChevronRight className="text-zinc-600 group-hover:text-primary" />
            </button>
          ))}
          {assignments.length === 0 && (
            <div className="py-20 text-center text-zinc-600 italic">
              Aún no tienes clases asignadas.
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentAssignment = assignments.find(a => a.id === selectedAssignment.id) || selectedAssignment;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col max-w-md mx-auto animate-in slide-in-from-right duration-300">
      <header className="p-4 border-b border-outline flex items-center justify-between bg-surface/50 backdrop-blur-md">
        <button onClick={() => setSelectedAssignment(null)} className="p-2 -ml-2 text-zinc-400">
          <X size={24} />
        </button>
        <h2 className="font-bold text-sm uppercase tracking-tight truncate px-4">{currentAssignment.StudyBlock.title}</h2>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Content Section */}
        <div className="p-4 space-y-4">
          {currentAssignment.StudyBlock.type === 'video' && (
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-outline relative">
              <video
                src={`${window.location.origin.replace('5173', '3001')}${currentAssignment.StudyBlock.contentUrl}`}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="bg-surface p-4 rounded-2xl border border-outline">
            <h3 className="text-xs font-black text-primary uppercase mb-2">Instrucciones del Profe</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{currentAssignment.StudyBlock.description}</p>
          </div>
        </div>

        {/* Chat / Replies Section */}
        <div className="px-4 py-6 border-t border-outline">
          <h3 className="text-xs font-black text-zinc-500 uppercase mb-6 flex items-center gap-2">
            <MessageSquare size={14} />
            Tu Seguimiento
          </h3>

          <div className="space-y-4">
            {currentAssignment.Replies?.map((reply, i) => (
              <div key={i} className={`flex ${reply.User.role === 'master' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  reply.User.role === 'master'
                  ? 'bg-zinc-800 rounded-tl-none border border-zinc-700'
                  : 'bg-primary text-background font-medium rounded-tr-none'
                }`}>
                  <p>{reply.content}</p>
                  {reply.audioUrl && (
                    <audio src={`${window.location.origin.replace('5173', '3001')}${reply.audioUrl}`} controls className="mt-2 w-full h-8" />
                  )}
                  <p className={`text-[9px] mt-1 opacity-60 uppercase font-black ${reply.User.role === 'master' ? 'text-zinc-400' : 'text-background'}`}>
                    {reply.User.role === 'master' ? 'PROFE' : 'YO'}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-outline pb-10">
        <div className="flex gap-2 items-center bg-background border border-outline rounded-2xl p-2 pl-4">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
            placeholder="Escribe tu duda o réplica..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button className="p-2 text-zinc-500">
            <Mic size={20} />
          </button>
          <button
            onClick={handleSendReply}
            className="bg-primary text-background p-2 rounded-xl"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentTrainingView;
