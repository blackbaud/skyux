import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import {
  SkyChartStyleService,
  type SkyChartStyles,
} from './chart-style.service';

describe('SkyChartStyleService', () => {
  function setupTest(options: { theme?: SkyThemeSettings }): {
    service: SkyChartStyleService;
    themeSvc: SkyThemeService;
  } {
    const theme =
      options.theme ??
      new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.light);

    TestBed.configureTestingModule({
      providers: [SkyChartStyleService, SkyThemeService],
    });

    const themeSvc = TestBed.inject(SkyThemeService);
    const renderer = TestBed.inject(RendererFactory2).createRenderer(
      null,
      null,
    );
    themeSvc.init(document.body, renderer, theme);

    return {
      service: TestBed.inject(SkyChartStyleService),
      themeSvc,
    };
  }

  afterEach(() => {
    // Clean up theme service after each test to prevent side effects on other tests
    const themeSvc = TestBed.inject(SkyThemeService);
    themeSvc.setTheme(
      new SkyThemeSettings(
        SkyTheme.presets.default,
        SkyThemeMode.presets.light,
      ),
    );
    themeSvc.destroy();
  });

  describe('theme changes', () => {
    it('should recompute styles when theme changes', () => {
      const { service, themeSvc } = setupTest({});
      const initialStyles = service.styles();

      themeSvc.setTheme(
        new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
      );

      const updatedStyles = service.styles();
      expect(updatedStyles).not.toBe(initialStyles);
    });
  });

  describe('default theme', () => {
    const theme = new SkyThemeSettings(
      SkyTheme.presets.default,
      SkyThemeMode.presets.light,
    );

    it('should resolve palette colors', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().palettes).toEqual(DefaultTheme.palettes);
    });

    it('should resolve height constraints', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().height).toEqual(DefaultTheme.height);
    });

    it('should resolve font family and chart padding', () => {
      const { service } = setupTest({ theme });
      const styles = service.styles();
      expect(styles.fontFamily).toBe(DefaultTheme.fontFamily);
      expect(styles.chartPadding).toBe(DefaultTheme.chartPadding);
    });

    it('should resolve axis border and grid styles', () => {
      const { service } = setupTest({ theme });
      const { axis } = service.styles();
      expect(axis.border).toEqual(DefaultTheme.axis.border);
      expect(axis.grid).toEqual(DefaultTheme.axis.grid);
    });

    it('should resolve axis tick styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().axis.ticks).toEqual(DefaultTheme.axis.ticks);
    });

    it('should resolve axis title styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().axis.title).toEqual(DefaultTheme.axis.title);
    });

    it('should resolve tooltip base styles', () => {
      const { service } = setupTest({ theme });
      const { tooltip } = service.styles();
      expect(tooltip.backgroundColor).toBe(
        DefaultTheme.tooltip.backgroundColor,
      );
      expect(tooltip.borderColor).toBe(DefaultTheme.tooltip.borderColor);
      expect(tooltip.borderWidth).toBe(DefaultTheme.tooltip.borderWidth);
      expect(tooltip.cornerRadius).toBe(DefaultTheme.tooltip.cornerRadius);
    });

    it('should resolve tooltip padding', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.padding).toEqual(
        DefaultTheme.tooltip.padding,
      );
    });

    it('should resolve tooltip shadow', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.shadow).toEqual(
        DefaultTheme.tooltip.shadow,
      );
    });

    it('should resolve tooltip caret and box', () => {
      const { service } = setupTest({ theme });
      const { tooltip } = service.styles();
      expect(tooltip.caret).toEqual(DefaultTheme.tooltip.caret);
      expect(tooltip.box).toEqual(DefaultTheme.tooltip.box);
    });

    it('should resolve tooltip title styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.title).toEqual(
        DefaultTheme.tooltip.title,
      );
    });

    it('should resolve tooltip body styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.body).toEqual(DefaultTheme.tooltip.body);
    });

    it('should resolve tooltip footer styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.footer).toEqual(
        DefaultTheme.tooltip.footer,
      );
    });

    it('should resolve indicator styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().indicator).toEqual(DefaultTheme.indicator);
    });

    it('should resolve bar chart styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().charts.bar).toEqual(DefaultTheme.charts.bar);
    });

    it('should resolve line chart styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().charts.line).toEqual(DefaultTheme.charts.line);
    });

    it('should resolve donut chart styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().charts.donut).toEqual(DefaultTheme.charts.donut);
    });
  });

  describe('modern theme', () => {
    const theme = new SkyThemeSettings(
      SkyTheme.presets.modern,
      SkyThemeMode.presets.light,
    );

    it('should resolve palette colors', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().palettes).toEqual(ModernTheme.palettes);
    });

    it('should resolve height constraints', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().height).toEqual(ModernTheme.height);
    });

    it('should resolve font family and chart padding', () => {
      const { service } = setupTest({ theme });
      const styles = service.styles();
      expect(styles.fontFamily).toBe(ModernTheme.fontFamily);
      expect(styles.chartPadding).toBe(ModernTheme.chartPadding);
    });

    it('should resolve axis border and grid styles', () => {
      const { service } = setupTest({ theme });
      const { axis } = service.styles();
      expect(axis.border).toEqual(ModernTheme.axis.border);
      expect(axis.grid).toEqual(ModernTheme.axis.grid);
    });

    it('should resolve axis tick styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().axis.ticks).toEqual(ModernTheme.axis.ticks);
    });

    it('should resolve axis title styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().axis.title).toEqual(ModernTheme.axis.title);
    });

    it('should resolve tooltip base styles', () => {
      const { service } = setupTest({ theme });
      const { tooltip } = service.styles();
      expect(tooltip.backgroundColor).toBe(ModernTheme.tooltip.backgroundColor);
      expect(tooltip.borderColor).toBe(ModernTheme.tooltip.borderColor);
      expect(tooltip.borderWidth).toBe(ModernTheme.tooltip.borderWidth);
      expect(tooltip.cornerRadius).toBe(ModernTheme.tooltip.cornerRadius);
    });

    it('should resolve tooltip padding', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.padding).toEqual(
        ModernTheme.tooltip.padding,
      );
    });

    it('should resolve tooltip shadow', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.shadow).toEqual(
        ModernTheme.tooltip.shadow,
      );
    });

    it('should resolve tooltip caret and box', () => {
      const { service } = setupTest({ theme });
      const { tooltip } = service.styles();
      expect(tooltip.caret).toEqual(ModernTheme.tooltip.caret);
      expect(tooltip.box).toEqual(ModernTheme.tooltip.box);
    });

    it('should resolve tooltip title styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.title).toEqual(ModernTheme.tooltip.title);
    });

    it('should resolve tooltip body styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.body).toEqual(ModernTheme.tooltip.body);
    });

    it('should resolve tooltip footer styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().tooltip.footer).toEqual(
        ModernTheme.tooltip.footer,
      );
    });

    it('should resolve indicator styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().indicator).toEqual(ModernTheme.indicator);
    });

    it('should resolve bar chart styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().charts.bar).toEqual(ModernTheme.charts.bar);
    });

    it('should resolve line chart styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().charts.line).toEqual(ModernTheme.charts.line);
    });

    it('should resolve donut chart styles', () => {
      const { service } = setupTest({ theme });
      expect(service.styles().charts.donut).toEqual(ModernTheme.charts.donut);
    });
  });
});

