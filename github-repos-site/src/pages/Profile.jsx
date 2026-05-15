/**
 * User Profile Page (Maintenance Mode)
 */

import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card, { CardTitle, CardHeader } from '../components/ui/Card.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">👤 Profile Dashboard</h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Under Maintenance</CardTitle>
          </CardHeader>
          <div className="content-stack" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🛠️</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Dashboard is currently offline</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              We are currently re-calibrating the profile analytics engine. 
              Core discovery features, repository tracking, and collections are fully operational.
            </p>
            <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 'var(--space-2)' }}>USER_SESSION_DETAILS:</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>Username:</strong> {user?.username || 'Authenticated'} <br />
                <strong>Status:</strong> Active <br />
                <strong>Access:</strong> Core discovery enabled
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
