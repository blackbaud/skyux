import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyTileDashboardHarness } from '@skyux/tiles/testing';

import { TilesBasicExampleComponent } from './example.component';

describe('Tile dashboard example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    tileDashboardHarness: SkyTileDashboardHarness;
    mediaQueryController: SkyMediaQueryTestingController;
    fixture: ComponentFixture<TilesBasicExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TilesBasicExampleComponent, NoopAnimationsModule],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();

    const mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    const fixture = TestBed.createComponent(TilesBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const tileDashboardHarness: SkyTileDashboardHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTileDashboardHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyTileDashboardHarness);

    return { tileDashboardHarness, mediaQueryController, fixture };
  }

  it('should set up the tile dashboard', async () => {
    const { tileDashboardHarness, mediaQueryController, fixture } =
      await setupTest();

    mediaQueryController.setBreakpoint('lg');

    await expectAsync(tileDashboardHarness.isMultiColumn()).toBeResolvedTo(
      true,
    );

    const tileHarness = await tileDashboardHarness.getTile({
      dataSkyId: 'tile-1',
    });

    await expectAsync(tileHarness.isExpanded()).toBeResolvedTo(false);
    await tileHarness.expand();
    await expectAsync(tileHarness.isExpanded()).toBeResolvedTo(true);

    const tile1Component = fixture.debugElement.query(By.css('div.tile1'));
    const settingsSpy = spyOn(
      tile1Component.componentInstance,
      'tileSettingsClick',
    );
    await tileHarness.clickSettingsButton();

    expect(settingsSpy).toHaveBeenCalled();

    const tileContentHarness = await tileHarness.getContent();

    const tileContentSectionHarness = await tileContentHarness.getSection({
      dataSkyId: 'section-1',
    });

    await expectAsync(
      (await tileContentSectionHarness.host()).text(),
    ).toBeResolvedTo('Section 1');
  });
});
