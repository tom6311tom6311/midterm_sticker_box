import React from 'react';

const LoadingOverlay = () => (
  <div className="overlay-wrapper">
    <span className="overlay-text overlay-text--spinner">LOADING</span>
    <span className="overlay overlay--spinner" />
  </div>
);

export default LoadingOverlay;
