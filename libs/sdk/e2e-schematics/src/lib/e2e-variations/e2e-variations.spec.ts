import { E2eVariations } from '@skyux-sdk/e2e-schematics';

describe('e2e variations', function () {
  it('should run all variations', function () {
    const callback = jest.fn();
    E2eVariations.forEachTheme(callback);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(E2eVariations.DISPLAY_WIDTHS).toEqual([1280]);
    expect(E2eVariations.RESPONSIVE_WIDTHS).toEqual([375, 1280]);
  });
});
