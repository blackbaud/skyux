import { E2eVariations } from './e2e-variations';

describe('e2e variations', function () {
  it('should run all variations', function () {
    const callback = jest.fn();
    E2eVariations.forEachTheme(callback);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(E2eVariations.DISPLAY_WIDTHS).toEqual([1280]);
    expect(E2eVariations.RESPONSIVE_WIDTHS).toEqual([375, 800, 1000, 1280]);
    expect(E2eVariations.MOBILE_WIDTHS).toEqual([375]);
  });
});
