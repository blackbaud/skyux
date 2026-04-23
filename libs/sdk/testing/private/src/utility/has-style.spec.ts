import { _skyTestingHasStyle } from './has-style';

describe('hasStyle', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should return pass: true when element has the expected style', () => {
    el.style.display = 'block';
    const result = _skyTestingHasStyle(el, { display: 'block' });

    expect(result.pass).toBe(true);
  });

  it('should return pass: false when element does not have the expected style', () => {
    el.style.display = 'block';
    const result = _skyTestingHasStyle(el, { display: 'none' });

    expect(result.pass).toBe(false);
    expect(result.message).toContain(
      'Expected element not to have CSS style "display: none"',
    );
  });

  it('should check multiple styles', () => {
    el.style.display = 'block';
    el.style.visibility = 'hidden';
    const result = _skyTestingHasStyle(el, {
      display: 'block',
      visibility: 'visible',
    });

    expect(result.pass).toBe(false);
  });

  it('should handle multiple failing styles', () => {
    const result = _skyTestingHasStyle(el, {
      display: 'none',
      visibility: 'hidden',
    });

    expect(result.pass).toBe(false);
  });
});
