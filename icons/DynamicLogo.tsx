import React from 'react';
import Logo from './Logo';
import LogoAi from './LogoAi';
import LogoBusiness from './LogoBusiness';

interface DynamicLogoProps extends React.SVGProps<SVGSVGElement> {
  category?: string;
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({ category, ...props }) => {
  // Use the category prop or get it from environment variable if available
  const currentCategory = category || process.env.NEXT_PUBLIC_CATEGORY || '';
  
  // Select the logo based on the category
  switch (currentCategory.toLowerCase()) {
    case 'ai':
      return <LogoAi {...props} />;
    case 'business':
      return <LogoBusiness {...props} />;
    default:
      // Fallback to the default logo
      return <Logo {...props} />;
  }
};

export default DynamicLogo; 