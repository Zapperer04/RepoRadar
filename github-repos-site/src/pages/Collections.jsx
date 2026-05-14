/**
 * User Collections Page
 * Manage custom repository collections
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { user as userApi } from '../services/apiClient';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';

const Collections = () => {
  const { getToken } = useAuth();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getCollections();
      setCollections(data.collections || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      setError('Collection name is required');
      return;
    }

    try {
      const data = await userApi.createCollection(newCollectionName, newCollectionDesc);
      setCollections([...collections, data.collection]);
      setNewCollectionName('');
      setNewCollectionDesc('');
      setShowNewForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5005'}/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      
      setCollections(prev => prev.filter(c => c.id !== collectionId));
      setSelectedCollection(null);
    } catch (err) {
      setError('Failed to delete collection');
    }
  };

  const sidebar = (
    <div className="content-stack">
      <Button
        onClick={() => setShowNewForm(!showNewForm)}
        variant="primary"
        style={{ width: '100%' }}
      >
        {showNewForm ? '✕ Close Form' : '✨ New Collection'}
      </Button>

      {showNewForm && (
        <form onSubmit={handleCreateCollection} className="content-stack" style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Name</label>
            <Input
              type="text"
              placeholder="e.g. CLI Tools"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
            <Input
              placeholder="What's this for?"
              value={newCollectionDesc}
              onChange={(e) => setNewCollectionDesc(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" style={{ width: '100%' }}>
            Create
          </Button>
        </form>
      )}

      <div className="content-stack">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4)' }}>
            <Loader />
          </div>
        ) : collections.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-4)' }}>No collections found.</p>
        ) : (
          collections.map(collection => (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(collection)}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: selectedCollection?.id === collection.id ? 'var(--bg-elevated)' : 'transparent',
                border: `1px solid ${selectedCollection?.id === collection.id ? 'var(--border-strong)' : 'transparent'}`,
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ fontWeight: '600', color: selectedCollection?.id === collection.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{collection.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {collection.item_count || 0} items
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      <div style={{ padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">📁 My Collections</h1>
          <p className="page-subtitle">
            Organize your gems into thematic groups.
          </p>
        </header>

        {error && <div className="rr-error-state" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}

        <div style={{ flex: 1 }}>
          {selectedCollection ? (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <header style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <h2 className="section-title">{selectedCollection.name}</h2>
                <p className="section-subtitle">{selectedCollection.description || 'No description provided.'}</p>
              </header>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState 
                  icon="📂"
                  title="Coming Soon"
                  message="This collection view is being upgraded in a future update."
                />
              </div>

              <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)' }}>
                <Button
                  onClick={() => handleDeleteCollection(selectedCollection.id)}
                  variant="danger"
                >
                  🗑️ Delete Collection
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmptyState 
                icon="📁"
                title="No Collection Selected"
                message="Select a collection from the sidebar to view its contents."
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Collections;
