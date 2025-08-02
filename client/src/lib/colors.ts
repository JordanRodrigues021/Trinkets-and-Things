// Unified color system for product swatches

export interface ColorInfo {
  name: string;
  hex: string;
  tailwind: string;
  border: string;
}

// Comprehensive color mapping
export const COLOR_MAP: Record<string, ColorInfo> = {
  // Basic colors
  'white': {
    name: 'White',
    hex: '#ffffff',
    tailwind: 'bg-white',
    border: 'border-gray-300'
  },
  'black': {
    name: 'Black', 
    hex: '#000000',
    tailwind: 'bg-black',
    border: 'border-gray-600'
  },
  'red': {
    name: 'Red',
    hex: '#ef4444',
    tailwind: 'bg-red-500',
    border: 'border-red-600'
  },
  'blue': {
    name: 'Blue',
    hex: '#3b82f6',
    tailwind: 'bg-blue-500',
    border: 'border-blue-600'
  },
  'green': {
    name: 'Green',
    hex: '#22c55e',
    tailwind: 'bg-green-500',
    border: 'border-green-600'
  },
  'yellow': {
    name: 'Yellow',
    hex: '#eab308',
    tailwind: 'bg-yellow-500',
    border: 'border-yellow-600'
  },
  'purple': {
    name: 'Purple',
    hex: '#a855f7',
    tailwind: 'bg-purple-500',
    border: 'border-purple-600'
  },
  'pink': {
    name: 'Pink',
    hex: '#ec4899',
    tailwind: 'bg-pink-500',
    border: 'border-pink-600'
  },
  'orange': {
    name: 'Orange',
    hex: '#f97316',
    tailwind: 'bg-orange-500',
    border: 'border-orange-600'
  },
  
  // Shades of grey
  'gray': {
    name: 'Gray',
    hex: '#6b7280',
    tailwind: 'bg-gray-500',
    border: 'border-gray-600'
  },
  'grey': {
    name: 'Grey',
    hex: '#6b7280',
    tailwind: 'bg-gray-500',
    border: 'border-gray-600'
  },
  'light gray': {
    name: 'Light Gray',
    hex: '#d1d5db',
    tailwind: 'bg-gray-300',
    border: 'border-gray-400'
  },
  'dark gray': {
    name: 'Dark Gray',
    hex: '#374151',
    tailwind: 'bg-gray-700',
    border: 'border-gray-800'
  },
  
  // Metal colors
  'silver': {
    name: 'Silver',
    hex: '#c0c0c0',
    tailwind: 'bg-gray-300',
    border: 'border-gray-400'
  },
  'gold': {
    name: 'Gold',
    hex: '#ffd700',
    tailwind: 'bg-yellow-400',
    border: 'border-yellow-500'
  },
  'bronze': {
    name: 'Bronze',
    hex: '#cd7f32',
    tailwind: 'bg-orange-600',
    border: 'border-orange-700'
  },
  'copper': {
    name: 'Copper',
    hex: '#b87333',
    tailwind: 'bg-orange-700',
    border: 'border-orange-800'
  },
  
  // Special materials
  'natural': {
    name: 'Natural',
    hex: '#fef3c7',
    tailwind: 'bg-amber-100',
    border: 'border-amber-200'
  },
  'translucent': {
    name: 'Translucent',
    hex: 'rgba(255,255,255,0.6)',
    tailwind: 'bg-blue-100 opacity-75',
    border: 'border-blue-200'
  },
  'transparent': {
    name: 'Transparent',
    hex: 'rgba(255,255,255,0.3)',
    tailwind: 'bg-gray-100 opacity-50',
    border: 'border-gray-300'
  },
  'clear': {
    name: 'Clear',
    hex: 'rgba(255,255,255,0.3)',
    tailwind: 'bg-gray-100 opacity-50',
    border: 'border-gray-300'
  },
  
  // Painted/multi-color
  'painted': {
    name: 'Painted',
    hex: 'linear-gradient(45deg, #ef4444, #eab308, #3b82f6)',
    tailwind: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500',
    border: 'border-gray-400'
  },
  'multicolor': {
    name: 'Multicolor',
    hex: 'linear-gradient(45deg, #ef4444, #22c55e, #3b82f6)',
    tailwind: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500',
    border: 'border-gray-400'
  },
  
  // Wood tones
  'wood': {
    name: 'Wood',
    hex: '#8b4513',
    tailwind: 'bg-amber-800',
    border: 'border-amber-900'
  },
  'brown': {
    name: 'Brown',
    hex: '#8b4513',
    tailwind: 'bg-amber-800',
    border: 'border-amber-900'
  },
  
  // Neon/bright colors
  'neon green': {
    name: 'Neon Green',
    hex: '#39ff14',
    tailwind: 'bg-lime-400',
    border: 'border-lime-500'
  },
  'neon pink': {
    name: 'Neon Pink',
    hex: '#ff1493',
    tailwind: 'bg-pink-400',
    border: 'border-pink-500'
  },
  'neon blue': {
    name: 'Neon Blue',
    hex: '#1b03a3',
    tailwind: 'bg-blue-600',
    border: 'border-blue-700'
  }
};

// Helper function to get color info by name (case-insensitive)
export function getColorInfo(colorName: string): ColorInfo {
  const normalizedName = colorName.toLowerCase().trim();
  
  const colorInfo = COLOR_MAP[normalizedName];
  if (colorInfo) {
    return colorInfo;
  }
  
  // Fallback - try to match partial names
  const partialMatch = Object.entries(COLOR_MAP).find(([key]) => 
    key.includes(normalizedName) || normalizedName.includes(key)
  );
  
  if (partialMatch) {
    return partialMatch[1];
  }
  
  // Default fallback for unknown colors
  return {
    name: colorName,
    hex: '#94a3b8', // slate-400
    tailwind: 'bg-slate-400',
    border: 'border-slate-500'
  };
}

// Helper to get hex color for inline styles
export function getColorHex(colorName: string): string {
  return getColorInfo(colorName).hex;
}

// Helper to get Tailwind classes
export function getColorClasses(colorName: string): string {
  const info = getColorInfo(colorName);
  return `${info.tailwind} ${info.border}`;
}