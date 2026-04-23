import { describe, expect, it } from 'vitest';

import {
  deprecatedCustomPropsMap,
  deprecatedScssVarMap,
  validThemeCustomProperties,
} from './style-public-api.js';

describe('style-public-api', () => {
  describe('validThemeCustomProperties', () => {
    it('contains known --sky-theme- custom properties from public-api-tokens.json', () => {
      expect(
        validThemeCustomProperties.has('--sky-theme-color-background-page'),
      ).toBe(true);
      expect(
        validThemeCustomProperties.has('--sky-theme-color-text-default'),
      ).toBe(true);
    });

    it('does not contain deprecated custom property names', () => {
      expect(
        validThemeCustomProperties.has('--sky-background-color-page-default'),
      ).toBe(false);
      expect(validThemeCustomProperties.has('--sky-text-color-default')).toBe(
        false,
      );
    });
  });

  describe('deprecatedCustomPropsMap', () => {
    it('maps deprecated custom properties to their replacements', () => {
      expect(
        deprecatedCustomPropsMap.get('--sky-background-color-page-default'),
      ).toBe('--sky-theme-color-background-page');
      expect(deprecatedCustomPropsMap.get('--sky-text-color-default')).toBe(
        '--sky-theme-color-text-default',
      );
    });
  });

  describe('deprecatedScssVarMap', () => {
    it('maps deprecated SCSS variables to their replacement custom properties', () => {
      expect(deprecatedScssVarMap.get('$sky-margin-stacked-compact')).toBe(
        '--sky-theme-space-stacked-xs',
      );
      expect(deprecatedScssVarMap.get('$sky-margin-inline-default')).toBe(
        '--sky-theme-space-inline-s',
      );
    });
  });
});
