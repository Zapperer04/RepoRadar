/**
 * User Collections Page
 * Manage custom repository collections
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { user as userApi } from '../utils/apiClient';

const UserCollections = () => {
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
      await fetch(`${process.env.REACT_APP_API_URL}/api/collections/${collectionId}`, {
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

  return (
    <div className="collections-page">
      <header className="page-header">
        <h1 className="page-title">📁 My Collections</h1>
        <p className="page-subtitle">
          Organize your gems into thematic groups.
        </p>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="two-column-layout">
        {/* Left Sidebar: List of Collections */}
        <div className="collections-sidebar">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="search-btn"
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            {showNewForm ? '✕ Close Form' : '✨ New Collection'}
          </button>

          {showNewForm && (
            <div className="sidebar-list" style={{ marginBottom: '1.5rem' }}>
              <form onSubmit={handleCreateCollection}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="e.g. CLI Tools"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="search-input"
                    placeholder="What's this for?"
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    rows="2"
                  />
                </div>
                <button type="submit" className="search-btn" style={{ width: '100%' }}>
                  Create
                </button>
              </form>
            </div>
          )}

          <div className="sidebar-list">
            {isLoading ? (
              <div className="loading-indicator">Scanning collections...</div>
            ) : collections.length === 0 ? (
              <p className="page-subtitle" style={{ textAlign: 'center' }}>No collections found.</p>
            ) : (
              collections.map(collection => (
                <div
                  key={collection.id}
                  className={`info-row ${selectedCollection?.id === collection.id ? 'active-row' : ''}`}
                  onClick={() => setSelectedCollection(collection)}
                  style={{ cursor: 'pointer', padding: '1rem', borderRadius: 'var(--radius-md)', transition: 'all 0.2s' }}
                >
                  <div style={{ fontWeight: '600' }}>{collection.name}</div>
                  <div className="stat-label" style={{ fontSize: '0.7rem', marginTop: '0' }}>
                    {collection.item_count || 0} items
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Content: Collection Details */}
        <div className="collection-details">
          {selectedCollection ? (
            <div className="details-panel">
              <header>
                <h2 className="page-title" style={{ textAlign: 'left', fontSize: '1.75rem', marginBottom: '0.5rem' }}>{selectedCollection.name}</h2>
                <p className="page-subtitle" style={{ margin: '0', textAlign: 'left' }}>{selectedCollection.description || 'No description provided.'}</p>
              </header>

              <div className="collection-placeholder" style={{ padding: '4rem 0', textAlign: 'center', opacity: '0.5' }}>
                <div style={{ fontSize: '3rem' }}>📂</div>
                <p>This collection view is being upgraded.</p>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleDeleteCollection(selectedCollection.id)}
                  className="search-btn"
                  style={{ background: 'transparent', color: '#ff7b72', border: '1px solid #ff7b72' }}
                >
                  🗑️ Delete Collection
                </button>
              </div>
            </div>
          ) : (
            <div className="details-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', opacity: '0.5' }}>
              <p>Select a collection to view its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCollections;
