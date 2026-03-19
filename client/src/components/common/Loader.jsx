import React from 'react';
import { FaRecycle } from 'react-icons/fa';

const Loader = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text = 'Loading...',
  type = 'spinner' // spinner, pulse, recycle
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  const renderPulse = () => (
    <div className="flex space-x-2">
      <div className={`${sizeClasses.sm} ${colorClasses[color]} animate-pulse rounded-full`} />
      <div className={`${sizeClasses.sm} ${colorClasses[color]} animate-pulse rounded-full animation-delay-200`} />
      <div className={`${sizeClasses.sm} ${colorClasses[color]} animate-pulse rounded-full animation-delay-400`} />
    </div>
  );

  const renderRecycle = () => (
    <FaRecycle className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
  );

  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return renderPulse();
      case 'recycle':
        return renderRecycle();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <div className="text-center">
          {renderLoader()}
          {text && (
            <p className={`mt-4 text-${color === 'white' ? 'white' : 'gray-600'} font-medium`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {renderLoader()}
      {text && (
        <p className={`mt-2 text-sm ${colorClasses[color]} opacity-75`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;