import { TestBed } from '@angular/core/testing';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryService,
  SkyUIConfigService,
} from '@skyux/core';

import { SkyCoreTestingModule } from './core-testing.module';
import { MockSkyMediaQueryService } from './mock-media-query.service';
import { MockSkyUIConfigService } from './mock-ui-config.service';

describe('Core testing module', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyCoreTestingModule],
    });
  });

  describe('MockSkyMediaQueryService', () => {
    let service: SkyMediaQueryService;

    beforeEach(() => {
      service = TestBed.inject(SkyMediaQueryService);
    });

    it('should mock the service', () => {
      expect(service instanceof MockSkyMediaQueryService).toBeTrue();
    });

    it('should subscribe to screen resizing', () => {
      expect(service.current).toEqual(SkyMediaBreakpoints.md);

      (service as MockSkyMediaQueryService).fire(SkyMediaBreakpoints.xs);

      service
        .subscribe((x) => {
          expect(x).toEqual(SkyMediaBreakpoints.xs);
        })
        .unsubscribe();

      expect(service.current).toEqual(SkyMediaBreakpoints.xs);
    });

    it('should allow setting the breakpoint', () => {
      expect(service.current).toEqual(SkyMediaBreakpoints.md);

      (service as MockSkyMediaQueryService).current = SkyMediaBreakpoints.xs;

      expect(service.current).toEqual(SkyMediaBreakpoints.xs);
    });
  });

  describe('SkyUIConfigService', () => {
    let service: SkyUIConfigService;

    beforeEach(() => {
      service = TestBed.inject(SkyUIConfigService);
    });

    it('should mock the service', () => {
      expect(service instanceof MockSkyUIConfigService).toBeTrue();
    });

    it('should return default tile config', async () => {
      const config = await service.getConfig('my-stuff').toPromise();

      expect(config).toEqual({
        settings: {
          userSettings: {
            singleColumn: {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true,
                },
                {
                  id: 'tile-2',
                  isCollapsed: true,
                },
              ],
            },
            multiColumn: [
              {
                tiles: [
                  {
                    id: 'tile-2',
                    isCollapsed: true,
                  },
                ],
              },
              {
                tiles: [
                  {
                    id: 'tile-1',
                    isCollapsed: true,
                  },
                ],
              },
            ],
          },
          defaultSettings: ['tile-1', 'tile-2'],
        },
      });
    });

    it('should return default config', async () => {
      const config = await service
        .getConfig('defaultSettings', { foo: 'bar' })
        .toPromise();

      expect(config).toEqual({ foo: 'bar' });
    });

    it('should return invalid config', async () => {
      const config = await service.getConfig('badData').toPromise();

      expect(config).toEqual({ invalidProperty: 'invalidData' });
    });
  });
});
