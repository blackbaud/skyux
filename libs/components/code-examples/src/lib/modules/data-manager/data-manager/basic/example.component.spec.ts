import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';
import { SkyRepeaterHarness } from '@skyux/lists/testing';

import { DataManagerBasicExampleComponent } from './example.component';

describe('Data manager basic example', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    dataManagerHarness: SkyDataManagerHarness;
    fixture: ComponentFixture<DataManagerBasicExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataManagerBasicExampleComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DataManagerBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const dataManagerHarness = options?.dataSkyId
      ? await loader.getHarness(
          SkyDataManagerHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyDataManagerHarness);

    return { dataManagerHarness, fixture, loader };
  }

  it('should set up the component', async () => {
    const { dataManagerHarness, fixture } = await setupTest();

    const toolbarHarness = await dataManagerHarness.getToolbar();
    await toolbarHarness.clickSelectAll();

    const sortButtonHarness = await toolbarHarness.getSortButton();
    expect(sortButtonHarness).not.toBeNull();

    const repeaterView = await dataManagerHarness.getView({
      viewId: 'repeaterView',
    });
    const repeaterHarness = await repeaterView.queryHarness(SkyRepeaterHarness);
    const repeaterItems = await repeaterHarness.getRepeaterItems();
    expect(repeaterItems.length).toBe(4);

    for (const item of repeaterItems) {
      await expectAsync(item.isSelected()).toBeResolvedTo(true);
    }

    const viewActionsHarness = await toolbarHarness.getViewActions();
    expect(viewActionsHarness).not.toBeNull();

    const views = await viewActionsHarness?.getRadioButtons();
    await views?.[1].check();
    fixture.detectChanges();
    await fixture.whenStable();

    const filterButtonHarness = await toolbarHarness.getFilterButton();
    expect(filterButtonHarness).not.toBeNull();

    const searchHarness = await toolbarHarness.getSearch();
    expect(searchHarness).not.toBeNull();

    const columnPicker = await toolbarHarness.openColumnPicker();
    const columns = await columnPicker.getColumns();
    expect(columns.length).toBe(2);
  });
});
