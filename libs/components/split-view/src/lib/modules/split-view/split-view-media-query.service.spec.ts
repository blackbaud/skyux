import { TestBed, inject } from '@angular/core/testing';
import { SkyMediaBreakpoints } from '@skyux/core';

import { SkySplitViewMediaQueryService } from './split-view-media-query.service';

describe('Split view media query service', () => {
  let mediaQueryService!: SkySplitViewMediaQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkySplitViewMediaQueryService],
    });

    mediaQueryService = TestBed.inject(SkySplitViewMediaQueryService);
  });

  afterEach(() => {
    mediaQueryService.destroy();
  });

  describe('initialization test', () => {
    it('should handle initialization properly', () => {
      let result!: SkyMediaBreakpoints;

      const subscription = mediaQueryService.subscribe(
        (args: SkyMediaBreakpoints) => {
          result = args;
        }
      );

      expect(result).toEqual(SkyMediaBreakpoints.xs);

      subscription.unsubscribe();
      mediaQueryService.destroy();
    });
  });

  describe('query tests', () => {
    it('should complete the subscription on destroy', () => {
      const subscription = mediaQueryService.subscribe(() => {
        return;
      });

      mediaQueryService.destroy();

      expect(subscription.closed).toBe(true);
    });

    it('should update the breakpoint correctly when setBreakPoint is called', () => {
      let result!: SkyMediaBreakpoints;

      const subscription = mediaQueryService.subscribe(
        (args: SkyMediaBreakpoints) => {
          result = args;
        }
      );

      mediaQueryService.setBreakpointForWidth(300);

      expect(result).toEqual(SkyMediaBreakpoints.xs);

      mediaQueryService.setBreakpointForWidth(900);

      expect(result).toEqual(SkyMediaBreakpoints.sm);

      mediaQueryService.setBreakpointForWidth(1100);

      expect(result).toEqual(SkyMediaBreakpoints.md);

      mediaQueryService.setBreakpointForWidth(1400);

      expect(result).toEqual(SkyMediaBreakpoints.lg);

      subscription.unsubscribe();
      mediaQueryService.destroy();
    });

    it('should provide the ability to check the current breakpoints', () => {
      mediaQueryService.setBreakpointForWidth(900);

      expect(mediaQueryService.current).toEqual(SkyMediaBreakpoints.sm);
      mediaQueryService.destroy();
    });
  });

  describe('width checks', () => {
    it('should return false if width is undefined', inject(
      [SkySplitViewMediaQueryService],
      (mediaQueryService: SkySplitViewMediaQueryService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            undefined,
            SkyMediaBreakpoints.xs
          )
        ).toBeFalse();

        mediaQueryService.destroy();
      }
    ));

    it('should return true from isWidthXs when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(767, SkyMediaBreakpoints.xs)
      ).toBeTruthy();

      mediaQueryService.destroy();
    });

    it('should return false from isWidthXs when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(768, SkyMediaBreakpoints.xs)
      ).toBeFalsy();

      mediaQueryService.destroy();
    });

    it('should return true from isWidthSm when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(768, SkyMediaBreakpoints.sm)
      ).toBeTruthy();
      expect(
        mediaQueryService.isWidthWithinBreakpoint(991, SkyMediaBreakpoints.sm)
      ).toBeTruthy();

      mediaQueryService.destroy();
    });

    it('should return false from isWidthSm when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(767, SkyMediaBreakpoints.sm)
      ).toBeFalsy();
      expect(
        mediaQueryService.isWidthWithinBreakpoint(992, SkyMediaBreakpoints.sm)
      ).toBeFalsy();

      mediaQueryService.destroy();
    });

    it('should return true from isWidthMd when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(992, SkyMediaBreakpoints.md)
      ).toBeTruthy();
      expect(
        mediaQueryService.isWidthWithinBreakpoint(1199, SkyMediaBreakpoints.md)
      ).toBeTruthy();

      mediaQueryService.destroy();
    });

    it('should return false from isWidthMd when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(991, SkyMediaBreakpoints.md)
      ).toBeFalsy();
      expect(
        mediaQueryService.isWidthWithinBreakpoint(1200, SkyMediaBreakpoints.md)
      ).toBeFalsy();

      mediaQueryService.destroy();
    });

    it('should return true from isWidthLg when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(1200, SkyMediaBreakpoints.lg)
      ).toBeTruthy();
      expect(
        mediaQueryService.isWidthWithinBreakpoint(2000, SkyMediaBreakpoints.lg)
      ).toBeTruthy();

      mediaQueryService.destroy();
    });

    it('should return false from isWidthLg when appropriate', () => {
      expect(
        mediaQueryService.isWidthWithinBreakpoint(1199, SkyMediaBreakpoints.lg)
      ).toBeFalsy();

      mediaQueryService.destroy();
    });
  });
});
