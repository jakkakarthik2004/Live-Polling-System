import { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-light flex flex-col items-center justify-center p-8 text-center border-t-4 border-red-500">
          <h1 className="text-3xl font-bold text-dark mb-4">Something went wrong.</h1>
          <p className="text-gray mb-8 max-w-lg">
            We're sorry, but the application encountered an unexpected error.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm text-left w-full max-w-2xl overflow-auto border border-red-100">
            <h2 className="text-red-500 font-bold mb-2 font-mono text-sm">Error Details:</h2>
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
              {String(this.state.error)}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
