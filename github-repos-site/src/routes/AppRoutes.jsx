import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

// Pages - Public
import Home from '../pages/Home.jsx';
import Explore from '../pages/Explore.jsx';
import HiddenGems from '../pages/HiddenGems.jsx';
import Trending from '../pages/Trending.jsx';
import Domains from '../pages/Domains.jsx';
import SaveToCollectionModal from '../components/saved/SaveToCollectionModal.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';

// Pages - Protected
import Profile from '../pages/Profile.jsx';
import Collections from '../pages/Collections.jsx';
import SavedRepos from '../pages/SavedRepos.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Official Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/hidden-gems" element={<HiddenGems />} />
      <Route path="/trending" element={<Trending />} />
      <Route path="/domains" element={<Domains />} />
      <Route path="/stash" element={<SaveToCollectionModal />} />
      
      {/* Backward Compatibility Redirects */}
      <Route path="/search" element={<Navigate replace to="/explore" />} />
      <Route path="/gems" element={<Navigate replace to="/hidden-gems" />} />
      <Route path="/categories" element={<Navigate replace to="/domains" />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><SavedRepos /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
