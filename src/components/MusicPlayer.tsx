import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Grid Algorithm", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Cyber Synth Pulse", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "AI Generated Groove", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentTrack]);

  return (
    <div className="w-full h-full px-6 grid grid-cols-1 md:grid-cols-[280px_1fr_280px] items-center gap-4 text-slate-50">
      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Now Playing */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded bg-gradient-to-br from-[#00f3ff] to-black flex shrink-0 items-center justify-center shadow-[0_0_10px_rgba(0,243,255,0.2)]">
          <Music className="w-6 h-6 text-white/80" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-base font-semibold truncate text-slate-50">{TRACKS[currentTrack].title}</div>
          <div className="text-xs text-slate-400 truncate">Vaporwave Synthesizer Vol. {currentTrack + 1}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button onClick={skipBackward} className="text-slate-50 hover:text-[#00f3ff] transition-colors cursor-pointer border-none bg-transparent">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-1 fill-current" />}
          </button>
          <button onClick={skipForward} className="text-slate-50 hover:text-[#00f3ff] transition-colors cursor-pointer border-none bg-transparent">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="w-full max-w-[400px] h-1 bg-slate-700 rounded-sm relative mt-1">
          <div className="absolute top-0 left-0 h-full w-[45%] bg-[#00f3ff] rounded-sm shadow-[0_0_10px_#00f3ff]"></div>
          <div className="w-full flex justify-between absolute top-2 text-[10px] text-slate-400">
            <span>0:00</span>
            <span>3:42</span>
          </div>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="hidden md:flex justify-end items-center gap-3 text-slate-400 text-sm">
        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-slate-200 transition-colors cursor-pointer bg-transparent border-none">
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
        </button>
        <div className="w-[100px] h-1 bg-slate-700 rounded-sm relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="h-full bg-slate-50 rounded-sm" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}
