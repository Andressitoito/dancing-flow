import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

const PlaybackControls = ({
  isPlaying,
  onTogglePlay,
  onStop,
  bpm,
  onBpmChange,
  playbackMode,
  onToggleMode,
  showModeToggle = true
}) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full px-4 py-3 flex items-center justify-between shadow-2xl z-40">
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isPlaying ? 'bg-secondary text-white' : 'bg-primary text-white'
          }`}
        >
          {isPlaying ? (
            <Pause size={20} className="text-white fill-white" />
          ) : (
            <Play size={20} className="text-white fill-white ml-0.5" />
          )}
        </button>

        <button
          onClick={onStop}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shadow-lg text-white"
        >
          <Square size={16} className="fill-white" />
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
            playbackMode === 'centered' ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
          }`}
        >
          {playbackMode === 'centered' ? 'MODO LINEAL' : 'MODO REJILLA'}
        </button>
      )}
    </div>
  );
};

export default PlaybackControls;
