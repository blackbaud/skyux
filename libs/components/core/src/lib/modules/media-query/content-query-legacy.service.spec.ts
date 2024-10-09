import { TestBed, inject } from '@angular/core/testing';

import { SkyContentQueryLegacyService } from './content-query-legacy.service';
import { SkyMediaBreakpoints } from './media-breakpoints';

describe('Legacy content query service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyContentQueryLegacyService],
    });
  });

  describe('initialization test', () => {
    it('should handle initialization properly', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        let result: SkyMediaBreakpoints | undefined;

        const subscription = mediaQueryService.subscribe(
          (args: SkyMediaBreakpoints) => {
            result = args;
          },
        );

        expect(result).toBeUndefined();
        mediaQueryService.setBreakpointForWidth(20);

        expect(result).toBe(SkyMediaBreakpoints.xs);

        subscription.unsubscribe();
        mediaQueryService.destroy();
      },
    ));
  });

  describe('query tests', () => {
    it('should complete the subscription on destroy', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        const subscription = mediaQueryService.subscribe(() => {});

        mediaQueryService.destroy();

        expect(subscription.closed).toBe(true);
      },
    ));

    it('should update the breakpoint correctly when setBreakPoint is called', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        let result: SkyMediaBreakpoints | undefined;

        const subscription = mediaQueryService.subscribe(
          (args: SkyMediaBreakpoints) => {
            result = args;
          },
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
      },
    ));

    it('should provide the ability to check the current breakpoints', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        mediaQueryService.setBreakpointForWidth(900);

        expect(mediaQueryService.current).toEqual(SkyMediaBreakpoints.sm);
        mediaQueryService.destroy();
      },
    ));
  });

  describe('width checks', () => {
    it('should return true from isWidthXs when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            767,
            SkyMediaBreakpoints.xs,
          ),
        ).toBeTruthy();

        mediaQueryService.destroy();
      },
    ));

    it('should return false from isWidthXs when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            768,
            SkyMediaBreakpoints.xs,
          ),
        ).toBeFalsy();

        mediaQueryService.destroy();
      },
    ));

    it('should return true from isWidthSm when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            768,
            SkyMediaBreakpoints.sm,
          ),
        ).toBeTruthy();
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            991,
            SkyMediaBreakpoints.sm,
          ),
        ).toBeTruthy();

        mediaQueryService.destroy();
      },
    ));

    it('should return false from isWidthSm when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            767,
            SkyMediaBreakpoints.sm,
          ),
        ).toBeFalsy();
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            992,
            SkyMediaBreakpoints.sm,
          ),
        ).toBeFalsy();

        mediaQueryService.destroy();
      },
    ));

    it('should return true from isWidthMd when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            992,
            SkyMediaBreakpoints.md,
          ),
        ).toBeTruthy();
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            1199,
            SkyMediaBreakpoints.md,
          ),
        ).toBeTruthy();

        mediaQueryService.destroy();
      },
    ));

    it('should return false from isWidthMd when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            991,
            SkyMediaBreakpoints.md,
          ),
        ).toBeFalsy();
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            1200,
            SkyMediaBreakpoints.md,
          ),
        ).toBeFalsy();

        mediaQueryService.destroy();
      },
    ));

    it('should return true from isWidthLg when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            1200,
            SkyMediaBreakpoints.lg,
          ),
        ).toBeTruthy();
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            2000,
            SkyMediaBreakpoints.lg,
          ),
        ).toBeTruthy();

        mediaQueryService.destroy();
      },
    ));

    it('should return false from isWidthLg when appropriate', inject(
      [SkyContentQueryLegacyService],
      (mediaQueryService: SkyContentQueryLegacyService) => {
        expect(
          mediaQueryService.isWidthWithinBreakpoint(
            1199,
            SkyMediaBreakpoints.lg,
          ),
        ).toBeFalsy();

        mediaQueryService.destroy();
      },
    ));
  });
});
