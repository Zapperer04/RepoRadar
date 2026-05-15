import { useState, useEffect, useCallback } from 'react';
import savedService from '../services/savedService';

export const useSavedRepos = () => {
  const [savedRepos, setSavedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshSavedRepos = useCallback(async () => {
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
  }, []);

  const saveRepo = async (repo) => {
    try {
      const response = await savedService.saveRepo(repo);
      if (response.success) {
        setSavedRepos(prev => [response.data, ...prev]);
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const unsaveRepo = async (repoId) => {
    try {
      const response = await savedService.unsaveRepo(repoId);
      if (response.success) {
        setSavedRepos(prev => prev.filter(r => r.id !== repoId && r.fullName !== repoId));
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const isRepoSaved = (fullName) => {
    return savedRepos.some(r => r.full_name === fullName || r.fullName === fullName);
  };

  useEffect(() => {
    refreshSavedRepos();
  }, [refreshSavedRepos]);

  return { savedRepos, loading, error, refreshSavedRepos, saveRepo, unsaveRepo, isRepoSaved };
};
