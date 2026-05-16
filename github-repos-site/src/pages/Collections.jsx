import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useCollections } from '../hooks/useCollections.js';

const Collections = () => {
  const { collections, loading, createCollection, deleteCollection } = useCollections();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newName) {
      await createCollection(newName, newDesc);
      setNewName('');
      setNewDesc('');
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">📁 Collections</h1>
            <p className="page-subtitle">Organize your saved repositories into curated folders.</p>
          </div>
          {!isCreating && (
            <Button variant="primary" onClick={() => setIsCreating(true)}>+ New Collection</Button>
          )}
        </header>

        {isCreating && (
          <Card style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)', maxWidth: '600px' }}>
            <form onSubmit={handleCreate}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Create New Collection</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <input 
                  type="text" 
                  placeholder="Collection Name (e.g. AI Tools)" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="rr-input"
                  required
                  autoFocus
                />
                <textarea 
                  placeholder="Description (optional)" 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="rr-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" variant="primary">Create Collection</Button>
                  <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                </div>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <Loader />
          </div>
        ) : collections.length > 0 ? (
          <div className="grid-4">
            {collections.map(c => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle>{c.name}</CardTitle>
                </CardHeader>
                <CardDescription style={{ minHeight: '3rem' }}>
                  {c.description || (c.item_count > 0 ? `${c.item_count} saved repositories` : 'No description')}
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {c.item_count || 0} items
                  </div>
                </CardDescription>
                <CardFooter style={{ gap: '8px' }}>
                  <Link to={`/collections/${c.id}`} style={{ flex: 1 }}>
                    <Button variant="secondary" style={{ width: '100%' }}>View</Button>
                  </Link>
                  <Button variant="ghost" onClick={() => deleteCollection(c.id)} title="Delete collection">🗑️</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Collections" 
            message="Organize your repositories into custom collections to keep track of different project ideas or learning paths."
          />
        )}
      </div>
    </DashboardLayout>
  );
};


export default Collections;
