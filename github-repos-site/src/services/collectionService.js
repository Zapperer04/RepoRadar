import apiClient from './apiClient.js';

export const collectionService = {
  getCollections: () => apiClient.user.getCollections(),
  getCollection: (id) => apiClient.user.getCollection(id),
  createCollection: (name, description) => apiClient.user.createCollection(name, description),
  updateCollection: (id, data) => apiClient.user.updateCollection(id, data),
  deleteCollection: (id) => apiClient.user.deleteCollection(id),
  addRepoToCollection: (collectionId, repo) => apiClient.user.addRepoToCollection(collectionId, repo),
  removeRepoFromCollection: (collectionId, savedRepoId) => apiClient.user.removeRepoFromCollection(collectionId, savedRepoId)
};

export default collectionService;