// #region Test Data
const DefaultTheme: SkyChartStyles = {
  palettes: {
    categorical: [
      '#06a39e',
      '#6d3c96',
      '#5589dd',
      '#004252',
      '#ce5600',
      '#822325',
      '#c650c1',
      '#077e43',
    ],
    sequential: [
      '#dcf6f5',
      '#abe9e7',
      '#60d5d2',
      '#07beb8',
      '#06a39e',
      '#058984',
      '#046e6b',
      '#035755',
      '#02413f',
      '#022a28',
    ],
    positiveDiverging: [
      '#eef3fc',
      '#d5e1f7',
      '#aac4ee',
      '#80a6e6',
      '#5589dd',
      '#2b6bd5',
      '#2256aa',
      '#1a4080',
      '#112b55',
      '#0d2040',
    ],
    negativeDiverging: [
      '#fae7e8',
      '#f5cccd',
      '#f1b4b5',
      '#ea9596',
      '#e36d6f',
      '#d93a3d',
      '#ae2e31',
      '#822325',
      '#641b1c',
      '#4a1415',
    ],
  },
  height: {
    min: 168.75,
    max: 375,
    default: 'clamp(11.25rem, 28vh, 25rem)',
  },
  fontFamily: 'Blackbaud Sans, Arial, sans-serif',
  chartPadding: 0,
  axis: {
    border: {
      color: '#85888d',
      width: 1,
    },
    grid: {
      color: '#d5d6d8',
      width: 1,
    },
    ticks: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: '18px',
      color: '#252b33',
      padding: 5,
      measureLength: 12,
      categoryLength: 0,
    },
    title: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: '18px',
      color: '#686c73',
      paddingTop: 5,
      paddingBottom: 5,
    },
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#cdcfd2',
    borderWidth: 1,
    cornerRadius: 3,
    padding: {
      top: 8,
      right: 8,
      bottom: 8,
      left: 8,
    },
    shadow: {
      color: 'rgba(33, 35, 39, 0.6)',
      blur: 4,
      offsetX: 1,
      offsetY: 2,
    },
    caret: {
      size: 8,
      padding: 4,
    },
    box: {
      height: 12,
      width: 12,
      padding: 4,
    },
    title: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: '20px',
      color: '#212327',
      marginBottom: 5,
    },
    body: {
      fontSize: 15,
      fontWeight: 400,
      lineHeight: '20px',
      color: '#212327',
      bodySpacing: 0,
    },
    footer: {
      fontSize: 15,
      fontWeight: 400,
      lineHeight: '20px',
      color: '#212327',
      marginTop: 5,
    },
  },
  indicator: {
    padding: 2,
    borderRadius: 3,
    hover: {
      borderWidth: 1,
      borderColor: '#0974A1',
      backgroundColor: '#eeeeef',
    },
    active: {
      borderWidth: 2,
      borderColor: '#0974A1',
      backgroundColor: '#eeeeef',
    },
    focus: {
      borderWidth: 2,
      borderColor: '#0974A1',
      backgroundColor: '#eeeeef',
    },
  },
  charts: {
    bar: {
      borderColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 2,
      vertical: {
        maxBarThickness: 112.5,
      },
      horizontal: {
        minBarThickness: 11.25,
        maxBarThickness: 15,
        minCategoryGap: 7.5,
      },
    },
    line: {
      tension: 0.2,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBorderWidth: 2,
    },
    donut: {
      borderColor: '#ffffff',
      borderWidth: 1,
    },
  },
};

