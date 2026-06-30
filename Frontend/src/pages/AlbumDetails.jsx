import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, ArrowLeft, Disc, Loader, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/TrackRow';
import { API_BASE_URL } from '../config';

const AlbumDetails = () => {
  const { id } = useParams();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API_BASE_URL}/api/music/albums/${id}`, { credentials: 'include' });
        if (!res.ok) {
          throw new Error('Album not found or request failed');
        }
        const data = await res.json();
        setAlbum(data.album);
      } catch (err) {
        console.error(err);
        setError('Error loading album details. Make sure you have authorized access.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-spotify-dark h-full">
        <Loader className="w-8 h-8 text-spotify-green animate-spin" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex-1 overflow-y-auto bg-spotify-dark p-6 text-center">
        <p className="text-red-400 mb-4">{error || 'Album not found'}</p>
        <Link to="/" className="text-white hover:text-spotify-green underline font-bold flex items-center gap-2 justify-center">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const tracks = album.musics || [];

  const getTrackId = (t) => t?._id || t?.id;
  const isCurrentInAlbum = !!currentTrack && tracks.some(t => {
    const tid = getTrackId(t);
    const cid = getTrackId(currentTrack);
    return tid && cid && tid === cid;
  });

  const isAlbumPlaying = isCurrentInAlbum && isPlaying;

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;
    
    if (isCurrentInAlbum) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-green/10 to-spotify-dark px-6 py-6 no-scrollbar h-full pb-28 animate-fade-in">
      {/* Header Back Button */}
      <Link to="/" className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all mb-4">
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* Album Billboard */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 select-none">
        <div className="w-44 h-44 bg-gradient-to-br from-spotify-green/20 to-black rounded-lg shadow-2xl flex items-center justify-center border border-white/5 shrink-0">
          <Disc className="w-20 h-20 text-spotify-green animate-pulse" />
        </div>
        <div className="flex flex-col text-center md:text-left">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">
            Album
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {album.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-spotify-gray font-semibold">
            <span className="text-white hover:underline cursor-pointer">
              {album.artist?.username || 'Artist'}
            </span>
            <span>•</span>
            <span>{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>
      </div>

      {/* Play Bar Section */}
      <div className="flex items-center gap-4 mb-6">
        {tracks.length > 0 && (
          <button
            onClick={handlePlayAlbum}
            className="w-12 h-12 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            {isAlbumPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* Tracks Table / List */}
      <div>
        {tracks.length > 0 ? (
          <div className="flex flex-col gap-1">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-spotify-gray uppercase tracking-widest border-b border-white/5 select-none mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-11 pl-1">Title</div>
            </div>
            
            {tracks.map((track, index) => (
              <TrackRow
                key={track._id || track.id}
                track={track}
                index={index}
                queue={tracks}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-spotify-card rounded-lg border border-white/5">
            <Music className="w-8 h-8 text-spotify-gray/30 mx-auto mb-2" />
            <p className="text-xs font-bold text-white mb-1">This album has no tracks</p>
            <p className="text-[11px] text-spotify-gray">
              Upload music tracks first, and include them when creating albums.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetails;
