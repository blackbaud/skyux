import { skyAnimationsEnabled } from './animations-enabled';

describe('skyAnimationsEnabled', () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should return `true` when animations are enabled', () => {
    element.style.setProperty('--sky-theme-animations-duration', '150ms');

    expect(skyAnimationsEnabled(element)).toBeTrue();
  });

  it('should return `false` when the duration is `0s`', () => {
    element.style.setProperty('--sky-theme-animations-duration', '0s');

    expect(skyAnimationsEnabled(element)).toBeFalse();
  });

  it('should return `false` when the duration is `0s` with extra whitespace', () => {
    element.style.setProperty('--sky-theme-animations-duration', '  0s  ');

    expect(skyAnimationsEnabled(element)).toBeFalse();
  });

  it('should return `true` when the property is not set', () => {
    // With @property registered, the initial-value (150ms) applies,
    // so the element should report animations as enabled.
    expect(skyAnimationsEnabled(element)).toBeTrue();
  });
});
