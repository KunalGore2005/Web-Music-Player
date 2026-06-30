import React, { useState, useEffect } from 'react';
import { Upload, Plus, Music, Check, Loader, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const ArtistStudio = () => {
  const { user } = useAuth();
  
  // Track upload states
  const [trackTitle, setTrackTitle] = useState('');
  const [trackFile, setTrackFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  // Album creation states
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [albumMessage, setAlbumMessage] = useState({ text: '', type: '' });

  // Loaded data
  const [myTracks, setMyTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);

  const fetchMyTracks = async () => {
    try {
      setLoadingTracks(true);
      const res = await fetch(`${API_BASE_URL}/api/music/`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        // Filter tracks created by current user
        const filtered = (data.musics || []).filter(
          song => song.artist?._id === user?.id || song.artist === user?.id
        );
        setMyTracks(filtered);
      }
    } catch (err) {
      console.error("Error fetching artist's tracks:", err);
    } finally {
      setLoadingTracks(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyTracks();
    }
  }, [user]);

  const handleTrackFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setTrackFile(e.target.files[0]);
    }
  };

  const handleUploadTrack = async (e) => {
    e.preventDefault();
    if (!trackTitle.trim() || !trackFile) {
      setUploadMessage({ text: 'Please enter a title and select an audio file', type: 'error' });
      return;
    }

    try {
      setUploading(true);
      setUploadMessage({ text: '', type: '' });

      const formData = new FormData();
      formData.append('title', trackTitle.trim());
      formData.append('music', trackFile);

      const res = await fetch(`${API_BASE_URL}/api/music/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setUploadMessage({ text: 'Track uploaded successfully!', type: 'success' });
      setTrackTitle('');
      setTrackFile(null);
      
      const fileInput = document.getElementById('music-upload');
      if (fileInput) fileInput.value = '';
      
      await fetchMyTracks();
    } catch (err) {
      console.error(err);
      setUploadMessage({ text: err.message || 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleTrackCheckboxChange = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) {
      setAlbumMessage({ text: 'Please enter an album title', type: 'error' });
      return;
    }
    if (selectedTracks.length === 0) {
      setAlbumMessage({ text: 'Select at least one track for the album', type: 'error' });
      return;
    }

    try {
      setCreatingAlbum(true);
      setAlbumMessage({ text: '', type: '' });

      const res = await fetch(`${API_BASE_URL}/api/music/album`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: albumTitle.trim(),
          musics: selectedTracks,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Album creation failed');
      }

      setAlbumMessage({ text: 'Album created successfully!', type: 'success' });
      setAlbumTitle('');
      setSelectedTracks([]);
    } catch (err) {
      console.error(err);
      setAlbumMessage({ text: err.message || 'Album creation failed', type: 'error' });
    } finally {
      setCreatingAlbum(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1b281d] to-spotify-dark px-6 py-6 no-scrollbar h-full pb-28 animate-fade-in text-white">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-7 h-7 text-spotify-green animate-pulse" />
        <h1 className="text-2xl font-extrabold tracking-tight select-none">Artist Studio</h1>
      </div>
      <p className="text-spotify-gray text-xs mb-8 leading-relaxed max-w-xl select-none">
        Welcome to your creative dashboard, <strong className="text-white">{user?.username}</strong>. 
        Here, you can upload new songs and package them into albums for the Spotify community to hear.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Column 1: Upload Song */}
        <div className="bg-spotify-card border border-white/5 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-4 border-b border-white/5 pb-2 select-none">
              <Upload className="w-4.5 h-4.5 text-spotify-green" />
              Upload New Track
            </h2>

            {uploadMessage.text && (
              <div className={`mb-4 px-4 py-2 rounded-lg text-[11px] font-semibold ${
                uploadMessage.type === 'success' 
                  ? 'bg-spotify-green/10 border border-spotify-green/20 text-spotify-green' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {uploadMessage.text}
              </div>
            )}

            <form onSubmit={handleUploadTrack} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-spotify-gray uppercase tracking-wider">
                  Track Title
                </label>
                <input
                  type="text"
                  placeholder="Enter track name"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 hover:border-white/20 focus:border-spotify-green rounded px-3 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-spotify-gray uppercase tracking-wider">
                  Audio File (.mp3)
                </label>
                <div className="border border-dashed border-white/10 hover:border-white/20 rounded-lg p-6 text-center bg-black/20 flex flex-col items-center gap-2 relative transition-all">
                  <Music className="w-8 h-8 text-spotify-gray/40" />
                  <span className="text-[11px] text-spotify-gray truncate max-w-full px-2">
                    {trackFile ? trackFile.name : 'Select or drag audio file'}
                  </span>
                  <input
                    type="file"
                    id="music-upload"
                    accept="audio/*"
                    onChange={handleTrackFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-bold py-2.5 rounded-full mt-2 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:scale-100 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Publish Track'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Column 2: Create Album */}
        <div className="bg-spotify-card border border-white/5 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-4 border-b border-white/5 pb-2 select-none">
              <Plus className="w-4.5 h-4.5 text-spotify-green" />
              Compile New Album
            </h2>

            {albumMessage.text && (
              <div className={`mb-4 px-4 py-2 rounded-lg text-[11px] font-semibold ${
                albumMessage.type === 'success' 
                  ? 'bg-spotify-green/10 border border-spotify-green/20 text-spotify-green' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {albumMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateAlbum} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-spotify-gray uppercase tracking-wider">
                  Album Title
                </label>
                <input
                  type="text"
                  placeholder="Enter album name"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 hover:border-white/20 focus:border-spotify-green rounded px-3 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-spotify-gray uppercase tracking-wider">
                  Select Tracks to Include
                </label>
                
                {loadingTracks ? (
                  <div className="flex items-center gap-2 py-4 justify-center text-xs text-spotify-gray">
                    <Loader className="w-4 h-4 animate-spin text-spotify-green" />
                    Checking uploads...
                  </div>
                ) : myTracks.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto border border-white/5 bg-black/20 rounded-md p-1.5 flex flex-col gap-1.5 no-scrollbar">
                    {myTracks.map((track) => {
                      const isChecked = selectedTracks.includes(track._id || track.id);
                      return (
                        <div
                          key={track._id || track.id}
                          onClick={() => handleTrackCheckboxChange(track._id || track.id)}
                          className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer transition-all"
                        >
                          <span className="text-xs text-white font-medium truncate pr-4">
                            {track.title}
                          </span>
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'bg-spotify-green border-spotify-green text-black' 
                              : 'border-white/20 text-transparent'
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-[11px] text-spotify-gray/60 border border-white/5 rounded-md bg-black/10">
                    No tracks uploaded yet. Upload a track first.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={creatingAlbum || selectedTracks.length === 0}
                className="bg-spotify-green hover:bg-spotify-green-hover text-black text-xs font-bold py-2.5 rounded-full mt-2 transition-all active:scale-95 disabled:opacity-40 disabled:scale-100 cursor-pointer"
              >
                {creatingAlbum ? 'Assembling...' : 'Create Album'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Uploaded Tracks List */}
      <div className="bg-spotify-card border border-white/5 p-6 rounded-lg shadow-lg">
        <h2 className="text-base font-bold mb-4 border-b border-white/5 pb-2 select-none">
          Your Published Tracks
        </h2>
        
        {loadingTracks ? (
          <div className="flex items-center gap-2 py-6 justify-center text-xs text-spotify-gray">
            <Loader className="w-4 h-4 animate-spin text-spotify-green" />
            Loading tracks...
          </div>
        ) : myTracks.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {myTracks.map((track, idx) => (
              <div
                key={track._id || track.id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-white/5 border border-white/5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded bg-spotify-green/10 flex items-center justify-center text-spotify-green shrink-0">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{track.title}</span>
                    <span className="text-[9px] text-spotify-gray">Track #{idx + 1}</span>
                  </div>
                </div>
                <div className="text-[9px] bg-spotify-green/15 text-spotify-green px-2.5 py-0.5 rounded-full font-bold select-none shrink-0 uppercase tracking-wider">
                  Live
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-spotify-gray/60 bg-black/10 rounded-lg">
            You haven't uploaded any tracks yet. Use the upload card above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistStudio;
