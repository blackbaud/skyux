import { elementIsVisible } from './element-is-visible.js';

describe('elementIsVisible', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should return pass: true for a visible element with default options', () => {
    const result = elementIsVisible(el);

    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Expected element to not be visible');
  });

  it('should return pass: false when display is none (default checkCssDisplay)', () => {
    el.style.display = 'none';

    const result = elementIsVisible(el);

    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected element to be visible');
  });

  it('should return pass: false when visibility is hidden and checkCssVisibility is true', () => {
    el.style.visibility = 'hidden';
    expect(elementIsVisible(el, { checkCssVisibility: true }).pass).toBe(false);
  });

  it('should return pass: true when visibility is visible and checkCssVisibility is true', () => {
    el.style.visibility = 'visible';
    expect(elementIsVisible(el, { checkCssVisibility: true }).pass).toBe(true);
  });

  it('should return pass: false when dimensions are zero and checkDimensions is true', () => {
    expect(
      elementIsVisible(el, {
        checkCssDisplay: false,
        checkDimensions: true,
      }).pass,
    ).toBe(false);
  });

  it('should return pass: true when dimensions are non-zero and checkDimensions is true', () => {
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 50,
    } as DOMRect);

    expect(
      elementIsVisible(el, {
        checkCssDisplay: false,
        checkDimensions: true,
      }).pass,
    ).toBe(true);
  });

  it('should return pass: false when an earlier check fails and a later check passes', () => {
    el.style.display = 'none';
    el.style.visibility = 'visible';

    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 50,
    } as DOMRect);

    expect(
      elementIsVisible(el, {
        checkCssDisplay: true,
        checkCssVisibility: true,
        checkDimensions: true,
      }).pass,
    ).toBe(false);
  });

  it('should return pass: false for a null element', () => {
    expect(elementIsVisible(null).pass).toBe(false);
  });

  it('should return pass: false for an undefined element', () => {
    expect(
      elementIsVisible(undefined, {
        checkCssDisplay: false,
        checkCssVisibility: true,
        checkDimensions: true,
      }).pass,
    ).toBe(false);
  });
});
