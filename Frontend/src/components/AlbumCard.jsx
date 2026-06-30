import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Disc } from 'lucide-react';

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/album/${album._id || album.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-spotify-card hover:bg-spotify-card-hover p-4 rounded-lg flex flex-col gap-3 group transition-all duration-200 relative cursor-pointer shadow-lg w-full"
    >
      {/* Album Artwork Cover */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-spotify-green/20 to-[#282828] rounded-md flex items-center justify-center border border-white/5 overflow-hidden shadow-md shrink-0">
        <Disc className="w-16 h-16 text-spotify-green/20 group-hover:text-spotify-green/45 group-hover:rotate-12 transition-all duration-500" />
        
        {/* Hover Floating Play Button */}
        <button
          className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-2xl hover:scale-105 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/album/${album._id || album.id}`);
          }}
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </button>
      </div>

      {/* Album Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-white text-xs font-bold truncate">{album.title}</span>
        <span className="text-spotify-gray text-[10px] truncate">
          Album • {album.artist?.username || 'Artist'}
        </span>
      </div>
    </div>
  );
};

export default AlbumCard;
