import { E2eVariations, skyThemes } from './e2e-variations';

describe('e2e variations', function () {
  it('should run all variations', function () {
    const callback = jest.fn();
    E2eVariations.forEachTheme(callback);
    expect(callback.mock.calls).toEqual([
      ['default'],
      ['modern-v2-light'],
      ['modern-v2-dark'],
    ]);
    expect(callback).not.toHaveBeenCalledWith('modern-light');
    expect(callback).not.toHaveBeenCalledWith('modern-dark');
    callback.mockReset();

    expect(E2eVariations.DISPLAY_WIDTHS).toEqual([1280]);
    expect(E2eVariations.RESPONSIVE_WIDTHS).toEqual([375, 800, 1000, 1280]);
    expect(E2eVariations.MOBILE_WIDTHS).toEqual([375]);
  });
});

describe('skyThemes', function () {
  const globals = globalThis as unknown as {
    Cypress?: { skyActiveThemes?: unknown };
  };

  function activeThemes(): unknown {
    return globals.Cypress?.skyActiveThemes;
  }

  beforeAll(function () {
    globals.Cypress = {};
  });

  afterAll(function () {
    delete globals.Cypress;
  });

  describe('without arguments', function () {
    skyThemes();

    it('should activate every theme in forEachTheme order', function () {
      expect(activeThemes()).toEqual([
        'default',
        'modern-v2-light',
        'modern-v2-dark',
      ]);
    });
  });

  describe('with a theme list', function () {
    skyThemes(['modern-v2-light', 'modern-v2-dark']);

    it('should activate only the listed themes', function () {
      expect(activeThemes()).toEqual(['modern-v2-light', 'modern-v2-dark']);
    });

    describe('when nested with a different list', function () {
      skyThemes(['modern-v2-dark']);

      it('should use the innermost list', function () {
        expect(activeThemes()).toEqual(['modern-v2-dark']);
      });
    });
  });

  it('should clear the themes after each test', function () {
    expect(activeThemes()).toBeUndefined();
  });
});
