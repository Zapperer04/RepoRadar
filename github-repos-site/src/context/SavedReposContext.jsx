import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import savedService from '../services/savedService';
import { useAuth } from '../hooks/useAuth';

const SavedReposContext = createContext();

export const SavedReposProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [savedRepos, setSavedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSaved = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedRepos([]);
      return;
    }
    setLoading(true);
    try {
      const response = await savedService.getSavedRepos();
      if (response.success) {
        setSavedRepos(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = async (repo) => {
    if (!isAuthenticated) {
      // Redirect to login or handle unauthenticated state
      return { success: false, error: 'Unauthorized' };
    }

    const fullName = repo.fullName || repo.full_name;
    const existing = savedRepos.find(r => r.full_name === fullName || r.fullName === fullName);

    try {
      if (existing) {
        const res = await savedService.unsaveRepo(existing.id);
        if (res.success) {
          setSavedRepos(prev => prev.filter(r => r.id !== existing.id));
          return { success: true, saved: false };
        }
      } else {
        const res = await savedService.saveRepo(repo);
        if (res.success) {
          setSavedRepos(prev => [res.data, ...prev]);
          return { success: true, saved: true };
        }
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
    return { success: false };
  };

  const isSaved = useCallback((fullName) => {
    return savedRepos.some(r => r.full_name === fullName || r.fullName === fullName);
  }, [savedRepos]);

  return (
    <SavedReposContext.Provider value={{ savedRepos, loading, error, toggleSave, isSaved, refreshSaved: fetchSaved }}>
      {children}
    </SavedReposContext.Provider>
  );
};

export const useSavedRepos = () => {
  const context = useContext(SavedReposContext);
  if (!context) throw new Error('useSavedRepos must be used within SavedReposProvider');
  return context;
};
