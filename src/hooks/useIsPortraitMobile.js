import { useState, useEffect } from 'react';

const useIsPortraitMobile = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768; // Standard mobile breakpoint
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isMobile && isPortrait);
    };

    // Check on mount
    checkOrientation();

    // Listen for resize (orientation change triggers resize)
    window.addEventListener('resize', checkOrientation);
    
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return isPortraitMobile;
};

export default useIsPortraitMobile;
