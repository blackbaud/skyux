import { TestBed } from '@angular/core/testing';

import { SkyChart } from '../chart/chart';

import { resolveChartThemeStyles } from './chart-theme-styles';

describe('resolveChartThemeStyles', () => {
  let hosts: HTMLElement[];

  beforeEach(() => {
    hosts = [];
  });

  afterEach(() => {
    hosts.forEach((host) => host.remove());
  });

  function createHost(values: Record<string, string>): HTMLElement {
    const host = document.createElement('div');

    for (const [property, value] of Object.entries(values)) {
      host.style.setProperty(property, value);
    }

    document.body.appendChild(host);
    hosts.push(host);

    return host;
  }

  function resolve(
    values: Record<string, string>,
  ): ReturnType<typeof resolveChartThemeStyles> {
    return resolveChartThemeStyles(createHost(values));
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
      '--sky-font-size-body-s': '20px',
      '--sky-font-style-body-s': '500',
    });

    expect(themeStyles.font.size).toBe(20);
    expect(themeStyles.font.weight).toBe(500);
  });

  it('should convert rem tokens to pixels using the root font size', () => {
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );

    const themeStyles = resolve({ '--sky-font-size-body-s': '2rem' });

    expect(themeStyles.font.size).toBe(2 * rootFontSize);
  });

  it('should resolve unset numeric tokens to NaN', () => {
    const themeStyles = resolve({});

    expect(themeStyles.font.size).toBeNaN();
    expect(themeStyles.text.lineHeight).toBeNaN();
  });

  it('should resolve unparseable numeric tokens to NaN', () => {
    const themeStyles = resolve({
      '--sky-border-radius-s': 'auto',
      '--sky-font-line_height-body-s': 'normal',
    });

    expect(themeStyles.tooltip.cornerRadius).toBeNaN();
    expect(themeStyles.text.lineHeight).toBeNaN();
  });

  it('should resolve calc() number and length tokens through the probe', () => {
    const themeStyles = resolve({
      '--sky-font-line_height-body-s': 'calc(3 / 2)',
      '--sky-border-radius-s': 'calc(2px + 3px)',
    });

    expect(themeStyles.text.lineHeight).toBe(1.5);
    expect(themeStyles.tooltip.cornerRadius).toBe(5);
  });

  it('should resolve a plain-number line height token', () => {
    const themeStyles = resolve({
      '--sky-font-line_height-body-s': '1.25',
    });

    expect(themeStyles.text.lineHeight).toBe(1.25);
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
      '--sky-override-chart-font-size-body-s': '20px',
      '--sky-font-size-body-s': '15px',
    });

    expect(themeStyles.text.color).toBe('#override');
    expect(themeStyles.font.size).toBe(20);
  });

  it('should resolve the bar-layout sizing in pixels', () => {
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const themeStyles = resolve({});

    // The height bounds are authored on the `sky-chart` host; on a bare
    // element they are out of scope and resolve like any unset token.
    expect(themeStyles.height.min).toBeNaN();
    expect(themeStyles.height.max).toBeNaN();

    expect(themeStyles.bar.vertical.baseBarThickness).toBe(2 * rootFontSize);
    expect(themeStyles.bar.vertical.minBarThickness).toBe(0.75 * rootFontSize);
    expect(themeStyles.bar.vertical.maxBarThickness).toBe(7.5 * rootFontSize);
    expect(themeStyles.bar.horizontal.minBarThickness).toBe(
      0.75 * rootFontSize,
    );
    expect(themeStyles.bar.horizontal.maxBarThickness).toBe(1 * rootFontSize);
    expect(themeStyles.bar.horizontal.minCategoryGap).toBe(0.5 * rootFontSize);
  });

  it('should resolve the height bounds from the sky-chart custom properties', () => {
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const themeStyles = resolve({
      '--sky-chart-height-min': '10rem',
      '--sky-chart-height-viewport': '30vh',
      '--sky-chart-height-max': '30rem',
    });

    expect(themeStyles.height.min).toBe(10 * rootFontSize);
    expect(themeStyles.height.max).toBe(30 * rootFontSize);
    expect(themeStyles.height.default).toBe(
      `clamp(${10 * rootFontSize}px, 30vh, ${30 * rootFontSize}px)`,
    );
  });

  describe('with the real SKY theme stylesheet', () => {
    // Fails if any string is empty or any number is not finite: either means a
    // token the chart depends on is missing or broken. Both real-theme paths
    // must pass so the component cannot ship with missing or broken styling.
    function expectEveryValueConcrete(
      themeStyles: ReturnType<typeof resolveChartThemeStyles>,
    ): void {
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
    }

    // Guards against token typos in the resolver and against upstream design
    // token renames: every themed string and number must resolve to a
    // concrete value when the real modern theme styles (loaded by Karma) are
    // applied. Resolves against a real `sky-chart` host, matching the
    // production invariant that plots render inside `sky-chart`.
    it('should resolve every modern-theme token to a concrete value', async () => {
      await TestBed.configureTestingModule({
        imports: [SkyChart],
      }).compileComponents();

      const fixture = TestBed.createComponent(SkyChart);
      fixture.componentRef.setInput('headingText', 'Test chart');

      const host = fixture.nativeElement as HTMLElement;
      host.classList.add('sky-theme-modern', 'sky-theme-brand-base');
      fixture.detectChanges();

      const themeStyles = resolveChartThemeStyles(host);

      expectEveryValueConcrete(themeStyles);
    });

    // Guards the default theme's `sky-default-overrides` block in `chart.scss`:
    // resolving against a real `sky-chart` host (outside the modern theme, so
    // only the `--sky-override-chart-*` values apply) proves every override is
    // present and parseable. A missing or typo'd override fails here.
    it('should resolve every default-theme token to a concrete value', async () => {
      await TestBed.configureTestingModule({
        imports: [SkyChart],
      }).compileComponents();

      const fixture = TestBed.createComponent(SkyChart);
      fixture.componentRef.setInput('headingText', 'Test chart');
      fixture.detectChanges();

      const themeStyles = resolveChartThemeStyles(
        fixture.nativeElement as HTMLElement,
      );

      expectEveryValueConcrete(themeStyles);
    });
  });
});
