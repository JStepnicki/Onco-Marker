import React from 'react';
import { useLocation } from 'react-router-dom';

function ErrorPage() {
  const location = useLocation();
  const { status, message } = location.state;

  return (
    <div>
      <h1>Error: {status}</h1>
      <p>{message}</p>
    </div>
  );
}

export default ErrorPage;