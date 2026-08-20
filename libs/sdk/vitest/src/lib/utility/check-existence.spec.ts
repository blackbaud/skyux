import { _skyTestingCheckExistence } from './check-existence';

describe('checkExistence', () => {
  it('should return pass: true when element exists', () => {
    const el = document.createElement('div');
    const result = _skyTestingCheckExistence(el);

    expect(result.pass).toBe(true);
    expect(result.message).toBe('Expected element not to exist');
  });

  it('should return pass: false when element is null', () => {
    const result = _skyTestingCheckExistence(null);

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected element to exist');
  });

  it('should return pass: false when element is undefined', () => {
    const result = _skyTestingCheckExistence(undefined);

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected element to exist');
  });
});