const ModernTheme: SkyChartStyles = {
  palettes: {
    categorical: [
      '#06a39e',
      '#6d3c96',
      '#5589dd',
      '#004252',
      '#ce5600',
      '#822325',
      '#c650c1',
      '#077e43',
    ],
    sequential: [
      '#dcf6f5',
      '#abe9e7',
      '#60d5d2',
      '#07beb8',
      '#06a39e',
      '#058984',
      '#046e6b',
      '#035755',
      '#02413f',
      '#022a28',
    ],
    positiveDiverging: [
      '#eef3fc',
      '#d5e1f7',
      '#aac4ee',
      '#80a6e6',
      '#5589dd',
      '#2b6bd5',
      '#2256aa',
      '#1a4080',
      '#112b55',
      '#0d2040',
    ],
    negativeDiverging: [
      '#fae7e8',
      '#f5cccd',
      '#f1b4b5',
      '#ea9596',
      '#e36d6f',
      '#d93a3d',
      '#ae2e31',
      '#822325',
      '#641b1c',
      '#4a1415',
    ],
  },
  height: {
    min: 180,
    max: 400,
    default: 'clamp(11.25rem, 28vh, 25rem)',
  },
  fontFamily: 'BLKB Sans, Helvetica Neue, Arial, sans-serif',
  chartPadding: 0,
  axis: {
    border: {
      color: '#85888d',
      width: 1,
    },
    grid: {
      color: '#d5d6d8',
      width: 1,
    },
    ticks: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: '20.7692px',
      color: '#1e2229',
      padding: 4,
      measureLength: 12,
      categoryLength: 0,
    },
    title: {
      fontSize: 13,
      fontWeight: 400,
      lineHeight: '20.7692px',
      color: '#666b70',
      paddingTop: 4,
      paddingBottom: 4,
    },
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#cad2e1',
    borderWidth: 1,
    cornerRadius: 4,
    padding: {
      top: 8,
      right: 8,
      bottom: 8,
      left: 8,
    },
    shadow: {
      color: 'rgba(33, 44, 63, 0.6)',
      blur: 4,
      offsetX: 1,
      offsetY: 2,
    },
    caret: {
      size: 8,
      padding: 4,
    },
    box: {
      height: 12,
      width: 12,
      padding: 4,
    },
    title: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: '20px',
      color: '#1e2229',
      marginBottom: 8,
    },
    body: {
      fontSize: 15,
      fontWeight: 400,
      lineHeight: '20px',
      color: '#1e2229',
      bodySpacing: 0,
    },
    footer: {
      fontSize: 15,
      fontWeight: 400,
      lineHeight: '20px',
      color: '#1e2229',
      marginTop: 8,
    },
  },
  indicator: {
    padding: 2,
    borderRadius: 4,
    hover: {
      borderWidth: 1,
      borderColor: '#2b6bd5',
      backgroundColor: '#f4f8fd',
    },
    active: {
      borderWidth: 2,
      borderColor: '#2b6bd5',
      backgroundColor: '#eef3fc',
    },
    focus: {
      borderWidth: 2,
      borderColor: '#2b6bd5',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
  },
  charts: {
    bar: {
      borderColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 2,
      vertical: {
        maxBarThickness: 120,
      },
      horizontal: {
        minBarThickness: 12,
        maxBarThickness: 16,
        minCategoryGap: 8,
      },
    },
    line: {
      tension: 0.2,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBorderWidth: 2,
    },
    donut: {
      borderColor: '#ffffff',
      borderWidth: 1,
    },
  },
};
// #endregion
