import { E2eVariations } from './e2e-variations';

describe('e2e variations', function () {
  it('should run all variations', function () {
    const callback = jest.fn();
    E2eVariations.forEachTheme(callback);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('default');
    expect(callback).toHaveBeenCalledWith('modern-v2-light');
    expect(callback).toHaveBeenCalledWith('modern-v2-dark');
    expect(callback).not.toHaveBeenCalledWith('modern-light');
    expect(callback).not.toHaveBeenCalledWith('modern-dark');
    callback.mockReset();

    E2eVariations.forEachTheme(callback, false);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('default');
    expect(callback).not.toHaveBeenCalledWith('modern-light');
    expect(callback).not.toHaveBeenCalledWith('modern-dark');
    expect(callback).not.toHaveBeenCalledWith('modern-v2-light');
    expect(callback).not.toHaveBeenCalledWith('modern-v2-dark');
    callback.mockReset();

    expect(E2eVariations.DISPLAY_WIDTHS).toEqual([1280]);
    expect(E2eVariations.RESPONSIVE_WIDTHS).toEqual([375, 800, 1000, 1280]);
    expect(E2eVariations.MOBILE_WIDTHS).toEqual([375]);
  });
});
