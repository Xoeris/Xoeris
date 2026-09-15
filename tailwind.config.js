/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ───── HIDE Design Tokens: Colors ───── */
      colors: {
        hide: {
          // Backgrounds
          canvas:   '#161616',
          primary:  '#1F1F1F',
          elevated: '#252526',
          sunken:   '#181818',
          input:    '#15161A',
          hover:    '#2D3139',

          // Borders
          'border-subtle':   '#2B2B2B',
          'border-default':  '#333333',
          'border-input':    '#2F333E',
          'border-separator':'#454545',

          // Text
          'text-primary':   '#E0E0E8',
          'text-secondary': '#CCCCCC',
          'text-muted':     '#7E7E8C',
          'text-disabled':  '#5A5A5A',
          'text-on-accent': '#121212',
          'text-emphasis':  '#FFFFFF',

          // Accent / brand
          accent:      '#FFC94A',
          'accent-deep':'#FFB020',

          // Action (teal-green)
          action:       '#00C896',
          'action-hover':'#00DEA6',
          'action-text': '#121212',

          // Status / semantic
          success: '#10B981',
          warning: '#FFB020',
          error:   '#FF6B6B',
          info:    '#007ACC',

          // Surfaces
          'danger-subtle': '#2D1E1E',
          'danger-border': '#5A2A2A',
          ghost:           '#2A2A32',
          'scrollbar-thumb':'#1E1E26',
          'toggle-track':  '#282834',
          'toggle-border': '#3C3C4C',

          // Chart (categorical — Resources Explorer only)
          'chart-1': '#4ECDC4',
          'chart-2': '#FF8C42',
          'chart-3': '#9B6BFF',
          'chart-4': '#6DBE47',
          'chart-5': '#10B981',
        },
      },

      /* ───── HIDE Design Tokens: Typography ───── */
      fontFamily: {
        ui:   ['Roboto', 'Segoe UI', 'sans-serif'],
        mono: ['Consolas', 'Cascadia Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        'hide-xs':   ['9px',   { lineHeight: '1.45' }],
        'hide-sm':   ['10px',  { lineHeight: '1.45' }],
        'hide-base': ['11px',  { lineHeight: '1.45' }],
        'hide-md':   ['12px',  { lineHeight: '1.45' }],
        'hide-lg':   ['13px',  { lineHeight: '1.45' }],
        'hide-xl':   ['14px',  { lineHeight: '1.45' }],
        'hide-2xl':  ['18px',  { lineHeight: '1.2' }],
        'hide-3xl':  ['22px',  { lineHeight: '1.2' }],
        'hide-4xl':  ['28px',  { lineHeight: '1.2' }],
      },

      /* ───── HIDE Design Tokens: Spacing ───── */
      spacing: {
        'hide-2xs': '2px',
        'hide-xs':  '4px',
        'hide-sm':  '6px',
        'hide-md':  '8px',
        'hide-lg':  '12px',
        'hide-xl':  '16px',
        'hide-2xl': '18px',
        'hide-3xl': '24px',
      },

      /* ───── HIDE Design Tokens: Radius ───── */
      borderRadius: {
        'hide-none': '0px',
        'hide-sm':   '3px',
        'hide-md':   '4px',
        'hide-lg':   '6px',   // THE HOUSE RADIUS
        'hide-xl':   '8px',
        'hide-2xl':  '12px',
        'hide-pill': '9999px',
      },

      /* ───── HIDE Design Tokens: Border Width ───── */
      borderWidth: {
        'hide-hairline': '1px',
        'hide-thick':    '1.5px',
      },

      /* ───── HIDE Design Tokens: Box Shadow (elevation) ───── */
      boxShadow: {
        'hide-popup': '0 3px 12px rgba(0, 0, 0, 0.45)',
      },

      /* ───── HIDE Design Tokens: Motion ───── */
      transitionDuration: {
        'hide-instant': '60ms',
        'hide-fast':    '150ms',
        'hide-medium':  '200ms',
        'hide-slow':    '300ms',
      },
      transitionTimingFunction: {
        'hide-standard': 'linear',
        'hide-cubic':    'cubic-bezier(0.25, 0.1, 0.25, 1)',
        // Existing custom easings preserved
        'hyper':         'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'hyper-smooth':  'cubic-bezier(0.33, 1, 0.68, 1)',
        'hyper-snap':    'cubic-bezier(0.4, 0, 0.2, 1)',
        'hyper-bounce':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      /* ───── HIDE Design Tokens: Z-Index ───── */
      zIndex: {
        'hide-base':          '0',
        'hide-inline-widget': '100',
        'hide-modal-overlay': '200',
        'hide-system-alert':  '300',
        'hide-toast':         '400',
      },

      /* ───── Preserved existing animations ───── */
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'fade-in':  'fadeIn 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
