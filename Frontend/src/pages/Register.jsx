import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Disc, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(username.trim(), email.trim(), password.trim(), role);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 animate-fade-in">
      {/* Branding Logo */}
      <div className="flex items-center gap-3 mb-8 text-white">
        <Disc className="w-12 h-12 text-spotify-green animate-pulse" />
        <span className="text-3xl font-extrabold tracking-tight">Web Music Player</span>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-spotify-dark rounded-xl p-8 shadow-2xl border border-white/5">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Sign up to Web Music Player</h2>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-spotify-green rounded px-3 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-spotify-green rounded px-3 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-spotify-green rounded px-3 py-2 text-xs text-white focus:outline-none transition-all placeholder:text-white/30"
            />
          </div>

          {/* Account Role Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white uppercase tracking-wider">
              I want to register as a:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  role === 'user'
                    ? 'bg-spotify-green text-black'
                    : 'text-spotify-gray hover:text-white'
                }`}
              >
                Listener
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  role === 'artist'
                    ? 'bg-spotify-green text-black'
                    : 'text-spotify-gray hover:text-white'
                }`}
              >
                Artist
              </button>
            </div>
            <p className="text-[10px] text-spotify-gray leading-relaxed px-1">
              {role === 'artist'
                ? 'Artists can upload audio files, name tracks, and combine them into listener-facing albums.'
                : 'Listeners can browse uploaded tracks, play albums, search, and manage active media playback.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-spotify-green hover:bg-spotify-green-hover text-black font-bold text-xs py-3 rounded-full mt-2 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-spotify-gray">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-spotify-green underline font-bold transition-all ml-1">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
