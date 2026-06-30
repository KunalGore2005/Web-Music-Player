import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AlbumCard from '../components/AlbumCard';
import TrackRow from '../components/TrackRow';
import { Music, Disc, Loader } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Home = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [songsRes, albumsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/music/`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/api/music/getAlbums`, { credentials: 'include' })
        ]);

        if (!songsRes.ok || !albumsRes.ok) {
          throw new Error('Failed to load content from the server');
        }

        const songsData = await songsRes.json();
        const albumsData = await albumsRes.json();

        setSongs(songsData.musics || []);
        setAlbums(albumsData.albums || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Could not retrieve tracks or albums. Ensure the database/server is online.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-spotify-dark h-full">
        <Loader className="w-8 h-8 text-spotify-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1e1e1e] to-spotify-dark px-6 py-6 no-scrollbar h-full pb-28 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-white tracking-tight mb-6 select-none">
        {getGreeting()}, {user?.username}
      </h1>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Albums Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight hover:underline cursor-pointer select-none">
            Featured Albums
          </h2>
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album._id || album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="bg-spotify-card p-6 rounded-lg text-center border border-white/5">
            <Disc className="w-10 h-10 text-spotify-gray/30 mx-auto mb-2" />
            <p className="text-xs font-bold text-white mb-1">No albums found</p>
            <p className="text-[11px] text-spotify-gray">
              Switch role to Artist and upload music to construct the first album!
            </p>
          </div>
        )}
      </div>

      {/* Tracks Section */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight hover:underline cursor-pointer mb-4 select-none">
          Recent Songs
        </h2>

        {songs.length > 0 ? (
          <div className="bg-black/25 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1">
            {songs.map((song, index) => (
              <TrackRow
                key={song._id || song.id}
                track={song}
                index={index}
                queue={songs}
              />
            ))}
          </div>
        ) : (
          <div className="bg-spotify-card p-6 rounded-lg text-center border border-white/5">
            <Music className="w-10 h-10 text-spotify-gray/30 mx-auto mb-2" />
            <p className="text-xs font-bold text-white mb-1">No tracks available</p>
            <p className="text-[11px] text-spotify-gray">
              Upload music in the Artist Studio to make tracks available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
