import React from 'react';

interface ErrorMessageProps {
  isError: boolean;
}

export function ErrorMessage({ isError }: ErrorMessageProps) {
  if (!isError) return null;

  return (
    <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
      <p className="text-red-700 dark:text-red-400">
        Error loading option chain. Please try again or select a different symbol/expiration.
      </p>
    </div>
  );
}

export default ErrorMessage; 