// Theme colors with both standard and high contrast options
export const COLORS = {
  light: {
    primary: '#3B82F6', // Blue
    secondary: '#0EA5E9', // Sky Blue
    accent: '#8B5CF6', // Purple
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    background: '#F8FAFC', // Very Light Gray
    card: '#FFFFFF', // White
    text: '#1E293B', // Slate
    secondaryText: '#64748B', // Secondary Text
    border: '#E2E8F0', // Lighter Gray
    inactive: '#94A3B8', // Light Gray
  },
  dark: {
    primary: '#60A5FA', // Lighter Blue
    secondary: '#38BDF8', // Lighter Sky Blue
    accent: '#A78BFA', // Lighter Purple
    success: '#34D399', // Lighter Green
    warning: '#FBBF24', // Lighter Amber
    error: '#F87171', // Lighter Red
    background: '#0F172A', // Very Dark Blue
    card: '#1E293B', // Dark Blue Gray
    text: '#F1F5F9', // Very Light Gray
    secondaryText: '#94A3B8', // Light Gray
    border: '#334155', // Darker Gray
    inactive: '#64748B', // Mid Gray
  },
  // High contrast themes for accessibility
  highContrast: {
    light: {
      primary: '#1D4ED8', // Darker Blue (higher contrast against white)
      secondary: '#0369A1', // Darker Sky Blue
      accent: '#6D28D9', // Darker Purple
      success: '#047857', // Darker Green
      warning: '#B45309', // Darker Amber
      error: '#B91C1C', // Darker Red
      background: '#FFFFFF', // Pure White
      card: '#F8FAFC', // Very Light Gray
      text: '#000000', // Pure Black (maximum contrast)
      secondaryText: '#334155', // Darker secondary text
      border: '#94A3B8', // Darker border for visibility
      inactive: '#475569', // Darker inactive color
    },
    dark: {
      primary: '#93C5FD', // Much Lighter Blue (higher contrast against dark)
      secondary: '#7DD3FC', // Much Lighter Sky Blue
      accent: '#C4B5FD', // Much Lighter Purple
      success: '#6EE7B7', // Much Lighter Green
      warning: '#FDE68A', // Much Lighter Amber
      error: '#FCA5A5', // Much Lighter Red
      background: '#000000', // Pure Black
      card: '#0F172A', // Very Dark Blue
      text: '#FFFFFF', // Pure White (maximum contrast)
      secondaryText: '#CBD5E1', // Lighter secondary text
      border: '#94A3B8', // Light border for visibility
      inactive: '#CBD5E1', // Lighter inactive color
    }
  }
};

// Font sizes (base sizes, will be scaled by fontScale for accessibility)
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Spacing values (using 8-point grid system)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius values
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Weather condition icons and colors
export const WEATHER_ICONS = {
  // Mapping of weather conditions to icon names and colors
  // To be used with lucide-react-native icons
};

// Animation timing constants
export const ANIMATION = {
  duration: {
    short: 200,
    medium: 300,
    long: 500,
  },
  easing: {
    // To be used with Animated.Easing
  }
};