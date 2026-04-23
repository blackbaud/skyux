import { _skyTestingCheckVisibility } from './check-visibility';

describe('checkVisibility', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should return pass: true for a visible element with default options', () => {
    expect(_skyTestingCheckVisibility(el).pass).toBe(true);
  });

  it('should return pass: false when display is none (default checkCssDisplay)', () => {
    el.style.display = 'none';
    expect(_skyTestingCheckVisibility(el).pass).toBe(false);
  });

  it('should return pass: false when visibility is hidden and checkCssVisibility is true', () => {
    el.style.visibility = 'hidden';
    expect(
      _skyTestingCheckVisibility(el, { checkCssVisibility: true }).pass,
    ).toBe(false);
  });

  it('should return pass: true when visibility is visible and checkCssVisibility is true', () => {
    el.style.visibility = 'visible';
    expect(
      _skyTestingCheckVisibility(el, { checkCssVisibility: true }).pass,
    ).toBe(true);
  });

  it('should return pass: false when dimensions are zero and checkDimensions is true', () => {
    expect(
      _skyTestingCheckVisibility(el, {
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
      _skyTestingCheckVisibility(el, {
        checkCssDisplay: false,
        checkDimensions: true,
      }).pass,
    ).toBe(true);
  });

  it('should return pass: true when checkExists is true and element exists', () => {
    expect(
      _skyTestingCheckVisibility(el, {
        checkCssDisplay: false,
        checkExists: true,
      }).pass,
    ).toBe(true);
  });

  it('should return pass: false when checkExists is true and element is falsy', () => {
    expect(
      _skyTestingCheckVisibility(undefined as unknown as Element, {
        checkCssDisplay: false,
        checkExists: true,
      }).pass,
    ).toBe(false);
  });
});
