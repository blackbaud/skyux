import type { E2EVariationName } from '@skyux-sdk/e2e-schematics';

/**
 * ag-grid stories have standard and compact variants. Compact exists only in the
 * modern themes; `themes: undefined` means every theme.
 */
export const agGridVariants: readonly {
  compact: boolean;
  themes?: E2EVariationName[];
}[] = [
  { compact: false },
  { compact: true, themes: ['modern-v2-light', 'modern-v2-dark'] },
];
