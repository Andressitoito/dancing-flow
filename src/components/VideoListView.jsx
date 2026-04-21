import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';
import {
  Plus, Trash2, Video as VideoIcon, ChevronRight, Play, Pause,
  FastForward, Rewind, RotateCcw, Heart, Star, Search, X
} from 'lucide-react';
import Swal from 'sweetalert2';

const VideoThumbnail = ({ video, onClick, onDelete, onLike, onFavorite, userId, role }) => {
  const videoRef = useRef(null);
  const [poster, setPoster] = useState(null);
  const isLiked = video.likes?.includes(userId);
  const isFavorited = video.favorites?.includes(userId);

  useEffect(() => {
    if (video.url && !video.url.startsWith('http')) {
      const v = document.createElement('video');
      v.src = video.url;
      v.currentTime = 0.5;
      v.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        setPoster(canvas.toDataURL());
      };
    }
  }, [video.url]);

  return (
    <div className="space-y-1 relative group">
      <div className="text-[10px] font-black uppercase text-zinc-500 truncate px-1">
        {video.title}
      </div>

      <button
        onClick={onClick}
        className="aspect-[9/16] w-full bg-surface rounded-xl border border-outline flex flex-col items-center justify-center overflow-hidden relative shadow-lg active:scale-95 transition-all"
      >
        {poster ? (
          <img src={poster} className="w-full h-full object-cover" alt="" />
        ) : video.url.startsWith('http') ? (
           <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
             <VideoIcon className="text-zinc-700" size={32} />
           </div>
        ) : (
          <VideoIcon className="text-zinc-700" size={32} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-2 right-2 flex flex-col gap-2">
           <button
             onClick={(e) => { e.stopPropagation(); onLike(); }}
             className={`p-1.5 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-primary text-white shadow-lg scale-110' : 'bg-black/40 text-white/70'}`}
           >
             <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
           </button>
           <button
             onClick={(e) => { e.stopPropagation(); onFavorite(); }}
             className={`p-1.5 rounded-full backdrop-blur-md transition-all ${isFavorited ? 'bg-secondary text-white shadow-lg scale-110' : 'bg-black/40 text-white/70'}`}
           >
             <Star size={14} fill={isFavorited ? "currentColor" : "none"} />
           </button>
        </div>
      </button>

      <div className="text-[9px] font-medium text-zinc-400 italic truncate px-1">
        {video.subtitle || video.creatorName || 'Sin subtítulo'}
      </div>

      {(role === 'master' || (role === 'moderator' && userId === video.userId)) && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute -top-1 -right-1 bg-primary p-1.5 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Trash2 size={10} />
        </button>
      )}
    </div>
  );
};

