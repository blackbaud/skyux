import { elementHasStyle } from './element-has-style.js';

describe('elementHasStyle', () => {
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
    const result = elementHasStyle(el, { display: 'block' });

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected element not to have CSS style "display: block"',
    );
  });

  it('should return pass: false when element does not have the expected style', () => {
    el.style.display = 'block';
    const result = elementHasStyle(el, { display: 'none' });

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to have CSS style "display: none", but it was "block"',
    );
  });

  it('should only report the styles that do not match', () => {
    el.style.display = 'block';
    el.style.visibility = 'hidden';
    const result = elementHasStyle(el, {
      display: 'block',
      visibility: 'visible',
    });

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to have CSS style "visibility: visible", but it was "hidden"',
    );
  });

  it('should report every failing style', () => {
    const result = elementHasStyle(el, {
      display: 'none',
      visibility: 'hidden',
    });

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      [
        'Expected element to have CSS style "display: none", but it was "block"',
        'Expected element to have CSS style "visibility: hidden", but it was "visible"',
      ].join('\n'),
    );
  });
});
