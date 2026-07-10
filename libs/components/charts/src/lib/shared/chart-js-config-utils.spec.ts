import { type SkyChartJsConfig } from './chart-js';

import { extendBaseChartJsConfig } from './chart-js-config-utils';

type TooltipProbe = {
  enabled: boolean;
  position: string;
  titleColor: string;
  titleFont: { family: string; size: number; weight: number };
  bodyFont: { weight: number };
  padding: { top: number; left: number };
  cornerRadius: number;
  boxWidth: number;
  multiKeyBackground: string;
  backgroundColor: string;
  callbacks: { label: () => string };
};

function getTooltip(config: SkyChartJsConfig<'bar'>): TooltipProbe {
  return config.options.plugins?.tooltip as unknown as TooltipProbe;
}

describe('extendBaseChartJsConfig', () => {
  function createStyles(values: Record<string, string>): CSSStyleDeclaration {
    return {
      getPropertyValue: (property: string): string => values[property] ?? '',
    } as unknown as CSSStyleDeclaration;
  }

  function extend(
    values: Record<string, string> = {},
  ): SkyChartJsConfig<'bar'> {
    return extendBaseChartJsConfig<'bar'>(createStyles(values), {
      type: 'bar',
      data: { labels: ['a'], datasets: [{ data: [1] }] },
      options: {
        indexAxis: 'x',
        plugins: {
          tooltip: {
            callbacks: { label: (): string => 'from-override' },
          },
        },
      },
    });
  }

  it('should preserve the chart-specific type, data, and options', () => {
    const config = extend();

    expect(config.type).toBe('bar');
    expect(config.data.labels).toEqual(['a']);
    expect(config.options.indexAxis).toBe('x');
  });

  it('should apply the shared base options', () => {
    const config = extend();

    expect(config.options.responsive).toBe(true);
    expect(config.options.maintainAspectRatio).toBe(false);
    expect(config.options.resizeDelay).toBe(150);
    expect(config.options.interaction?.mode).toBe('nearest');
    expect(config.options.plugins?.legend?.display).toBe(false);
  });

  it('should merge the base tooltip styling with the chart-specific callbacks', () => {
    const tooltip = getTooltip(
      extend({
        '--sky-color-text-default': '#111111',
        '--sky-border-radius-s': '6px',
      }),
    );

    // Base styling is retained...
    expect(tooltip.enabled).toBe(true);
    expect(tooltip.position).toBe('average');
    expect(tooltip.titleColor).toBe('#111111');
    expect(tooltip.cornerRadius).toBe(6);
    expect(tooltip.multiKeyBackground).toBe('transparent');
    // ...alongside the chart-specific callback.
    expect(tooltip.callbacks.label()).toBe('from-override');
  });

  it('should resolve themed tooltip typography tokens', () => {
    const tooltip = getTooltip(
      extend({
        '--sky-font-family-primary': 'Arial',
        '--sky-font-size-body-m': '15px',
        '--sky-font-style-emphasized': '700',
        '--sky-font-style-body-m': '400',
      }),
    );

    expect(tooltip.titleFont.family).toBe('Arial');
    expect(tooltip.titleFont.size).toBe(15);
    expect(tooltip.titleFont.weight).toBe(700);
    expect(tooltip.bodyFont.weight).toBe(400);
  });

  it('should fall back to defaults when tooltip tokens are unset', () => {
    const tooltip = getTooltip(extend());

    expect(tooltip.titleFont.size).toBe(15);
    expect(tooltip.titleFont.weight).toBe(700);
    expect(tooltip.bodyFont.weight).toBe(400);
    expect(tooltip.padding.left).toBe(12);
    expect(tooltip.cornerRadius).toBe(4);
    expect(tooltip.boxWidth).toBe(16);
    expect(tooltip.backgroundColor).toBe('#ffffff');
  });
});
