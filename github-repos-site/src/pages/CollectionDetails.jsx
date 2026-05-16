import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import collectionService from '../services/collectionService.js';
import { normalizeRepo } from '../utils/normalizeRepo.js';

const CollectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await collectionService.getCollection(id);
      if (response.success) {
        // Normalize repos inside the collection
        const normalizedRepos = (response.data.repos || []).map(normalizeRepo);
        setCollection({ ...response.data, repos: normalizedRepos });
      } else {
        setError(response.error || 'Collection not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleRemoveRepo = async (repoId) => {
    if (!window.confirm('Remove this repository from the collection?')) return;
    
    try {
      const ok = await collectionService.removeRepoFromCollection(id, repoId);
      if (ok) {
        setCollection(prev => ({
          ...prev,
          repos: prev.repos.filter(r => r.id !== repoId)
        }));
      }
    } catch (err) {
      alert('Failed to remove: ' + err.message);
    }
  };

  const handleDeleteCollection = async () => {
    if (!window.confirm('Are you sure you want to delete this entire collection?')) return;
    
    try {
      const ok = await collectionService.deleteCollection(id);
      if (ok) {
        navigate('/collections');
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !collection) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <EmptyState title="Error" message={error || 'Collection not found'} />
          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <Link to="/collections">
              <Button variant="secondary">Back to Collections</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Link to="/collections" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            ← Back to Collections
          </Link>
        </div>

        <header className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">📁 {collection.name}</h1>
            <p className="page-subtitle">{collection.description || 'No description provided.'}</p>
            <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {collection.repos.length} repositories in this collection
            </div>
          </div>
          <Button variant="ghost" onClick={handleDeleteCollection} style={{ color: 'var(--danger)' }}>
            Delete Collection
          </Button>
        </header>

        {collection.repos.length > 0 ? (
          <RepoGrid repos={collection.repos} onRemoveFromCollection={handleRemoveRepo} />
        ) : (
          <EmptyState 
            title="Empty Collection" 
            message="You haven't added any repositories to this collection yet. Go to your Saved page to organize your stash."
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CollectionDetails;
