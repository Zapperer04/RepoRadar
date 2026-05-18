import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import Loader from '../components/ui/Loader.jsx';
import { useAuth } from '../hooks/useAuth.js';
import profileService from '../services/profileService.js';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Details State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ favoritesCount: 0, searchHistoryCount: 0, collectionsCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete Account State
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Sync state if user context loads late
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Load User Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await profileService.getStats();
        if (response && response.stats) {
          setStats(response.stats);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!username || !email) {
      setProfileError('Username and email are required.');
      return;
    }

    try {
      const response = await profileService.updateProfile({ username, email });
      if (response && response.success) {
        updateUser(response.user);
        setProfileSuccess('Profile updated successfully.');
        setIsEditing(false);
      } else {
        setProfileError(response?.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError(err?.data?.error || err.message || 'An error occurred during update.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await profileService.changePassword({ currentPassword, newPassword });
      if (response && response.success) {
        setPasswordSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(response?.error || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err?.data?.error || err.message || 'An error occurred while changing password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError(null);

    if (deleteConfirmationText !== 'DELETE') {
      setDeleteError("Please type 'DELETE' exactly to confirm.");
      return;
    }

    if (!window.confirm('CRITICAL ACTION: Are you sure you want to permanently delete your account? This will cascade delete all your saved repositories and collections. This action cannot be undone.')) {
      return;
    }

    setDeletingAccount(true);
    try {
      const response = await profileService.deleteAccount();
      if (response && response.success) {
        alert('Your account has been successfully deleted.');
        await logout();
        navigate('/signup');
      } else {
        setDeleteError(response?.error || 'Failed to delete account.');
        setDeletingAccount(false);
      }
    } catch (err) {
      setDeleteError(err?.data?.error || err.message || 'An error occurred while deleting account.');
      setDeletingAccount(false);
    }
  };

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">👤 Account Settings</h1>
          <p className="page-subtitle">Manage your profile details, change security settings, or close your account.</p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: Overview & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700
                  }}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <CardTitle style={{ margin: 0 }}>{user?.username || 'User'}</CardTitle>
                    <CardDescription style={{ margin: 0 }}>{user?.email || 'email@example.com'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Member Since:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{memberSince}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Platform Engagement</CardTitle>
                <CardDescription>Your activity metrics and saved analytics across RepoRadar.</CardDescription>
              </CardHeader>
              <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)' }}>
                {loadingStats ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4)' }}>
                    <Loader />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', textAlign: 'center' }}>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.favoritesCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saved</div>
                    </div>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.collectionsCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collections</div>
                    </div>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.searchHistoryCount}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Searches</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Edit forms & Danger Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Edit Profile details card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Update your username and contact email address.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  
                  {profileError && (
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.9rem' }}>
                      ⚠️ {profileError}
                    </div>
                  )}

                  {profileSuccess && (
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                      ✅ {profileSuccess}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Username</label>
                    <Input 
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</label>
                    <Input 
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
                <CardFooter style={{ justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                  {isEditing ? (
                    <>
                      <Button type="button" variant="ghost" onClick={() => {
                        setUsername(user?.username || '');
                        setEmail(user?.email || '');
                        setProfileError(null);
                        setProfileSuccess(null);
                        setIsEditing(false);
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Card>

            {/* Change Password Card */}
            <Card>
              <CardHeader>
                <CardTitle>Update Security</CardTitle>
                <CardDescription>Safeguard your account by updating your login password.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  
                  {passwordError && (
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.9rem' }}>
                      ⚠️ {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                      ✅ {passwordSuccess}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Current Password</label>
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>New Password</label>
                    <Input 
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Confirm New Password</label>
                    <Input 
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <CardFooter style={{ justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="secondary" disabled={updatingPassword}>
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Danger Zone Card */}
            <Card style={{ borderColor: 'var(--danger)', borderStyle: 'dashed' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--danger)' }}>⚠️ Danger Zone</CardTitle>
                <CardDescription>Permanently remove your account and all associated collections/saves from RepoRadar.</CardDescription>
              </CardHeader>
              <form onSubmit={handleDeleteAccount}>
                <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  
                  {deleteError && (
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.9rem' }}>
                      ⚠️ {deleteError}
                    </div>
                  )}

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Deleting your account is permanent and cannot be undone. Please type <strong>DELETE</strong> in the field below to authorize this deletion.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <Input 
                      placeholder="Type DELETE to confirm"
                      value={deleteConfirmationText}
                      onChange={e => setDeleteConfirmationText(e.target.value)}
                      style={{ borderColor: deleteConfirmationText === 'DELETE' ? 'var(--danger)' : undefined }}
                      required
                    />
                  </div>
                </div>
                <CardFooter style={{ justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="danger" 
                    disabled={deleteConfirmationText !== 'DELETE' || deletingAccount}
                  >
                    {deletingAccount ? 'Deleting Account...' : 'Permanently Delete Account'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
