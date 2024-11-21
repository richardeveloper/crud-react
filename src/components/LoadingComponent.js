import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingComponent = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-container">
            <Spinner animation="border" variant="dark"></Spinner>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingComponent;
