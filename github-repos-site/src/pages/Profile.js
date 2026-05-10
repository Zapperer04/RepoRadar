/**
 * User Profile Page
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth as authApi, user as userApi } from '../utils/apiClient';

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
      // Use the me API which returns user data + stats
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
    <div className="profile-page">
      <header className="page-header">
        <h1 className="page-title">👤 My Profile</h1>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}
      {success && <div className="error-banner" style={{ backgroundColor: 'rgba(56, 139, 253, 0.1)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>✅ {success}</div>}

      <div className="profile-container">
        <div className="profile-card">
          <h2 className="repo-section-title">Account Information</h2>

          {isEditing ? (
            <div className="profile-form">
              <div className="form-group">
                <label>Email</label>
                <input className="search-input" type="email" value={profileData.email} disabled />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input className="search-input" type="text" value={profileData.username} disabled />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="search-input"
                  type="text"
                  name="full_name"
                  value={profileData.full_name || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  className="search-input"
                  type="text"
                  name="avatar_url"
                  value={profileData.avatar_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="search-input"
                  name="bio"
                  value={profileData.bio || ''}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="label">Email</span>
                <span className="value">{profileData.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Username</span>
                <span className="value">{profileData.username}</span>
              </div>
              <div className="info-row">
                <span className="label">Full Name</span>
                <span className="value">{profileData.full_name || 'Not set'}</span>
              </div>
              <div className="info-row">
                <span className="label">Bio</span>
                <span className="value">{profileData.bio || 'No bio'}</span>
              </div>
              <div className="info-row">
                <span className="label">Member Since</span>
                <span className="value">
                  {new Date(profileData.created_at).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <p className="stat-number">{stats.favoritesCount || 0}</p>
          <p className="stat-label">Favorites</p>
        </div>

        <div className="stat-card">
          <p className="stat-number">{stats.searchHistoryCount || 0}</p>
          <p className="stat-label">Searches</p>
        </div>

        <div className="stat-card">
          <p className="stat-number">{stats.collectionsCount || 0}</p>
          <p className="stat-label">Collections</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
