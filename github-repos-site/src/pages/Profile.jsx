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
  const [deletePassword, setDeletePassword] = useState('');
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
      setDeleteError("Please type 'DELETE' exactly to authorize.");
      return;
    }

    if (!deletePassword) {
      setDeleteError("Please enter your current password to authorize.");
      return;
    }

    if (!window.confirm('CRITICAL ACTION: Are you sure you want to permanently delete your account? This will cascade delete all your saved repositories and collections. This action cannot be undone.')) {
      return;
    }

    setDeletingAccount(true);
    try {
      const response = await profileService.deleteAccount(deletePassword);
      if (response && response.success) {
        alert('Your account has been successfully deleted.');
        await logout();
        navigate('/signup');
      } else {
        setDeleteError(response?.error || 'Failed to delete account.');
        setDeletingAccount(false);
      }
    } catch (err) {
      setDeleteError(err?.data?.error || err.message || 'Incorrect password or deletion error.');
      setDeletingAccount(false);
    }
  };

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="page-container" style={{ maxWidth: '1000px' }}>
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">👤 Account Settings</h1>
          <p className="page-subtitle">Manage your profile details, change security settings, or close your account.</p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: Overview & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700
                  }}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <CardTitle style={{ margin: 0, fontSize: '1.15rem' }}>{user?.username || 'User'}</CardTitle>
                    <CardDescription style={{ margin: 0, fontSize: '0.85rem' }}>{user?.email || 'email@example.com'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.9rem', marginTop: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-1)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Member Since:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{memberSince}</span>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: '1.15rem' }}>📊 Platform Engagement</CardTitle>
                <CardDescription style={{ margin: 0, fontSize: '0.85rem' }}>Your activity metrics and saved analytics across RepoRadar.</CardDescription>
              </CardHeader>
              <div style={{ marginTop: 'var(--space-2)' }}>
                {loadingStats ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4)' }}>
                    <Loader />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', textAlign: 'center' }}>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-soft)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.favoritesCount}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saved</div>
                    </div>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-soft)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.collectionsCount}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collections</div>
                    </div>
                    <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-soft)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.searchHistoryCount}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Searches</div>
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
                <CardTitle style={{ fontSize: '1.15rem' }}>Personal Details</CardTitle>
                <CardDescription style={{ margin: 0, fontSize: '0.85rem' }}>Update your username and contact email address.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                {profileError && (
                  <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem' }}>
                    ⚠️ {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontSize: '0.85rem' }}>
                    ✅ {profileSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
                  <Input 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <CardFooter style={{ justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-4) 0 0 0', marginTop: 'var(--space-2)' }}>
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
                <CardTitle style={{ fontSize: '1.15rem' }}>Update Security</CardTitle>
                <CardDescription style={{ margin: 0, fontSize: '0.85rem' }}>Safeguard your account by updating your login password.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                {passwordError && (
                  <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem' }}>
                    ⚠️ {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontSize: '0.85rem' }}>
                    ✅ {passwordSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Password</label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>New Password</label>
                  <Input 
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm New Password</label>
                  <Input 
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <CardFooter style={{ justifyContent: 'flex-end', padding: 'var(--space-4) 0 0 0', marginTop: 'var(--space-2)' }}>
                  <Button type="submit" variant="secondary" disabled={updatingPassword}>
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Danger Zone Card */}
            <Card style={{ borderColor: 'var(--danger)', borderStyle: 'dashed' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--danger)', fontSize: '1.15rem' }}>⚠️ Danger Zone</CardTitle>
                <CardDescription style={{ margin: 0, fontSize: '0.85rem' }}>Permanently remove your account and all associated collections/saves.</CardDescription>
              </CardHeader>
              <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                {deleteError && (
                  <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem' }}>
                    ⚠️ {deleteError}
                  </div>
                )}

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                  Deleting your account is permanent. Please type <strong>DELETE</strong> and enter your current password to authorize this action.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirmation Phrase</label>
                  <Input 
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmationText}
                    onChange={e => setDeleteConfirmationText(e.target.value)}
                    style={{ borderColor: deleteConfirmationText === 'DELETE' ? 'var(--danger)' : undefined }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Verify Your Password</label>
                  <Input 
                    type="password"
                    placeholder="Enter your current password"
                    value={deletePassword}
                    onChange={e => setDeletePassword(e.target.value)}
                    required
                  />
                </div>

                <CardFooter style={{ justifyContent: 'flex-end', padding: 'var(--space-4) 0 0 0', marginTop: 'var(--space-2)' }}>
                  <Button 
                    type="submit" 
                    variant="danger" 
                    disabled={deleteConfirmationText !== 'DELETE' || !deletePassword || deletingAccount}
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
