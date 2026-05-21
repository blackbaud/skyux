import { TestBed } from '@angular/core/testing';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyChartCssUtilsService } from './chart-css-utils.service';

describe('SkyChartCssUtilsService', () => {
  describe('css()', () => {
    describe('when body has the value', () => {
      let service: SkyChartCssUtilsService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            SkyChartCssUtilsService,
            {
              provide: SkyAppWindowRef,
              useValue: createMockWindowRef({
                bodyValues: { '--my-color': 'red' },
              }),
            },
          ],
        });
        service = TestBed.inject(SkyChartCssUtilsService);
      });

      it('should return the body CSS variable value', () => {
        expect(service.css('--my-color')).toBe('red');
      });
    });

    describe('when body has no value but documentElement does', () => {
      let service: SkyChartCssUtilsService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            SkyChartCssUtilsService,
            {
              provide: SkyAppWindowRef,
              useValue: createMockWindowRef({
                docElValues: { '--my-color': 'blue' },
              }),
            },
          ],
        });
        service = TestBed.inject(SkyChartCssUtilsService);
      });

      it('should fall back to the documentElement value', () => {
        expect(service.css('--my-color')).toBe('blue');
      });
    });

    describe('when neither body nor documentElement has a value', () => {
      let service: SkyChartCssUtilsService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            SkyChartCssUtilsService,
            {
              provide: SkyAppWindowRef,
              useValue: createMockWindowRef(),
            },
          ],
        });
        service = TestBed.inject(SkyChartCssUtilsService);
      });

      it('should return the cssFallback', () => {
        expect(service.css('--unknown', 'fallback-value')).toBe(
          'fallback-value',
        );
      });

      it('should return empty string when no value and no fallback', () => {
        expect(service.css('--unknown')).toBe('');
      });
    });
  });

  describe('cssNumber()', () => {
    describe('with unitless or pixel values', () => {
      let service: SkyChartCssUtilsService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            SkyChartCssUtilsService,
            {
              provide: SkyAppWindowRef,
              useValue: createMockWindowRef({
                bodyValues: { '--my-num': '400', '--my-size': '16px' },
              }),
            },
          ],
        });
        service = TestBed.inject(SkyChartCssUtilsService);
      });

      it('should return a plain number directly (unitless)', () => {
        expect(service.cssNumber('--my-num')).toBe(400);
      });

      it('should parse a pixel value directly', () => {
        expect(service.cssNumber('--my-size')).toBe(16);
      });
    });

    describe('with rem/other units', () => {
      let service: SkyChartCssUtilsService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            SkyChartCssUtilsService,
            {
              provide: SkyAppWindowRef,
              useValue: createMockWindowRef({
                bodyValues: { '--my-rem': '1rem' },
                measureValues: { width: '16px' },
              }),
            },
          ],
        });
        service = TestBed.inject(SkyChartCssUtilsService);
      });

      it('should use cssMeasured and return the computed pixel value', () => {
        expect(service.cssNumber('--my-rem')).toBe(16);
      });
    });
  });

  describe('cssMeasured()', () => {
    let service: SkyChartCssUtilsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyChartCssUtilsService,
          {
            provide: SkyAppWindowRef,
            useValue: createMockWindowRef({
              bodyValues: { '--my-var': '24px' },
              measureValues: { width: '24px' },
            }),
          },
        ],
      });
      service = TestBed.inject(SkyChartCssUtilsService);
    });

    it('should return the computed value of the CSS property', () => {
      expect(service.cssMeasured('--my-var', undefined, 'width')).toBe('24px');
    });

    it('should use width as the default cssProperty', () => {
      expect(service.cssMeasured('--my-var')).toBe('24px');
    });
  });

  describe('remToPx()', () => {
    let service: SkyChartCssUtilsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyChartCssUtilsService,
          {
            provide: SkyAppWindowRef,
            useValue: createMockWindowRef(),
          },
        ],
      });
      service = TestBed.inject(SkyChartCssUtilsService);
    });

    it('should convert a rem number to pixels using root font size', () => {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      expect(service.remToPx(1.5)).toBe(1.5 * rootFontSize);
    });

    it('should convert a rem string to pixels', () => {
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      expect(service.remToPx('2rem')).toBe(2 * rootFontSize);
    });
  });

  describe('extractShadowColor()', () => {
    let service: SkyChartCssUtilsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyChartCssUtilsService,
          {
            provide: SkyAppWindowRef,
            useValue: createMockWindowRef(),
          },
        ],
      });
      service = TestBed.inject(SkyChartCssUtilsService);
    });

    it('should extract rgba color from shadow value', () => {
      expect(service.extractShadowColor('0 2px 4px rgba(0, 0, 0, 0.5)')).toBe(
        'rgba(0, 0, 0, 0.5)',
      );
    });

    it('should extract rgb color from shadow value', () => {
      expect(service.extractShadowColor('0 2px 4px rgb(10, 20, 30)')).toBe(
        'rgb(10, 20, 30)',
      );
    });

    it('should extract hex color from shadow value', () => {
      expect(service.extractShadowColor('0 2px 4px #abc123')).toBe('#abc');
    });

    it('should extract 3-digit hex color from shadow value', () => {
      expect(service.extractShadowColor('0 2px 4px #abc')).toBe('#abc');
    });

    it('should return null when no color is found', () => {
      expect(service.extractShadowColor('0 2px 4px none')).toBeNull();
    });
  });

  describe('colorToRgbaWithAlpha()', () => {
    let service: SkyChartCssUtilsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyChartCssUtilsService,
          {
            provide: SkyAppWindowRef,
            useValue: createMockWindowRef(),
          },
        ],
      });
      service = TestBed.inject(SkyChartCssUtilsService);
    });

    it('should convert rgb color to rgba with specified alpha', () => {
      expect(service.colorToRgbaWithAlpha('rgb(10, 20, 30)', 0.5)).toBe(
        'rgba(10, 20, 30, 0.5)',
      );
    });

    it('should convert rgba color to rgba with new alpha', () => {
      expect(service.colorToRgbaWithAlpha('rgba(10, 20, 30, 0.8)', 0.3)).toBe(
        'rgba(10, 20, 30, 0.3)',
      );
    });

    it('should convert 6-digit hex color to rgba', () => {
      expect(service.colorToRgbaWithAlpha('#0a141e', 0.5)).toBe(
        'rgba(10, 20, 30, 0.5)',
      );
    });

    it('should convert 3-digit hex color to rgba', () => {
      expect(service.colorToRgbaWithAlpha('#fff', 1)).toBe(
        'rgba(255, 255, 255, 1)',
      );
    });

    it('should return null for unrecognized color formats', () => {
      expect(service.colorToRgbaWithAlpha('not-a-color', 0.5)).toBeNull();
    });
  });
});

// #region Test Helpers
function createMockWindowRef(
  options: {
    bodyValues?: Record<string, string>;
    docElValues?: Record<string, string>;
    measureValues?: Record<string, string>;
  } = {},
): { nativeWindow: unknown } {
  const { bodyValues = {}, docElValues = {}, measureValues = {} } = options;
  return {
    nativeWindow: {
      getComputedStyle: (el: Element) => {
        if (el === document.body) {
          return {
            getPropertyValue: (prop: string) => bodyValues[prop] ?? '',
          };
        }
        if (el === document.documentElement) {
          return {
            getPropertyValue: (prop: string) => docElValues[prop] ?? '',
          };
        }
        return {
          getPropertyValue: (prop: string) => measureValues[prop] ?? '',
        };
      },
    },
  };
}
// #endregion
