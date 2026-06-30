import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(parseFloat(localStorage.getItem('spotify_volume') || '0.5'));
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);

  const audioRef = useRef(null);

  // Lazy initialization of the audio object
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
  }

  const audio = audioRef.current;

  // Sync volume state with audio element and local storage
  useEffect(() => {
    if (audio) {
      audio.volume = volume;
      localStorage.setItem('spotify_volume', volume.toString());
    }
  }, [volume, audio]);

  // Audio element listeners
  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      // Auto play next track when current ends
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue, queueIndex, audio]);

  const getTrackId = (t) => t?._id || t?.id;

  const playTrack = (track, newQueue = []) => {
    if (!track) return;

    const trackId = getTrackId(track);

    if (newQueue.length > 0) {
      setQueue(newQueue);
      const index = newQueue.findIndex(t => {
        const tid = getTrackId(t);
        return tid && trackId && tid === trackId;
      });
      setQueueIndex(index !== -1 ? index : 0);
    } else {
      const index = queue.findIndex(t => {
        const tid = getTrackId(t);
        return tid && trackId && tid === trackId;
      });
      if (index !== -1) {
        setQueueIndex(index);
      } else {
        const updatedQueue = [...queue, track];
        setQueue(updatedQueue);
        setQueueIndex(updatedQueue.length - 1);
      }
    }

    setCurrentTrack(track);
    audio.src = track.uri;
    audio.load();
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error("Playback failed or was interrupted:", err));
  };

  const togglePlay = () => {
    if (!currentTrack) {
      if (queue.length > 0) {
        playTrack(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Playback failed:", err));
    }
  };

  const nextTrack = () => {
    if (queue.length === 0 || queueIndex === -1) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    const nextT = queue[nextIndex];
    setCurrentTrack(nextT);
    audio.src = nextT.uri;
    audio.load();
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error("Playback failed:", err));
  };

  const prevTrack = () => {
    if (queue.length === 0 || queueIndex === -1) return;
    
    // If track is more than 3 seconds in, restart it instead of going back
    if (audio.currentTime > 3) {
      seek(0);
      return;
    }

    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    const prevT = queue[prevIndex];
    setCurrentTrack(prevT);
    audio.src = prevT.uri;
    audio.load();
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error("Playback failed:", err));
  };

  const seek = (time) => {
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const adjustVolume = (vol) => {
    const val = Math.max(0, Math.min(1, vol));
    setVolume(val);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        adjustVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
