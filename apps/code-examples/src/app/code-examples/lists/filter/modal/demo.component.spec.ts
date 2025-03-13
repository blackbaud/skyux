import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyFilterButtonHarness,
  SkyFilterSummaryHarness,
} from '@skyux/lists/testing';
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

import { DemoComponent } from './demo.component';
import { Filter } from './filter';
import { FilterModalComponent } from './filter-modal.component';

describe('Filter modal demo', () => {
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
      imports: [DemoComponent, SkyModalTestingModule, NoopAnimationsModule],
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

    const modalController = TestBed.inject(SkyModalTestingController);

    await filterButtonHarness.clickFilterButton();
    fixture.detectChanges();
    await fixture.whenStable();

    const saveData: Filter[] = [
      {
        name: 'fruitType',
        value: 'citrus',
        label: 'citrus',
      },
      {
        name: 'hideOrange',
        value: true,
        label: 'hide orange fruits',
      },
    ];
    modalController.expectCount(1);
    modalController.expectOpen(FilterModalComponent);
    modalController.closeTopModal({ data: saveData, reason: 'save' });

    const filterSummaryHarness = await loader.getHarness(
      SkyFilterSummaryHarness.with({ dataSkyId: 'filter-summary' }),
    );

    let filterSummaryItemHarnesses = await filterSummaryHarness.getItems();

    expect(filterSummaryItemHarnesses.length).toBe(2);

    await filterSummaryItemHarnesses[0].dismiss();

    filterSummaryItemHarnesses = await filterSummaryHarness.getItems();

    expect(filterSummaryItemHarnesses.length).toBe(1);
  });
});
