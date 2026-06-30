import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Mic, Disc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isSelected = (path) => location.pathname === path;

  return (
    <div className="hidden md:block w-64 bg-black h-full flex flex-col p-2 gap-2 text-spotify-gray">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-4 text-white">
        <Disc className="w-9 h-9 text-spotify-green animate-pulse" />
        <span className="text-xl font-extrabold tracking-tight">Web Music Player</span>
      </div>

      {/* Main Navigation Panel */}
      <div className="bg-spotify-dark rounded-lg p-4 flex flex-col gap-4">
        <Link
          to="/"
          className={`flex items-center gap-4 font-bold text-sm transition-all duration-200 hover:text-white ${
            isSelected('/') ? 'text-white' : ''
          }`}
        >
          <Home className="w-6 h-6" />
          Home
        </Link>
      </div>

      {/* Library / Artist Panel */}
      <div className="bg-spotify-dark rounded-lg p-4 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between font-bold text-sm text-white px-1">
          <span className="flex items-center gap-3">
            <Library className="w-6 h-6" />
            Your Library
          </span>
        </div>

        {/* Display Artist Controls if Role matches */}
        {user?.role === 'artist' && (
          <div className="mt-2 flex flex-col gap-3 border-t border-white/5 pt-4">
            <div className="text-[10px] font-bold text-white/40 tracking-wider uppercase px-1">
              Artist Studio
            </div>
            
            <Link
              to="/studio"
              className={`flex items-center gap-4 font-bold text-sm transition-all duration-200 hover:text-white ${
                isSelected('/studio') ? 'text-white' : ''
              }`}
            >
              <Mic className="w-5 h-5 text-spotify-green" />
              Artist Studio
            </Link>
          </div>
        )}

        <div className="mt-auto bg-spotify-card p-4 rounded-lg flex flex-col gap-3">
          <span className="text-white text-xs font-bold">
            {user?.role === 'artist' ? 'Share your latest beats' : 'Love music?'}
          </span>
          <span className="text-[11px] text-spotify-gray leading-normal">
            {user?.role === 'artist' 
              ? 'Upload your tracks and organize them into full-length albums for listeners.' 
              : 'Sign up as an artist during registration to upload your own tracks and albums!'}
          </span>
          {user?.role === 'artist' ? (
            <Link
              to="/studio"
              className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full text-center hover:scale-105 transition-all duration-200 w-fit"
            >
              Go to Studio
            </Link>
          ) : (
            <div className="text-[11px] text-spotify-green font-bold">
              Account Mode: Listener
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
