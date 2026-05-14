import {
  WHITELISTED_SKY_CLASSES,
  checkSkyClassName,
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

  describe('checkSkyClassName', () => {
    it('returns valid for a known sky-theme- class', () => {
      expect(checkSkyClassName('sky-theme-margin-bottom-xs')).toEqual({
        type: 'valid',
      });
    });

    it('returns unknownThemeClass for an unknown sky-theme- class', () => {
      expect(checkSkyClassName('sky-theme-does-not-exist')).toEqual({
        type: 'unknownThemeClass',
        className: 'sky-theme-does-not-exist',
      });
    });

    it('returns deprecatedWithReplacement for a deprecated class with a replacement', () => {
      expect(checkSkyClassName('sky-margin-stacked-xs')).toEqual({
        type: 'deprecatedWithReplacement',
        className: 'sky-margin-stacked-xs',
        replacement: 'sky-theme-margin-bottom-xs',
      });
    });

    it('returns deprecatedNoReplacement for a deprecated class with no replacement', () => {
      expect(checkSkyClassName('sky-font-data-label')).toEqual({
        type: 'deprecatedNoReplacement',
        className: 'sky-font-data-label',
      });
    });

    it('returns valid for a whitelisted sky- class', () => {
      expect(checkSkyClassName('sky-btn')).toEqual({ type: 'valid' });
    });

    it('returns notPublicApi for an unknown non-theme sky- class', () => {
      expect(checkSkyClassName('sky-unknown-class')).toEqual({
        type: 'notPublicApi',
        className: 'sky-unknown-class',
      });
    });
  });
});
