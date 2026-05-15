import { useContext } from 'react';
import { SavedReposContext } from '../context/SavedReposContext.jsx';

export const useSavedRepos = () => {
  const context = useContext(SavedReposContext);
  if (!context) {
    throw new Error('useSavedRepos must be used within SavedReposProvider');
  }
  return context;
};
