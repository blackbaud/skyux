import { resolveChartThemeStyles } from './chart-theme-styles';

describe('resolveChartThemeStyles', () => {
  function createStyles(values: Record<string, string>): CSSStyleDeclaration {
    return {
      getPropertyValue: (property: string): string => values[property] ?? '',
    } as unknown as CSSStyleDeclaration;
  }

  function resolve(
    values: Record<string, string>,
    warn = jasmine.createSpy('warn'),
  ): ReturnType<typeof resolveChartThemeStyles> {
    return resolveChartThemeStyles(createStyles(values), warn);
  }

  it('should resolve string tokens, trimmed', () => {
    const themeStyles = resolve({
      '--sky-color-text-default': '  #111111  ',
      '--sky-font-family-primary': ' Arial ',
    });

    expect(themeStyles.text.color).toBe('#111111');
    expect(themeStyles.font.family).toBe('Arial');
  });

  it('should resolve pixel and unitless numeric tokens as numbers', () => {
    const themeStyles = resolve({
      '--sky-font-size-body-m': '20px',
      '--sky-font-style-body-m': '500',
    });

    expect(themeStyles.font.size).toBe(20);
    expect(themeStyles.font.weight).toBe(500);
  });

  it('should convert rem tokens to pixels using the root font size', () => {
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );

    const themeStyles = resolve({ '--sky-font-size-body-m': '2rem' });

    expect(themeStyles.font.size).toBe(2 * rootFontSize);
  });

  it('should resolve unset or non-numeric tokens as undefined', () => {
    const themeStyles = resolve({ '--sky-border-radius-s': 'auto' });

    expect(themeStyles.font.size).toBeUndefined();
    expect(themeStyles.tooltip.cornerRadius).toBeUndefined();
  });

  it('should resolve the eight categorical palette colors in order', () => {
    const themeStyles = resolve({
      '--sky-color-viz-category-1': '#first',
      '--sky-color-viz-category-8': '#last',
    });

    expect(themeStyles.series.categoricalPalette.length).toBe(8);
    expect(themeStyles.series.categoricalPalette[0]).toBe('#first');
    expect(themeStyles.series.categoricalPalette[7]).toBe('#last');
  });

  it('should prefer the default-theme override over the theme token', () => {
    const themeStyles = resolve({
      '--sky-override-chart-color-text-default': '#override',
      '--sky-color-text-default': '#token',
      '--sky-override-chart-font-size-body-m': '20px',
      '--sky-font-size-body-m': '15px',
    });

    expect(themeStyles.text.color).toBe('#override');
    expect(themeStyles.font.size).toBe(20);
  });

  it('should warn when the SKY theme styles are not loaded', () => {
    const warn = jasmine.createSpy('warn');

    resolve({}, warn);

    expect(warn).toHaveBeenCalledOnceWith(
      jasmine.stringContaining('CSS custom properties'),
    );
  });

  it('should not warn when the theme styles are present', () => {
    const warn = jasmine.createSpy('warn');

    resolve({ '--sky-color-text-default': '#111111' }, warn);

    expect(warn).not.toHaveBeenCalled();
  });

  it('should not warn when the default-theme overrides are present', () => {
    const warn = jasmine.createSpy('warn');

    resolve({ '--sky-override-chart-color-text-default': '#111111' }, warn);

    expect(warn).not.toHaveBeenCalled();
  });

  describe('with the real SKY theme stylesheet', () => {
    // Guards against token typos in the resolver and against upstream design
    // token renames: every themed string and number must resolve to a
    // concrete value when the real modern theme styles (loaded by Karma) are
    // applied. An empty string or undefined number means a broken token.
    it('should resolve every themed token to a concrete value', () => {
      const host = document.createElement('div');
      host.classList.add('sky-theme-modern', 'sky-theme-brand-base');
      document.body.appendChild(host);

      const warn = jasmine.createSpy('warn');
      const themeStyles = resolveChartThemeStyles(getComputedStyle(host), warn);

      host.remove();

      expect(warn).not.toHaveBeenCalled();

      const sweep = (value: unknown, path: string): void => {
        if (typeof value === 'string') {
          expect(value).withContext(path).not.toBe('');
        } else if (typeof value === 'number') {
          expect(Number.isFinite(value)).withContext(path).toBe(true);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => sweep(item, `${path}[${index}]`));
        } else if (value && typeof value === 'object') {
          for (const [key, child] of Object.entries(
            value as Record<string, unknown>,
          )) {
            sweep(child, `${path}.${key}`);
          }
        } else {
          fail(`Expected ${path} to resolve to a concrete value.`);
        }
      };

      sweep(themeStyles, 'themeStyles');
    });
  });
});
