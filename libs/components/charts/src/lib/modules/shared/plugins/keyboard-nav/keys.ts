/**
 * Defines the keys used for keyboard navigation within charts.
 */
export const ChartKeys = {
  /** Exits navigation and moves focus to the next focusable element. */
  Tab: 'Tab',

  /** Exits navigation and clears the focus indicator. */
  Escape: 'Escape',

  /** Keys for activating a focused item */
  Activation: { 
    Space: ' ', 
    Enter: 'Enter' 
  },

  /** Keys for navigating between data points and series within the chart. */
  Navigation: {
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
  },
} as const;

// --- Activation keys ---
export type ActivationKey =
  (typeof ChartKeys.Activation)[keyof typeof ChartKeys.Activation];

const activationKeySet = new Set(Object.values(ChartKeys.Activation));

export function isActivationKey(key: string): key is ActivationKey {
  return activationKeySet.has(key as ActivationKey);
}

// --- Navigation keys ---

export type NavigationKey =
  (typeof ChartKeys.Navigation)[keyof typeof ChartKeys.Navigation];

const arrowKeySet = new Set(Object.values(ChartKeys.Navigation));

export function isNavigationKey(key: string): key is NavigationKey {
  return arrowKeySet.has(key as NavigationKey);
}