export interface CategoryConfig {
  accentColor: string;
  siteName: string;
  tagline: string;
  buttonColor: string;
  buttonTextColor: string;
}

const defaultConfig: CategoryConfig = {
  accentColor: '#232323',
  siteName: 'ArtGptAgents',
  tagline: 'Empowering creators with AI',
  buttonColor: '#E9FF70',
  buttonTextColor: '#232323'
};

const configs: Record<string, CategoryConfig> = {
  'ai': {
    accentColor: '#0047AB',
    siteName: 'AI Insights',
    tagline: 'The latest in artificial intelligence',
    buttonColor: '#0047AB',
    buttonTextColor: '#FFFFFF'
  },
  'business': {
    accentColor: '#006600',
    siteName: 'Business Digest',
    tagline: 'Strategies for success',
    buttonColor: '#006600',
    buttonTextColor: '#FFFFFF'
  }
};

export function getCategoryConfig(category?: string): CategoryConfig {
  if (!category) {
    return defaultConfig;
  }
  
  const config = configs[category.toLowerCase()];
  return config || defaultConfig;
} 