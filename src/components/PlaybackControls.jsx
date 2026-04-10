import React from 'react';
import { Play, Pause } from 'lucide-react';

const PlaybackControls = ({
  isPlaying,
  onTogglePlay,
  bpm,
  onBpmChange,
  playbackMode,
  onToggleMode,
  showModeToggle = true
}) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isPlaying ? 'bg-secondary text-white' : 'bg-primary text-white'
          }`}
        >
          {isPlaying ? (
            <Pause size={24} className="text-white fill-white" />
          ) : (
            <Play size={24} className="text-white fill-white ml-1" />
          )}
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">BPM: {bpm}</span>
          <input
            type="range" min="60" max="180" value={bpm}
            onChange={(e) => onBpmChange(parseInt(e.target.value))}
            className="w-24 accent-primary h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {showModeToggle && (
        <button
          onClick={onToggleMode}
          className={`px-3 py-2 rounded-full text-[10px] font-bold border transition-colors ${
            playbackMode === 'centered' ? 'bg-primary border-primary text-white' : 'border-zinc-700 text-zinc-500'
          }`}
        >
          {playbackMode === 'centered' ? 'MODO LINEAL' : 'MODO REJILLA'}
        </button>
      )}
    </div>
  );
};

export default PlaybackControls;
