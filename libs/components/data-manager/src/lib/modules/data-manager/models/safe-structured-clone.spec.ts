import { safeStructuredClone } from './safe-structured-clone';

describe('safeStructuredClone', () => {
  it('should return undefined when given undefined', () => {
    expect(safeStructuredClone(undefined)).toBeUndefined();
  });

  it('should return null when given null', () => {
    expect(safeStructuredClone(null)).toBeNull();
  });

  it('should return a deep clone for a cloneable value', () => {
    const original = { nested: { value: 42 }, list: [1, 2, 3] };
    const cloned = safeStructuredClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.nested).not.toBe(original.nested);
  });

  it('should return the original reference when structuredClone throws', () => {
    // Functions are not cloneable by structuredClone.
    const fn = (): string => 'hello';
    const result = safeStructuredClone(fn);

    expect(result).toBe(fn);
  });
});
