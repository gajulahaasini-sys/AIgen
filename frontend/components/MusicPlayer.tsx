import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';
import { AUDIO_TRACKS } from '../constants';
import { GlitchText } from './GlitchText';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = AUDIO_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="border-2 border-fuchsia-500 bg-black p-4 flex flex-col gap-4 relative overflow-hidden shadow-[0_0_15px_rgba(255,0,255,0.3)]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-900/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between border-b border-fuchsia-500/50 pb-2">
        <div className="flex items-center gap-2 text-fuchsia-400">
          <Terminal size={16} />
          <span className="text-xs tracking-widest">AUDIO_STIM_MODULE_v1.4</span>
        </div>
        <div className="text-xs text-fuchsia-500 animate-pulse">
          {isPlaying ? 'STATUS: ACTIVE' : 'STATUS: STANDBY'}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs text-gray-500">CURRENT_STREAM:</div>
        <GlitchText 
          text={currentTrack.title} 
          className="text-sm md:text-base text-cyan-300 truncate" 
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-900 border border-fuchsia-900 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-fuchsia-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-4">
          <button 
            onClick={handlePrev}
            className="text-cyan-500 hover:text-fuchsia-400 hover:scale-110 transition-transform focus:outline-none"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="text-fuchsia-500 hover:text-cyan-400 hover:scale-110 transition-transform focus:outline-none"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button 
            onClick={handleNext}
            className="text-cyan-500 hover:text-fuchsia-400 hover:scale-110 transition-transform focus:outline-none"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <button 
          onClick={toggleMute}
          className="text-gray-500 hover:text-cyan-400 transition-colors focus:outline-none"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <audio ref={audioRef} src={currentTrack.url} preload="auto" />
    </div>
  );
};
