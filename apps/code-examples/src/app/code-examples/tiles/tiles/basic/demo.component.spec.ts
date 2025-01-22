import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyTileDashboardHarness } from '@skyux/tiles/testing';

import { DemoComponent } from './demo.component';

describe('Tile dashboard demo', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    tileDashboardHarness: SkyTileDashboardHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const tileDashboardHarness: SkyTileDashboardHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTileDashboardHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyTileDashboardHarness);

    return { tileDashboardHarness, fixture };
  }

  it('should set up the tile dashboard', async () => {
    const { tileDashboardHarness, fixture } = await setupTest();

    const tileHarness = await tileDashboardHarness.getTile({
      dataSkyId: 'tile-1',
    });

    await expectAsync(tileHarness.isExpanded).toBeResolvedTo(false);
    await tileHarness.expand();
    await expectAsync(tileHarness.isExpanded).toBeResolvedTo(true);

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
