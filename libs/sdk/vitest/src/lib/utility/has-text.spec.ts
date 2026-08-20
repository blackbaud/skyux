import { _skyTestingHasText } from './has-text';

describe('hasText', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('should return pass: true when text matches (trimmed)', () => {
    el.textContent = '  Hello World  ';
    const result = _skyTestingHasText(el, 'Hello World', true);

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected element\'s inner text "Hello World" not to be: "Hello World"',
    );
  });

  it('should return pass: false when text does not match (trimmed)', () => {
    el.textContent = 'Hello World';
    const result = _skyTestingHasText(el, 'Goodbye', true);

    expect(result.pass).toBe(false);
    expect(result.message).toContain(
      'Expected element\'s inner text to be: "Goodbye"',
    );
    expect(result.message).toContain(
      'Actual element\'s inner text was: "Hello World"',
    );
  });

  it('should not trim whitespace when trimWhitespace is false', () => {
    el.textContent = '  Hello World  ';
    const result = _skyTestingHasText(el, 'Hello World', false);

    expect(result.pass).toBe(false);
  });

  it('should handle null textContent', () => {
    Object.defineProperty(el, 'textContent', { value: null });
    const result = _skyTestingHasText(el, '', true);

    expect(result.pass).toBe(true);
  });
});
