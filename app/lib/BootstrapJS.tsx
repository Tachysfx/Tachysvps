"use client";

import { useEffect } from 'react';

const BootstrapJS = () => {
  useEffect(() => {
    // Dynamically import the Bootstrap JS on the client side
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js')
        .then(() => {
          console.log('Bootstrap JS loaded successfully');
        })
        .catch(err => {
          console.error('Error loading Bootstrap JS:', err);
        });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default BootstrapJS;