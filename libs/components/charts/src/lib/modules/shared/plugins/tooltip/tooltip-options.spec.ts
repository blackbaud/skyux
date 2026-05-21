import { SkyChartStyles } from '../../services/chart-style.service';

import { getTooltipPluginOptions } from './tooltip-options';

describe('getTooltipPluginOptions', () => {
  function setupTest(): {
    styles: SkyChartStyles;
    options: ReturnType<typeof getTooltipPluginOptions>;
  } {
    const styles = createMockStyles();
    return { styles, options: getTooltipPluginOptions(styles) };
  }

  describe('base options', () => {
    it('should enable the tooltip', () => {
      const { options } = setupTest();
      expect(options.enabled).toBe(true);
    });

    it('should position the tooltip at "average"', () => {
      const { options } = setupTest();
      expect(options.position).toBe('average');
    });

    it('should display colors', () => {
      const { options } = setupTest();
      expect(options.displayColors).toBe(true);
    });

    it('should use point style', () => {
      const { options } = setupTest();
      expect(options.usePointStyle).toBe(true);
    });
  });

  describe('interaction', () => {
    it('should use "index" interaction mode', () => {
      const { options } = setupTest();
      expect(options.mode).toBe('index');
    });

    it('should not require intersection for tooltip trigger', () => {
      const { options } = setupTest();
      expect(options.intersect).toBe(false);
    });
  });

  describe('typography styles', () => {
    it('should apply title color and font from styles', () => {
      const { styles, options } = setupTest();
      expect(options.titleColor).toBe(styles.tooltip.title.color);
      expect(options.titleFont).toEqual({
        family: styles.fontFamily,
        size: styles.tooltip.title.fontSize,
        weight: styles.tooltip.title.fontWeight,
        lineHeight: styles.tooltip.title.lineHeight,
      });
    });

    it('should apply body color and font from styles', () => {
      const { styles, options } = setupTest();
      expect(options.bodyColor).toBe(styles.tooltip.body.color);
      expect(options.bodyFont).toEqual({
        family: styles.fontFamily,
        size: styles.tooltip.body.fontSize,
        weight: styles.tooltip.body.fontWeight,
        lineHeight: styles.tooltip.body.lineHeight,
      });
    });

    it('should apply footer color and font from styles', () => {
      const { styles, options } = setupTest();
      expect(options.footerColor).toBe(styles.tooltip.footer.color);
      expect(options.footerFont).toEqual({
        family: styles.fontFamily,
        size: styles.tooltip.footer.fontSize,
        weight: styles.tooltip.footer.fontWeight,
        lineHeight: styles.tooltip.footer.lineHeight,
      });
    });
  });

  describe('sizing and spacing styles', () => {
    it('should apply padding from styles', () => {
      const { styles, options } = setupTest();
      expect(options.padding).toEqual(styles.tooltip.padding);
    });

    it('should apply corner radius from styles', () => {
      const { styles, options } = setupTest();
      expect(options.cornerRadius).toBe(styles.tooltip.cornerRadius);
    });

    it('should apply border width from styles', () => {
      const { styles, options } = setupTest();
      expect(options.borderWidth).toBe(styles.tooltip.borderWidth);
    });

    it('should apply caret size and padding from styles', () => {
      const { styles, options } = setupTest();
      expect(options.caretSize).toBe(styles.tooltip.caret.size);
      expect(options.caretPadding).toBe(styles.tooltip.caret.padding);
    });

    it('should apply box dimensions and padding from styles', () => {
      const { styles, options } = setupTest();
      expect(options.boxHeight).toBe(styles.tooltip.box.height);
      expect(options.boxWidth).toBe(styles.tooltip.box.width);
      expect(options.boxPadding).toBe(styles.tooltip.box.padding);
    });

    it('should set multiKeyBackground to transparent', () => {
      const { options } = setupTest();
      expect(options.multiKeyBackground).toBe('transparent');
    });

    it('should apply title margin bottom from styles', () => {
      const { styles, options } = setupTest();
      expect(options.titleMarginBottom).toBe(styles.tooltip.title.marginBottom);
    });

    it('should apply body spacing from styles', () => {
      const { styles, options } = setupTest();
      expect(options.bodySpacing).toBe(styles.tooltip.body.bodySpacing);
    });

    it('should apply footer margin top from styles', () => {
      const { styles, options } = setupTest();
      expect(options.footerMarginTop).toBe(styles.tooltip.footer.marginTop);
    });
  });

  describe('element colors', () => {
    it('should apply background color from styles', () => {
      const { styles, options } = setupTest();
      expect(options.backgroundColor).toBe(styles.tooltip.backgroundColor);
    });

    it('should apply border color from styles', () => {
      const { styles, options } = setupTest();
      expect(options.borderColor).toBe(styles.tooltip.borderColor);
    });
  });
});

// #region Test Helpers
function createMockStyles(): SkyChartStyles {
  const styles: Partial<SkyChartStyles> = {
    fontFamily: 'Test Font, sans-serif',
    tooltip: {
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderWidth: 1,
      cornerRadius: 4,
      padding: { top: 8, right: 8, bottom: 8, left: 8 },
      shadow: { color: 'rgba(0,0,0,0.15)', blur: 4, offsetX: 1, offsetY: 2 },
      caret: { size: 8, padding: 4 },
      box: { height: 12, width: 12, padding: 4 },
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
        color: '#444444',
        bodySpacing: 2,
      },
      footer: {
        fontSize: 13,
        fontWeight: 400,
        lineHeight: '18px',
        color: '#666666',
        marginTop: 5,
      },
    },
  };

  return styles as unknown as SkyChartStyles;
}
// #endregion
