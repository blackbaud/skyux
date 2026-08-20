import { checkExistence } from './check-existence';

describe('checkExistence', () => {
  it('should return pass: true when element exists', () => {
    const el = document.createElement('div');
    const result = checkExistence(el);

    expect(result.pass).toBe(true);
    expect(result.message).toBe('Expected element not to exist');
  });

  it('should return pass: false when element is null', () => {
    const result = checkExistence(null);

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected element to exist');
  });

  it('should return pass: false when element is undefined', () => {
    const result = checkExistence(undefined);

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected element to exist');
  });
});
