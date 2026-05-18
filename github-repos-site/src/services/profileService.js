/**
 * Profile Service
 * Communicates with profile and account management API endpoints
 */

import apiClient from './apiClient';

const profileService = {
  /**
   * Fetch logged-in user profile details
   */
  getProfile: async () => {
    return apiClient.get('/api/auth/me');
  },

  /**
   * Fetch user statistics (e.g. saves count, collections count)
   */
  getStats: async () => {
    return apiClient.get('/api/user/stats');
  },

  /**
   * Update user username and email
   */
  updateProfile: async (payload) => {
    return apiClient.put('/api/auth/me', payload);
  },

  /**
   * Change user password
   */
  changePassword: async (payload) => {
    return apiClient.put('/api/auth/password', payload);
  },

  /**
   * Delete user account permanently
   */
  deleteAccount: async (password) => {
    return apiClient.delete('/api/auth/me', {
      body: JSON.stringify({ password })
    });
  }
};

export default profileService;
