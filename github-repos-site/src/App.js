import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="App">
          <AppRoutes />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;