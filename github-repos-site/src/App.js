import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { SavedReposProvider } from './context/SavedReposContext.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SavedReposProvider>
        <ErrorBoundary>
          <div className="App">
            <AppRoutes />
          </div>
        </ErrorBoundary>
      </SavedReposProvider>
    </AuthProvider>
  );
}

export default App;