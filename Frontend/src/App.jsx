import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Player from './components/Player';

// Pages
import Home from './pages/Home';
import AlbumDetails from './pages/AlbumDetails';
import ArtistStudio from './pages/ArtistStudio';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route wrappers
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-spotify-green">
        <div className="w-8 h-8 border-4 border-t-transparent border-spotify-green rounded-full animate-spin"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const ArtistRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'artist' ? children : <Navigate to="/" replace />;
};

// Layout wrapper for authenticated users
const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white select-none">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-0 bg-spotify-dark">
          <Navbar />
          <div className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/album/:id" element={<AlbumDetails />} />
              <Route path="/studio" element={<ArtistRoute><ArtistStudio /></ArtistRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
      <Player />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected app routes */}
            <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
          </Routes>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;