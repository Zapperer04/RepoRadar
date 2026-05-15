import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import savedService from '../services/savedService';
import { useAuth } from '../hooks/useAuth';

export const SavedReposContext = createContext();

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

  const isSaved = useCallback((fullName) => {
    return savedRepos.some(r => r.full_name === fullName || r.fullName === fullName);
  }, [savedRepos]);

  const saveRepo = async (repo) => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized' };
    try {
      const res = await savedService.saveRepo(repo);
      if (res.success) {
        setSavedRepos(prev => [res.data, ...prev]);
        return { success: true, data: res.data };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
    return { success: false };
  };

  const unsaveRepo = async (repoId) => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized' };
    try {
      const res = await savedService.unsaveRepo(repoId);
      if (res.success) {
        setSavedRepos(prev => prev.filter(r => r.id !== repoId && r.full_name !== repoId && r.fullName !== repoId));
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
    return { success: false };
  };

  const toggleSave = async (repo) => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized' };

    const fullName = repo.fullName || repo.full_name;
    const existing = savedRepos.find(r => r.full_name === fullName || r.fullName === fullName);

    if (existing) {
      return await unsaveRepo(existing.id);
    } else {
      return await saveRepo(repo);
    }
  };

  return (
    <SavedReposContext.Provider value={{ 
      savedRepos, 
      loading, 
      error, 
      toggleSave, 
      saveRepo,
      unsaveRepo,
      isSaved, 
      refreshSaved: fetchSaved 
    }}>
      {children}
    </SavedReposContext.Provider>
  );
};

export default SavedReposContext;
