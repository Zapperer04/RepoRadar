/**
 * User Profile Page
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { auth as authApi, user as userApi } from '../services/apiClient';
import MainLayout from '../layouts/MainLayout.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card, { CardTitle, CardHeader } from '../components/ui/Card.jsx';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(user || {});
  const [stats, setStats] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const data = await authApi.me();
      setProfileData(data.user);
      setStats(data.user.stats || {});
    } catch (err) {
      setError('Failed to load profile');
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await userApi.updateProfile({
        fullName: profileData.full_name,
        avatarUrl: profileData.avatar_url,
        bio: profileData.bio,
      });

      setProfileData(data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">👤 My Profile</h1>
        </header>

        {error && <div className="rr-error-state" style={{ marginBottom: 'var(--space-4)' }}>⚠️ {error}</div>}
        {success && <div className="rr-error-state" style={{ marginBottom: 'var(--space-4)', backgroundColor: 'rgba(34, 197, 94, 0.05)', color: 'var(--success)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>✅ {success}</div>}

        <div className="grid-3">
          <div style={{ gridColumn: '1 / span 2' }}>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>

              {isEditing ? (
                <div className="content-stack">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                    <Input type="email" value={profileData.email} disabled />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Username</label>
                    <Input type="text" value={profileData.username} disabled />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
                    <Input
                      type="text"
                      name="full_name"
                      value={profileData.full_name || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avatar URL</label>
                    <Input
                      type="text"
                      name="avatar_url"
                      value={profileData.avatar_url || ''}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bio</label>
                    <textarea
                      className="rr-input"
                      name="bio"
                      value={profileData.bio || ''}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                    <Button onClick={handleSave} variant="primary" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="secondary" disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="content-stack">
                  <div className="rr-stat-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                    <span>{profileData.email}</span>
                  </div>
                  <div className="rr-stat-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Username</span>
                    <span>{profileData.username}</span>
                  </div>
                  <div className="rr-stat-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Full Name</span>
                    <span>{profileData.full_name || 'Not set'}</span>
                  </div>
                  <div className="rr-stat-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Bio</span>
                    <span style={{ textAlign: 'right', maxWidth: '60%' }}>{profileData.bio || 'No bio'}</span>
                  </div>
                  <div className="rr-stat-row">
                    <span style={{ color: 'var(--text-secondary)' }}>Member Since</span>
                    <span>{new Date(profileData.created_at).toLocaleDateString()}</span>
                  </div>

                  <Button onClick={() => setIsEditing(true)} variant="secondary" style={{ marginTop: 'var(--space-4)', alignSelf: 'flex-start' }}>
                    ✏️ Edit Profile
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div>
            <div className="content-stack">
              <div className="rr-metric-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 'var(--space-2)' }}>
                  {stats.favoritesCount || 0}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Favorites</div>
              </div>

              <div className="rr-metric-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: 'var(--space-2)' }}>
                  {stats.searchHistoryCount || 0}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Searches</div>
              </div>

              <div className="rr-metric-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: 'var(--space-2)' }}>
                  {stats.collectionsCount || 0}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Collections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
