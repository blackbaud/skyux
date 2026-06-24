import {
  DEFAULT_HEADING_LEVEL,
  headingLevelInputTransformer,
} from './chart-heading-level';

describe('headingLevelInputTransformer', () => {
  it('should default to the default heading level', () => {
    expect(DEFAULT_HEADING_LEVEL).toBe(3);
  });

  for (const level of [2, 3, 4, 5] as const) {
    it(`should accept the number ${level}`, () => {
      expect(headingLevelInputTransformer(level)).toBe(level);
    });

    it(`should accept the string "${level}"`, () => {
      expect(headingLevelInputTransformer(`${level}`)).toBe(level);
    });
  }

  it('should fall back to the default for out-of-range numbers', () => {
    expect(headingLevelInputTransformer(1)).toBe(DEFAULT_HEADING_LEVEL);
    expect(headingLevelInputTransformer(6)).toBe(DEFAULT_HEADING_LEVEL);
  });

  it('should fall back to the default for non-numeric values', () => {
    expect(headingLevelInputTransformer('not-a-number')).toBe(
      DEFAULT_HEADING_LEVEL,
    );
    expect(headingLevelInputTransformer(undefined)).toBe(DEFAULT_HEADING_LEVEL);
    expect(headingLevelInputTransformer(null)).toBe(DEFAULT_HEADING_LEVEL);
  });
});
