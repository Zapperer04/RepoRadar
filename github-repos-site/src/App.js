import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Public
import Home from './components/Home';
import Categories from './components/Categories';
import Search from './components/Search'; 
import HiddenGems from './pages/HiddenGems';
import Stash from './components/Stash';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Pages - Protected (requires authentication)
import Profile from './pages/Profile';
import UserCollections from './pages/UserCollections';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="App">
          <Header />
          
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/gems" element={<HiddenGems />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/stash" element={<Stash />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/collections" element={<ProtectedRoute><UserCollections /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;