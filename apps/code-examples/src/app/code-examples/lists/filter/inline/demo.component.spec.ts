import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import {
  SkyFilterButtonHarness,
  SkyFilterInlineHarness,
} from '@skyux/lists/testing';

import { DemoComponent } from './demo.component';

describe('Filter inline demo', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    filterButtonHarness: SkyFilterButtonHarness;
    fixture: ComponentFixture<DemoComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const filterButtonHarness: SkyFilterButtonHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFilterButtonHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyFilterButtonHarness);

    return { filterButtonHarness, fixture, loader };
  }

  it('should set up the component', async () => {
    const { filterButtonHarness, fixture, loader } = await setupTest({
      dataSkyId: 'my-filter-button',
    });

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterInlineHarness = await loader.getHarness(
      SkyFilterInlineHarness.with({ dataSkyId: 'filter-inline' }),
    );

    const itemHarness = await filterInlineHarness.getItem({
      dataSkyId: 'hide-orange-filter',
    });
    const orangeCheck = await itemHarness.queryHarness(SkyCheckboxHarness);
    await orangeCheck.check();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(filterButtonHarness.isActive()).toBeResolvedTo(true);
  });
});
