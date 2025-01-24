import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TileDashboardHarnessTestComponent } from './fixtures/tile-dashboard-harness-test.component';
import { SkyTileDashboardHarness } from './tile-dashboard-harness';

describe('Tile dashboard test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    tileDashboardHarness: SkyTileDashboardHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [TileDashboardHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TileDashboardHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const tileDashboardHarness: SkyTileDashboardHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTileDashboardHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyTileDashboardHarness);

    return { tileDashboardHarness };
  }

  it('should get the tile dashboard and a tile by data-sky-id', async () => {
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

  it('should throw an error if no tiles are found', async () => {
    const { tileDashboardHarness } = await setupTest({
      dataSkyId: 'empty-dashboard',
    });

    await expectAsync(tileDashboardHarness.getTiles()).toBeRejectedWithError(
      'Unable to find any tiles.',
    );
  });

  it('should throw an error if no tiles are found matching criteria', async () => {
    const { tileDashboardHarness } = await setupTest({
      dataSkyId: 'basic-dashboard',
    });

    await expectAsync(
      tileDashboardHarness.getTiles({ dataSkyId: 'tile-3' }),
    ).toBeRejectedWithError(
      'Unable to find any tiles with filter(s): {"dataSkyId":"tile-3"}',
    );
  });
});
