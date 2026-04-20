import {
  WHITELISTED_SKY_CLASSES,
  deprecatedStyleClassMap,
  validPublicClassNames,
} from './style-public-api';

describe('style-public-api', () => {
  describe('validPublicClassNames', () => {
    it('contains known sky-theme- class names from public-api-styles.json', () => {
      expect(validPublicClassNames.has('sky-theme-margin-bottom-xs')).toBe(
        true,
      );
      expect(validPublicClassNames.has('sky-theme-margin-top-xs')).toBe(true);
    });

    it('does not contain deprecated class names', () => {
      expect(validPublicClassNames.has('sky-margin-stacked-xs')).toBe(false);
      expect(validPublicClassNames.has('sky-margin-stacked-compact')).toBe(
        false,
      );
    });
  });

  describe('deprecatedStyleClassMap', () => {
    it('maps deprecated class names to their replacement', () => {
      expect(deprecatedStyleClassMap.get('sky-margin-stacked-xs')).toBe(
        'sky-theme-margin-bottom-xs',
      );
    });

    it('maps obsolete class names to their replacement', () => {
      expect(deprecatedStyleClassMap.get('sky-margin-stacked-compact')).toBe(
        'sky-theme-margin-bottom-xs',
      );
    });

    it('maps deprecated class names with no replacement to undefined', () => {
      expect(deprecatedStyleClassMap.has('sky-font-data-label')).toBe(true);
      expect(
        deprecatedStyleClassMap.get('sky-font-data-label'),
      ).toBeUndefined();
    });
  });

  describe('WHITELISTED_SKY_CLASSES', () => {
    it('contains whitelisted button classes', () => {
      expect(WHITELISTED_SKY_CLASSES.has('sky-btn')).toBe(true);
      expect(WHITELISTED_SKY_CLASSES.has('sky-btn-primary')).toBe(true);
    });

    it('contains content projection selector classes', () => {
      expect(WHITELISTED_SKY_CLASSES.has('sky-control-help')).toBe(true);
      expect(WHITELISTED_SKY_CLASSES.has('sky-input-group-btn')).toBe(true);
      expect(WHITELISTED_SKY_CLASSES.has('sky-input-box-btn-left')).toBe(true);
    });

    it('does not contain deprecated or unknown class names', () => {
      expect(WHITELISTED_SKY_CLASSES.has('sky-margin-stacked-xs')).toBe(false);
      expect(WHITELISTED_SKY_CLASSES.has('sky-unknown-class')).toBe(false);
    });
  });
});
