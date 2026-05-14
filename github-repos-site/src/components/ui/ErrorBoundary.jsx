import React from 'react';

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-card">
          <h2 className="error-title">⚠️ Something went wrong</h2>
          <p>
            The application encountered an error. Try refreshing the page or going back to the home page.
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="error-details">
              <summary>Error Details (Development Only)</summary>
              <div className="error-stack">
                <strong>Error:</strong> {this.state.error.toString()}
                {this.state.errorInfo && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Component Stack:</strong>
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            </details>
          )}
          
          <div className="error-actions">
            <button onClick={this.resetError} className="btn btn-primary">
              Try Again
            </button>
            <a href="/" className="btn">
              Go Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