const VideoPlayer = ({ video, onBack }) => {
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

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
    <div className="fixed inset-0 z-[200] flex flex-col bg-background animate-in fade-in zoom-in-95 duration-300">
      <div className="p-4 flex items-center gap-3 border-b border-outline bg-background/50 backdrop-blur-md">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400">
           <ChevronRight size={24} className="rotate-180" />
        </button>
        <div className="flex-1 truncate">
          <h2 className="text-sm font-black uppercase tracking-tight truncate">{video.title}</h2>
          <p className="text-[10px] text-zinc-500 truncate">{video.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black relative">
        <video
          ref={videoRef}
          src={video.url}
          className="max-h-full w-full"
          playsInline
          autoPlay
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

      <div className="p-6 bg-surface border-t border-outline space-y-6">
        <div className="flex justify-center items-center gap-6">
           <button
             onClick={() => {
               setIsLooping(!isLooping);
               videoRef.current.loop = !isLooping;
             }}
             className={`p-2 rounded-lg transition-all ${isLooping ? 'bg-primary text-white shadow-lg' : 'text-zinc-500'}`}
           >
             <RotateCcw size={24} />
           </button>
           <button onClick={() => { videoRef.current.currentTime -= 5 }} className="text-zinc-400 hover:text-white"><Rewind size={32} /></button>
           <button onClick={togglePlay} className="bg-white text-black p-4 rounded-full shadow-xl active:scale-90 transition-all">
             {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" />}
           </button>
           <button onClick={() => { videoRef.current.currentTime += 5 }} className="text-zinc-400 hover:text-white"><FastForward size={32} /></button>
           <div className="w-10" />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-zinc-500 uppercase text-center tracking-widest">Velocidad</span>
          <div className="flex gap-2">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
              <button
                key={rate}
                onClick={() => changeRate(rate)}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                  playbackRate === rate ? 'bg-primary text-white scale-105 shadow-lg' : 'bg-surface/50 text-zinc-500 border border-outline/30'
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
  const { user, videos, addVideo, deleteVideo, likeVideo, favoriteVideo } = useStore();
  const [level, setLevel] = useState('principiante');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newVideo, setNewVideo] = useState({ title: '', subtitle: '', url: '', level: 'principiante', videoFile: null });

  const filteredVideos = (videos || [])
    .filter(v => v.level === level)
    .filter(v => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return v.title.toLowerCase().includes(term) || (v.subtitle && v.subtitle.toLowerCase().includes(term));
    })
    .sort((a, b) => {
      const aFav = a.favorites?.includes(user?.id) ? 1 : 0;
      const bFav = b.favorites?.includes(user?.id) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    });

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      await addVideo(newVideo);
      setIsAdding(false);
      setNewVideo({ title: '', subtitle: '', url: '', level: 'principiante', videoFile: null });
      Swal.fire({ title: 'Video Subido', icon: 'success', background: '#18181b', color: '#fff' });
    } catch (e) {
      Swal.fire({ title: 'Error', text: e.message, icon: 'error', background: '#18181b', color: '#fff' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Tutoriales</h2>
        {(user?.role === 'master' || user?.role === 'moderator') && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary p-2.5 rounded-full text-white shadow-lg active:scale-90 transition-all"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Buscar tutoriales..."
          className="w-full bg-surface border border-outline rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-all"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-2 p-1 bg-surface rounded-2xl border border-outline">
        <button
          onClick={() => setLevel('principiante')}
          className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${level === 'principiante' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500'}`}
        >
          Principiante
        </button>
        <button
          onClick={() => setLevel('avanzado')}
          className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${level === 'avanzado' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500'}`}
        >
          Int. / Avanzado
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
        {filteredVideos.map(video => (
          <VideoThumbnail
            key={video.id}
            video={video}
            userId={user?.id}
            role={user?.role}
            onClick={() => setSelectedVideo(video)}
            onDelete={() => {
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
            onLike={() => likeVideo(video.id)}
            onFavorite={() => favoriteVideo(video.id)}
          />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-4">
          <VideoIcon size={48} className="opacity-20" />
          <p className="italic text-sm">No se encontraron videos.</p>
        </div>
      )}

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} />
      )}

      {isAdding && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <form onSubmit={handleAdd} className="w-full max-w-sm bg-surface p-6 rounded-3xl border border-outline space-y-4 shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-tight">Subir Video</h3>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Título</label>
                <input
                  required placeholder="Ej. Básico con onda"
                  className="w-full bg-surface/50 p-3 rounded-xl border border-outline/60 outline-none focus:border-primary transition-all"
                  value={newVideo.title}
                  onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Subtítulo / Descripción corta</label>
                <input
                  placeholder="Ej. Nivel principiante, clase lunes"
                  className="w-full bg-surface/50 p-3 rounded-xl border border-outline/60 outline-none focus:border-primary transition-all"
                  value={newVideo.subtitle}
                  onChange={e => setNewVideo({...newVideo, subtitle: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Archivo MP4</label>
                <input
                  type="file" accept="video/mp4"
                  className="w-full bg-surface/50 p-3 rounded-xl border border-outline/60 text-xs"
                  onChange={e => setNewVideo({...newVideo, videoFile: e.target.files[0], url: ''})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-2">Nivel</label>
                <select
                  className="w-full bg-surface/50 p-3 rounded-xl border border-outline/60 outline-none focus:border-primary transition-all"
                  value={newVideo.level}
                  onChange={e => setNewVideo({...newVideo, level: e.target.value})}
                >
                  <option value="principiante">Principiante</option>
                  <option value="avanzado">Intermedio / Avanzado</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-surface/50 rounded-xl font-bold disabled:opacity-50 active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 bg-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subiendo...
                    </>
                  ) : 'Subir'}
                </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default VideoListView;
