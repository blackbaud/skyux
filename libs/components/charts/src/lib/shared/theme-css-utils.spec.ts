import {
  readThemeCategoricalPalette,
  readThemeCssNumber,
  readThemeCssString,
} from './theme-css-utils';

describe('theme-css-utils', () => {
  function createStyles(values: Record<string, string>): CSSStyleDeclaration {
    return {
      getPropertyValue: (property: string): string => values[property] ?? '',
    } as unknown as CSSStyleDeclaration;
  }

  describe('readThemeCssString', () => {
    it('should return the resolved value, trimmed', () => {
      const styles = createStyles({ '--sky-color': '  #ffffff  ' });

      expect(readThemeCssString(styles, '--sky-color')).toBe('#ffffff');
    });

    it('should return the fallback when the property is unset', () => {
      const styles = createStyles({});

      expect(readThemeCssString(styles, '--sky-color', '#000000')).toBe(
        '#000000',
      );
    });

    it('should return an empty string when the property is unset and no fallback is provided', () => {
      const styles = createStyles({});

      expect(readThemeCssString(styles, '--sky-color')).toBe('');
    });
  });

  describe('readThemeCssNumber', () => {
    it('should return a unitless number', () => {
      const styles = createStyles({ '--sky-weight': '400' });

      expect(readThemeCssNumber(styles, '--sky-weight', 100)).toBe(400);
    });

    it('should return a pixel value as a number', () => {
      const styles = createStyles({ '--sky-length': '12px' });

      expect(readThemeCssNumber(styles, '--sky-length', 0)).toBe(12);
    });

    it('should convert a rem value to pixels using the root font size', () => {
      const styles = createStyles({ '--sky-length': '2rem' });
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );

      expect(readThemeCssNumber(styles, '--sky-length', 0)).toBe(
        2 * rootFontSize,
      );
    });

    it('should return the fallback when the property is unset', () => {
      const styles = createStyles({});

      expect(readThemeCssNumber(styles, '--sky-length', 8)).toBe(8);
    });

    it('should return the fallback when the value is not a number', () => {
      const styles = createStyles({ '--sky-length': 'auto' });

      expect(readThemeCssNumber(styles, '--sky-length', 8)).toBe(8);
    });
  });

  describe('readThemeCategoricalPalette', () => {
    it('should resolve the eight categorical colors in order', () => {
      const styles = createStyles({
        '--sky-color-viz-category-1': '#first',
        '--sky-color-viz-category-8': '#last',
      });

      const palette = readThemeCategoricalPalette(styles);

      expect(palette.length).toBe(8);
      expect(palette[0]).toBe('#first');
      expect(palette[7]).toBe('#last');
    });
  });
});
