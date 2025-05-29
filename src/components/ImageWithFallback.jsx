import React, { useState } from 'react';
import { getImageWithFallback } from '../services/api';

const ImageWithFallback = ({ imagePath, alt, className, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(() => {
    const urls = getImageWithFallback(imagePath);
    return urls.primary;
  });
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const urls = getImageWithFallback(imagePath);
      setCurrentSrc(urls.fallback);
    } else {
      // Если и fallback не работает, показываем placeholder
      const urls = getImageWithFallback(imagePath);
      setCurrentSrc(urls.placeholder);
    }
  };

  const urls = getImageWithFallback(imagePath);
  
  if (!imagePath) {
    return (
      <img 
        src={urls.placeholder} 
        alt={alt || 'Placeholder'} 
        className={className}
        {...props}
      />
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt || 'Product image'} 
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback; 