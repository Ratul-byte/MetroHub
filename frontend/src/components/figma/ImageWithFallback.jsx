import React, { useState } from 'react';

const ImageWithFallback = ({ src, fallback, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? fallback : src}
      onError={handleError}
      {...props}
    />
  );
};

export { ImageWithFallback };
