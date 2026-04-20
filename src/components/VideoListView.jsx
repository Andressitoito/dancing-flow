import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Plus, Trash2, Video, ChevronRight, Play, Pause, FastForward, Rewind, Square } from 'lucide-react';
import Swal from 'sweetalert2';

const VideoPlayer = ({ video, onBack }) => {
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeRate = (rate) => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800 bg-zinc-950/50">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400">
           <ChevronRight size={24} className="rotate-180" />
        </button>
        <h2 className="flex-1 text-lg font-bold truncate">{video.title}</h2>
      </div>

      <div className="flex-1 flex items-center justify-center bg-zinc-950 relative group">
        <video
          ref={videoRef}
          src={video.url}
          className="max-h-full w-full"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="bg-primary p-6 rounded-full shadow-2xl scale-125">
              <Play size={32} fill="white" />
            </div>
          </button>
        )}
      </div>

      <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-6">
        <div className="flex justify-center items-center gap-8">
           <button onClick={() => { videoRef.current.currentTime -= 5 }} className="text-zinc-400 hover:text-white"><Rewind size={32} /></button>
           <button onClick={togglePlay} className="bg-white text-black p-4 rounded-full">
             {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
           </button>
           <button onClick={() => { videoRef.current.currentTime += 5 }} className="text-zinc-400 hover:text-white"><FastForward size={32} /></button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-zinc-500 uppercase text-center tracking-widest">Velocidad de Reproducción</span>
          <div className="flex gap-2">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
              <button
                key={rate}
                onClick={() => changeRate(rate)}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                  playbackRate === rate ? 'bg-primary text-white scale-105 shadow-lg' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoListView = () => {
  const { user, videos, addVideo, deleteVideo } = useStore();
  const [level, setLevel] = useState('principiante');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '', level: 'principiante' });

  const filteredVideos = (videos || []).filter(v => v.level === level);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addVideo(newVideo);
      setIsAdding(false);
      setNewVideo({ title: '', url: '', level: 'principiante' });
      Swal.fire({ title: 'Video Subido', icon: 'success', background: '#18181b', color: '#fff' });
    } catch (e) {
      Swal.fire({ title: 'Error', text: e.message, icon: 'error', background: '#18181b', color: '#fff' });
    }
  };

  if (selectedVideo) {
    return <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Tutoriales</h2>
        {(user?.role === 'master' || user?.role === 'moderator') && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary p-2 rounded-full text-white shadow-lg"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
        <button
          onClick={() => setLevel('principiante')}
          className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${level === 'principiante' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500'}`}
        >
          Principiante
        </button>
        <button
          onClick={() => setLevel('avanzado')}
          className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${level === 'avanzado' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500'}`}
        >
          Intermedio / Avanzado
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredVideos.map(video => (
          <div key={video.id} className="space-y-2 relative group">
            <button
              onClick={() => setSelectedVideo(video)}
              className="aspect-[9/16] w-full bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden relative"
            >
              <Video className="text-zinc-700" size={32} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                 <p className="text-[10px] font-bold text-white leading-tight line-clamp-2">{video.title}</p>
              </div>
            </button>

            {(user?.role === 'master' || (user?.role === 'moderator' && user.id === video.userId)) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  Swal.fire({
                    title: '¿Eliminar Video?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#e11d48',
                    background: '#18181b', color: '#fff'
                  }).then(res => {
                    if (res.isConfirmed) deleteVideo(video.id);
                  });
                }}
                className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-20 text-zinc-600 italic text-sm">
          No hay videos en esta categoría.
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <form onSubmit={handleAdd} className="w-full max-w-sm bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold">Subir Video</h3>
              <input
                required placeholder="Título del video"
                className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700"
                value={newVideo.title}
                onChange={e => setNewVideo({...newVideo, title: e.target.value})}
              />
              <input
                required placeholder="URL del video (MP4)"
                className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700"
                value={newVideo.url}
                onChange={e => setNewVideo({...newVideo, url: e.target.value})}
              />
              <select
                className="w-full bg-zinc-800 p-3 rounded-xl border border-zinc-700"
                value={newVideo.level}
                onChange={e => setNewVideo({...newVideo, level: e.target.value})}
              >
                <option value="principiante">Principiante</option>
                <option value="avanzado">Intermedio / Avanzado</option>
              </select>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-primary rounded-xl font-bold">Subir</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default VideoListView;
