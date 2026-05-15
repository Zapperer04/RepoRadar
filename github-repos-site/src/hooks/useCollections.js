import { useState, useEffect, useCallback } from 'react';
import collectionService from '../services/collectionService';

export const useCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await collectionService.getCollections();
      if (response.success) {
        setCollections(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCollection = async (name, description) => {
    try {
      const response = await collectionService.createCollection(name, description);
      if (response.success) {
        setCollections(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const deleteCollection = async (id) => {
    try {
      const response = await collectionService.deleteCollection(id);
      if (response.success) {
        setCollections(prev => prev.filter(c => c.id !== id));
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const addRepoToCollection = async (collectionId, repo) => {
    try {
      const response = await collectionService.addRepoToCollection(collectionId, repo);
      if (response.success) {
        refreshCollections(); // Refresh to update counts
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const removeRepoFromCollection = async (collectionId, savedRepoId) => {
    try {
      const response = await collectionService.removeRepoFromCollection(collectionId, savedRepoId);
      if (response.success) {
        refreshCollections();
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  return { 
    collections, 
    loading, 
    error, 
    refreshCollections, 
    createCollection, 
    deleteCollection, 
    addRepoToCollection, 
    removeRepoFromCollection 
  };
};
