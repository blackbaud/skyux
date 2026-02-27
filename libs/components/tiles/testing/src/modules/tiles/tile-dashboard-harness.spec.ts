import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { TileDashboardHarnessTestComponent } from './fixtures/tile-dashboard-harness-test.component';
import { SkyTileDashboardHarness } from './tile-dashboard-harness';

describe('Tile dashboard test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    tileDashboardHarness: SkyTileDashboardHarness;
    mediaQueryController: SkyMediaQueryTestingController;
  }> {
    await TestBed.configureTestingModule({
      imports: [TileDashboardHarnessTestComponent],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();

    const mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    const fixture = TestBed.createComponent(TileDashboardHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const tileDashboardHarness: SkyTileDashboardHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTileDashboardHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyTileDashboardHarness);

    return { tileDashboardHarness, mediaQueryController };
  }

  it('should get the tile dashboard and tile by data-sky-id', async () => {
    const { tileDashboardHarness } = await setupTest({
      dataSkyId: 'basic-dashboard',
    });

    await expectAsync(
      tileDashboardHarness.getTile({ dataSkyId: 'tile-1' }),
    ).toBeResolved();
  });

  it('should get an array of all tiles', async () => {
    const { tileDashboardHarness } = await setupTest({
      dataSkyId: 'basic-dashboard',
    });

    const items = await tileDashboardHarness.getTiles();

    expect(items.length).toBe(2);
  });

  it('should get an array of tiles based on criteria', async () => {
    const { tileDashboardHarness } = await setupTest({
      dataSkyId: 'basic-dashboard',
    });

    const items = await tileDashboardHarness.getTiles({
      titleText: 'Tile 1',
    });

    expect(items.length).toBe(1);
  });

  it('should return an empty array if no tiles are found', async () => {
    const { tileDashboardHarness } = await setupTest({
      dataSkyId: 'empty-dashboard',
    });

    await expectAsync(tileDashboardHarness.getTiles()).toBeResolvedTo([]);
  });

  it('should indicate if the dashboard is multi-column or not', async () => {
    const { tileDashboardHarness, mediaQueryController } = await setupTest({
      dataSkyId: 'basic-dashboard',
    });

    mediaQueryController.setBreakpoint('xs');
    await expectAsync(tileDashboardHarness.isMultiColumn()).toBeResolvedTo(
      false,
    );

    mediaQueryController.setBreakpoint('lg');
    await expectAsync(tileDashboardHarness.isMultiColumn()).toBeResolvedTo(
      true,
    );
  });
});
