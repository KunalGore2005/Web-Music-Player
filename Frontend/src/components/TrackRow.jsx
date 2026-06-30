import React, { useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const TrackRow = ({ track, index, queue }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [hovered, setHovered] = useState(false);

  const getTrackId = (t) => t?._id || t?.id;
  const isActive = !!currentTrack && getTrackId(currentTrack) === getTrackId(track);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`grid grid-cols-12 items-center px-4 py-2 rounded-md hover:bg-white/10 group transition-all duration-150 cursor-pointer ${
        isActive ? 'bg-white/5 text-spotify-green' : 'text-spotify-gray'
      }`}
      onClick={handlePlayClick}
    >
      {/* Index or Play icon */}
      <div className="col-span-1 flex items-center justify-start text-xs font-semibold select-none">
        {hovered ? (
          <button 
            onClick={handlePlayClick} 
            className="text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            {isActive && isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current text-spotify-green" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-white ml-0.5" />
            )}
          </button>
        ) : (
          <span className="w-4 flex justify-center">
            {isActive && isPlaying ? (
              <div className="flex gap-[2px] items-end h-3 w-3 pb-[1px]">
                <span className="w-[2px] bg-spotify-green animate-[bounce_0.6s_infinite_100ms] h-full" style={{ animationDelay: '0.1s' }} />
                <span className="w-[2px] bg-spotify-green animate-[bounce_0.6s_infinite_300ms] h-3/4" style={{ animationDelay: '0.3s' }} />
                <span className="w-[2px] bg-spotify-green animate-[bounce_0.6s_infinite_200ms] h-1/2" style={{ animationDelay: '0.2s' }} />
              </div>
            ) : (
              <span className={isActive ? 'text-spotify-green font-bold' : 'text-spotify-gray'}>
                {index + 1}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Track Title and Artist Info */}
      <div className="col-span-11 flex items-center gap-3 pl-1 min-w-0">
        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-spotify-gray group-hover:bg-white/10 transition-all shrink-0">
          <Music className={`w-4 h-4 ${isActive ? 'text-spotify-green' : 'text-spotify-gray'}`} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className={`text-sm font-semibold truncate ${isActive ? 'text-spotify-green' : 'text-white'}`}>
            {track.title}
          </span>
          <span className="text-[11px] text-spotify-gray truncate group-hover:text-white/60">
            {track.artist?.username || 'Unknown Artist'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackRow;
