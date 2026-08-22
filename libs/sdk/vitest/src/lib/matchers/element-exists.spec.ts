import { elementExists } from './element-exists.js';

describe('elementExists', () => {
  it('should return pass: true when element exists', () => {
    const el = document.createElement('div');
    const result = elementExists(el);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Expected element not to exist');
  });

  it('should return pass: false when element is null', () => {
    const result = elementExists(null);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected element to exist');
  });

  it('should return pass: false when element is undefined', () => {
    const result = elementExists(undefined);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected element to exist');
  });
});
