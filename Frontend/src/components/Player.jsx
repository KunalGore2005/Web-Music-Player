import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    adjustVolume,
  } = usePlayer();

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    adjustVolume(parseFloat(e.target.value));
  };

  return (
    <div className="h-20 bg-spotify-dark border-t border-white/5 flex items-center justify-between px-6 z-50">
      {/* Left side: Track Info */}
      <div className="flex items-center gap-3 w-1/3 min-w-[200px]">
        {currentTrack ? (
          <>
            <div className="w-12 h-12 bg-spotify-green/10 rounded flex items-center justify-center border border-spotify-green/20 relative group overflow-hidden shrink-0">
              <Music className={`w-5 h-5 text-spotify-green ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </span>
              <span className="text-spotify-gray text-[10px] truncate hover:underline hover:text-white cursor-pointer">
                {currentTrack.artist?.username || 'Unknown Artist'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-spotify-card rounded flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-spotify-gray" />
            </div>
            <div className="flex flex-col">
              <span className="text-spotify-gray text-xs font-semibold">No track playing</span>
              <span className="text-spotify-gray/50 text-[10px]">Select a song to play</span>
            </div>
          </>
        )}
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3 max-w-[500px]">
        <div className="flex items-center gap-5">
          <button
            onClick={prevTrack}
            disabled={!currentTrack}
            className="text-spotify-gray hover:text-white transition-all disabled:opacity-30 disabled:hover:text-spotify-gray cursor-pointer"
            title="Previous"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={nextTrack}
            disabled={!currentTrack}
            className="text-spotify-gray hover:text-white transition-all disabled:opacity-30 disabled:hover:text-spotify-gray cursor-pointer"
            title="Next"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full text-[10px] text-spotify-gray">
          <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            disabled={!currentTrack}
            className="flex-1 accent-spotify-green bg-white/10 hover:bg-white/20 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          />
          <span className="w-8 text-left shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right side: Volume */}
      <div className="flex items-center justify-end gap-2.5 w-1/3 min-w-[120px]">
        <button
          onClick={() => adjustVolume(volume > 0 ? 0 : 0.5)}
          className="text-spotify-gray hover:text-white transition-all cursor-pointer shrink-0"
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          {volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 accent-spotify-green bg-white/10 hover:bg-white/20 h-1 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Player;
