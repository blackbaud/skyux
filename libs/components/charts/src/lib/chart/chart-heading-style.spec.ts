import {
  DEFAULT_HEADING_STYLE,
  headingStyleInputTransformer,
} from './chart-heading-style';

describe('headingStyleInputTransformer', () => {
  it('should default to the default heading style', () => {
    expect(DEFAULT_HEADING_STYLE).toBe(3);
  });

  for (const style of [2, 3, 4, 5] as const) {
    it(`should accept the number ${style}`, () => {
      expect(headingStyleInputTransformer(style)).toBe(style);
    });

    it(`should accept the string "${style}"`, () => {
      expect(headingStyleInputTransformer(`${style}`)).toBe(style);
    });
  }

  it('should fall back to the default for out-of-range numbers', () => {
    expect(headingStyleInputTransformer(1)).toBe(DEFAULT_HEADING_STYLE);
    expect(headingStyleInputTransformer(6)).toBe(DEFAULT_HEADING_STYLE);
  });

  it('should fall back to the default for non-numeric values', () => {
    expect(headingStyleInputTransformer('not-a-number')).toBe(
      DEFAULT_HEADING_STYLE,
    );
    expect(headingStyleInputTransformer(undefined)).toBe(DEFAULT_HEADING_STYLE);
    expect(headingStyleInputTransformer(null)).toBe(DEFAULT_HEADING_STYLE);
  });
});
