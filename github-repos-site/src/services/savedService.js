import apiClient from './apiClient.js';

export const savedService = {
  getSavedRepos: () => apiClient.user.getSaved(),
  saveRepo: (repo) => apiClient.user.saveRepo(repo),
  unsaveRepo: (repoId) => apiClient.user.unsaveRepo(repoId),
  checkSaved: (owner, repoName) => apiClient.user.checkSaved(owner, repoName)
};

export default savedService;
