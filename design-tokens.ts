/**
 * Design Tokens for The Lone Screen
 * Extracted from Figma mockups
 * 
 * To extract values:
 * 1. Open Figma mockup
 * 2. Select an element
 * 3. Check the properties panel for exact values
 * 4. Fill in the corresponding token below
 */

export const designTokens = {
  // Colors - Extracted from Figma Color Palette
  colors: {
    // Base colors
    base: {
      main: '#F2F0EA', // Main background (light beige) - from original palette
      alternative: '#F7F7F7', // Base 01 - Alternative light background (from styleguide)
      white: '#FFFFFF', // Base 02 - Pure white
      black: '#000000', // Base 03 - Pure black
    },
    
    // Main brand colors
    primary: {
      main: '#002498', // Main Blue - Primary buttons (from ticket card)
      alternative: '#2D33BA', // Main Blue alternative (from styleguide - might be updated version)
      light: '#CDD9FF', // Light Blue
      lighter: '#C0D0FF', // Light Blue alternative (from styleguide)
      dark: '#1E1E1E', // Dark
      darker: '#1A1A1A', // Dark alternative (from styleguide)
    },
    
    // Grey colors
    grey: {
      light: '#DCDCDC', // Grey 01 (from original palette)
      lighter: '#E0E0E0', // Grey 01 alternative (from styleguide)
      medium: '#929292', // Grey 03
      mediumDark: '#A0A0A0', // Grey 02 alternative (from styleguide)
      dark: '#585858', // Grey 02
      darker: '#606060', // Grey 03 alternative (from styleguide)
      darkest: '#303030', // Grey 04 (from styleguide)
    },
    
    // System colors
    system: {
      yellow: '#FFBB00', // Yellow (from original palette)
      yellowAlt: '#FFC107', // Yellow alternative (from styleguide)
      red: '#FF383C', // Red (errors, sold out) - from original palette
      redAlt: '#F44336', // Red alternative (from styleguide)
    },
    
    // Background colors
    background: {
      primary: '#F2F0EA', // Main page background (Base)
      secondary: '#FFFFFF', // Alternate backgrounds (Base 02)
      dark: '#1E1E1E', // Dark backgrounds (Dark)
      card: '#FFFFFF', // Card/container backgrounds
      ticketCard: '#002498', // Ticket card blue background
    },
    
    // Text colors
    text: {
      primary: '#000000', // Main text color (Base 03)
      secondary: '#585858', // Secondary text color (Grey 02)
      tertiary: '#929292', // Tertiary/muted text (Grey 03)
      inverse: '#FFFFFF', // Text on dark backgrounds (Base 02)
      link: '#002498', // Link color (Main Blue)
      linkHover: '#001876', // Link hover (darker blue - estimated)
    },
    
    // Status colors
    status: {
      success: '#10b981', // Green (ticket purchased, success states)
      error: '#FF383C', // Red (errors, sold out)
      warning: '#FFBB00', // Yellow/Orange (warnings)
      info: '#002498', // Blue (information - Main Blue)
    },
    
    // Border colors
    border: {
      default: '#DCDCDC', // Default borders (Grey 01)
      light: '#F2F0EA', // Light borders (Base)
      dark: '#585858', // Dark borders (Grey 02)
      focus: '#002498', // Focus/active borders (Main Blue)
    },
    
    // Overlay colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.6)', // Overlay 01 - 60% black
      dark: 'rgba(0, 0, 0, 0.8)', // Overlay 02 - 80% black
    },
    
    // Forum/Discussion colors (if dark theme)
    forum: {
      background: '#000000', // Dark background
      card: '#1E1E1E', // Comment cards (Dark)
      text: '#FFFFFF', // Text on dark
      textSecondary: '#929292', // Secondary text (Grey 03)
    },
  },

  // Typography - Extracted from Figma Font Styles
  typography: {
    // Font families
    fontFamily: {
      heading: 'Instrument Sans, sans-serif', // For headings
      body: 'Spline Sans Mono, monospace', // For body text and captions
      sans: 'Instrument Sans, sans-serif', // Default sans-serif
      mono: 'Spline Sans Mono, monospace', // Default monospace
    },
    
    // Headings - Instrument Sans
    heading: {
      h1: {
        fontFamily: 'Instrument Sans',
        fontWeight: 800, // Bold
        fontSize: '56px',
        lineHeight: '56px',
        letterSpacing: '-2px',
      },
      h2: {
        fontFamily: 'Instrument Sans',
        fontWeight: 700, // Semibold
        fontSize: '28px',
        lineHeight: '28px',
        letterSpacing: '0px',
      },
      h3: {
        fontFamily: 'Instrument Sans',
        fontWeight: 700, // Semibold
        fontSize: '20px',
        lineHeight: '28px',
        letterSpacing: '-1px',
      },
      h4: {
        fontFamily: 'Instrument Sans',
        fontWeight: 700, // Semibold
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '-4px',
      },
    },
    
    // Body text - Spline Sans Mono
    body: {
      body1: {
        fontFamily: 'Spline Sans Mono',
        fontWeight: 400, // Regular
        fontSize: '16px',
        lineHeight: '28px',
        letterSpacing: '-4%',
      },
      body2: {
        fontFamily: 'Spline Sans Mono',
        fontWeight: 400, // Regular
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '-4%',
      },
      body3: {
        fontFamily: 'Spline Sans Mono',
        fontWeight: 400, // Regular
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '-4%',
      },
    },
    
    // Captions - Spline Sans Mono (uppercase)
    caption: {
      caption1: {
        fontFamily: 'Spline Sans Mono',
        fontWeight: 400, // Regular
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '-4%',
        textTransform: 'uppercase',
      },
      caption2: {
        fontFamily: 'Spline Sans Mono',
        fontWeight: 400, // Regular
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '-4%',
        textTransform: 'uppercase',
      },
    },
    
    // Font sizes (in pixels)
    fontSize: {
      xs: '12px',    // Body 03, Caption 02
      sm: '14px',    // Body 02, Caption 01
      base: '16px',  // Body 01, Heading 04
      lg: '20px',    // Heading 03
      xl: '28px',    // Heading 02
      '2xl': '56px', // Heading 01
    },
    
    // Font weights
    fontWeight: {
      normal: 400, // Regular
      semibold: 700, // Semibold
      bold: 800, // Bold
    },
    
    // Line heights
    lineHeight: {
      tight: 1.0,   // Heading 01, 02 (same as font size)
      normal: 1.4,  // Heading 03, 04
      relaxed: 1.75, // Body text
    },
    
    // Letter spacing (converted to px/em)
    letterSpacing: {
      tight: '-4px',   // Heading 04
      normal: '-2px',  // Heading 01
      wide: '-1px',    // Heading 03
      wider: '0px',    // Heading 02
      body: '-4%',     // Body and Captions
    },
  },

  // Spacing scale (in pixels)
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // Border radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Components - Extracted from Figma Styleguide
  components: {
    // Buttons
    button: {
      primary: {
        default: {
          backgroundColor: '#002498', // Main Blue (or #2D33BA from styleguide)
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        },
        hover: {
          backgroundColor: '#001876', // Darker blue (estimated)
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        },
        click: {
          backgroundColor: '#001255', // Even darker blue (estimated)
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        },
        disabled: {
          backgroundColor: '#929292', // Grey medium
          textColor: '#FFFFFF',
          borderColor: 'transparent',
        },
      },
      secondary: {
        default: {
          backgroundColor: '#FFFFFF',
          textColor: '#002498', // Main Blue
          borderColor: '#002498', // Main Blue border
        },
        hover: {
          backgroundColor: '#002498', // Main Blue background on hover
          textColor: '#FFFFFF',
          borderColor: '#002498',
        },
        click: {
          backgroundColor: '#001255', // Darker blue
          textColor: '#FFFFFF',
          borderColor: '#001255',
        },
        disabled: {
          backgroundColor: '#FFFFFF',
          textColor: '#929292', // Grey medium
          borderColor: '#DCDCDC', // Grey light
        },
      },
      sizes: {
        large: {
          padding: '16px 24px', // Estimated from button examples
          fontSize: '16px',
        },
        medium: {
          padding: '12px 20px', // Estimated
          fontSize: '14px',
        },
      },
    },

    // Inputs
    input: {
      default: {
        borderColor: '#DCDCDC', // Grey light
        backgroundColor: 'transparent',
        textColor: '#000000',
        placeholderColor: '#929292', // Grey medium
      },
      active: {
        borderColor: '#002498', // Main Blue
        backgroundColor: 'transparent',
        textColor: '#000000',
      },
      filled: {
        borderColor: '#002498', // Main Blue
        backgroundColor: 'transparent',
        textColor: '#000000',
      },
      error: {
        borderColor: '#FF383C', // Red
        backgroundColor: 'transparent',
        textColor: '#000000',
        errorTextColor: '#FF383C', // Red
      },
      disabled: {
        borderColor: '#DCDCDC', // Grey light
        backgroundColor: '#F7F7F7', // Light background
        textColor: '#929292', // Grey medium
      },
    },

    // Avatars
    avatar: {
      size: {
        sm: '32px',
        md: '48px',
        lg: '64px',
      },
      borderRadius: '50%', // Circular
      defaultColors: [
        '#10b981', // Green
        '#3b82f6', // Cyan/Blue
        '#FFC107', // Yellow
        '#9c27b0', // Purple
        '#2196f3', // Medium Blue
        '#795548', // Brown
        '#f44336', // Red
        '#ff9800', // Orange
      ],
    },
  },
} as const

/**
 * Helper function to get design token values
 */
export function getDesignToken(category: keyof typeof designTokens, key: string): string {
  const categoryTokens = designTokens[category] as Record<string, any>
  return categoryTokens[key] || ''
}

