import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useCollections } from '../hooks/useCollections.js';

const Collections = () => {
  const { collections, loading, createCollection, deleteCollection } = useCollections();

  const handleCreate = async () => {
    const name = prompt('Enter collection name:');
    if (name) {
      await createCollection(name);
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
          <Button variant="primary" onClick={handleCreate}>+ New Collection</Button>
        </header>

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
                <CardDescription>
                  {c.item_count || 0} saved repositories
                </CardDescription>
                <CardFooter style={{ gap: '8px' }}>
                  <Button variant="secondary" style={{ flex: 1 }}>View</Button>
                  <Button variant="ghost" onClick={() => deleteCollection(c.id)}>🗑️</Button>
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
