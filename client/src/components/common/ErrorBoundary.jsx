import React from 'react';
import { FaExclamationTriangle, FaHome, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // You can send to your logging service here
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (Sentry, etc.)
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-600 text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try reloading the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 text-left">
                <details className="bg-gray-100 rounded-lg p-4">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-4 text-xs text-red-600 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaSync />
                <span>Reload Page</span>
              </button>
              
              <Link
                to="/"
                className="flex items-center justify-center space-x-2 border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <FaHome />
                <span>Go Home</span>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              If the problem continues, please contact{' '}
              <a 
                href="mailto:ll114505@students.cavendish.co.zm"
                className="text-primary-600 hover:underline"
              >
                support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;