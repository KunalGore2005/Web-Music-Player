import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="h-16 bg-spotify-dark/95 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 border-b border-white/5">
      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-spotify-gray hover:text-white transition-all cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-spotify-gray hover:text-white transition-all cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* User Actions */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-black hover:bg-spotify-card-hover p-1.5 pr-3 rounded-full text-sm font-bold text-white transition-all cursor-pointer border border-white/10"
        >
          <div className="w-7 h-7 rounded-full bg-spotify-green flex items-center justify-center text-black">
            <User className="w-4 h-4" />
          </div>
          <span className="max-w-[100px] truncate">{user?.username}</span>
          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase">
            {user?.role}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-spotify-card border border-white/10 rounded-md shadow-2xl py-1 z-50 text-spotify-gray font-semibold text-xs animate-fade-in">
            <div className="px-4 py-2 border-b border-white/5 text-[10px] text-white/50 truncate">
              Signed in as <br />
              <span className="text-white font-bold">{user?.email || user?.username}</span>
            </div>
            
            {user?.role === 'artist' && (
              <div className="px-4 py-2 flex items-center gap-2 border-b border-white/5 text-spotify-green">
                <Shield className="w-3.5 h-3.5" />
                Artist Console
              </div>
            )}

            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-all cursor-pointer text-white"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
