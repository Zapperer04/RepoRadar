import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import savedService from '../services/savedService';
import { useAuth } from '../hooks/useAuth';
import { normalizeRepo } from '../utils/normalizeRepo';

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
      if (response.success && Array.isArray(response.data)) {
        // Task 2: Normalize data from database
        const normalized = response.data.map(normalizeRepo);
        setSavedRepos(normalized);
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
    return savedRepos.some(r => r.fullName === fullName);
  }, [savedRepos]);

  const saveRepo = async (repo) => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized' };
    try {
      // Task 4: Normalize payload before sending to backend
      const normalizedPayload = normalizeRepo(repo);
      const res = await savedService.saveRepo(normalizedPayload);
      
      if (res.success) {
        const newlySaved = normalizeRepo(res.data);
        setSavedRepos(prev => [newlySaved, ...prev]);
        return { success: true, data: newlySaved };
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
        setSavedRepos(prev => prev.filter(r => r.id !== repoId && r.fullName !== repoId));
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
    return { success: false };
  };

  const toggleSave = async (repo) => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized' };

    const normalized = normalizeRepo(repo);
    const existing = savedRepos.find(r => r.fullName === normalized.fullName);

    if (existing) {
      return await unsaveRepo(existing.id);
    } else {
      return await saveRepo(normalized);
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
