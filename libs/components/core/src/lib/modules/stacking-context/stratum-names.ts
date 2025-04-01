export const stratumNames = [
  'base',
  'flyout',
  'omnibar',
  'help',
  'modal',
  'toast',
  'page-wait',
] as const;
export type Stratum = (typeof stratumNames)[number];
