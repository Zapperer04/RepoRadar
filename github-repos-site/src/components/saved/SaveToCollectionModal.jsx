import React, { useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import { useCollections } from '../../hooks/useCollections.js';
import Loader from '../ui/Loader.jsx';

const SaveToCollectionModal = ({ repo, onClose }) => {
  const { collections, loading, addRepoToCollection, createCollection } = useCollections();
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAddToCollection = async (collectionId) => {
    setIsAdding(true);
    setError(null);
    try {
      const ok = await addRepoToCollection(collectionId, repo);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError('Failed to add to collection. It might already be there.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newName) return;

    setIsAdding(true);
    try {
      const newCol = await createCollection(newName);
      if (newCol) {
        await handleAddToCollection(newCol.id);
      }
    } catch (err) {
      setError(err.message);
      setIsAdding(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: 'var(--space-6)',
        backgroundColor: 'var(--bg-card)',
        maxHeight: '80vh',
        overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add to Collection</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
          Organizing <strong>{repo.fullName}</strong>
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--success)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>✅</div>
            <p style={{ fontWeight: 600 }}>Successfully added!</p>
          </div>
        ) : (
          <>
            {error && <div style={{ color: 'var(--danger)', marginBottom: 'var(--space-4)', fontSize: '0.85rem' }}>⚠️ {error}</div>}

            {isCreating ? (
              <form onSubmit={handleCreateAndAdd} style={{ marginBottom: 'var(--space-6)' }}>
                <input 
                  type="text" 
                  placeholder="New collection name" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="rr-input"
                  style={{ marginBottom: '8px' }}
                  autoFocus
                  required
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button type="submit" variant="primary" style={{ flex: 1 }} disabled={isAdding}>Create & Add</Button>
                  <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} disabled={isAdding}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-6)' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}><Loader size="sm" /></div>
                ) : collections.length > 0 ? (
                  collections.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleAddToCollection(c.id)}
                      disabled={isAdding}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        cursor: isAdding ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => e.target.style.borderColor = 'var(--accent-primary)'}
                      onMouseLeave={e => e.target.style.borderColor = 'var(--border-subtle)'}
                    >
                      <span>{c.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.item_count || 0} items</span>
                    </button>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-4)' }}>No collections found.</p>
                )}
                
                <Button 
                  variant="secondary" 
                  style={{ width: '100%', marginTop: '8px' }} 
                  onClick={() => setIsCreating(true)}
                  disabled={isAdding}
                >
                  + Create New Collection
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};


export default SaveToCollectionModal;
