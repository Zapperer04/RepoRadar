import DashboardLayout from '../layouts/DashboardLayout.jsx';
import RepoGrid from '../components/repo/RepoGrid.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useSavedRepos } from '../hooks/useSavedRepos.js';

const SavedRepos = () => {
  const { savedRepos, loading } = useSavedRepos();

  return (
    <DashboardLayout>
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">💾 Saved Repositories</h1>
          <p className="page-subtitle">Your personal stash of tracked open-source projects.</p>
        </header>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
            <Loader />
          </div>
        ) : savedRepos.length > 0 ? (
          <RepoGrid repos={savedRepos} />
        ) : (
          <EmptyState 
            title="No Saved Repositories" 
            message="You haven't saved any repositories yet. Explore trending projects to start your stash!"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedRepos;
