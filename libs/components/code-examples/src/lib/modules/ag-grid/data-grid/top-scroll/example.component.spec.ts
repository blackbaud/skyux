import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkySearchHarness } from '@skyux/lookup/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { AgGridDataGridTopScrollExampleComponent } from './example.component';

describe('AG Grid data grid top scroll example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<AgGridDataGridTopScrollExampleComponent>;
    loader: HarnessLoader;
    gridHarness: SkyAgGridWrapperHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataGridTopScrollExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataGridTopScrollExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'top-scroll-grid' }),
    );
    // AG Grid renders outside the Angular zone, so wait for it to finish.
    await gridHarness.waitUntilRendered();

    return { fixture, loader, gridHarness };
  }

  it('should render the grid sorted by start date', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
      '',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
    ]);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo([
      'Billy Bob',
      'Jane Deere',
      'David Smith',
      'Emily Johnson',
      'John Doe',
      'Nicole Davidson',
      'Carl Roberts',
    ]);
  });

  it('should show a scrollbar at the top of the grid', async () => {
    const { fixture } = await setupTest();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-sky-id="top-scroll-grid"] .sky-ag-grid',
      ),
    ).toHaveClass('sky-ag-grid-top-scrollbar');
  });

  it('should filter rows when a search is applied and restore them when cleared', async () => {
    const { loader, gridHarness } = await setupTest();
    const searchHarness = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: 'top-scroll-search' }),
    );

    await gridHarness.waitUntilRendered(() => searchHarness.enterText('son'));

    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Emily Johnson', 'Nicole Davidson']);

    await gridHarness.waitUntilRendered(() => searchHarness.clickClearButton());

    expect((await gridHarness.getDisplayedCellValues('name')).length).toBe(7);
  });

  it('should show a message when no rows match the search', async () => {
    const { fixture, gridHarness, loader } = await setupTest();
    const searchHarness = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: 'top-scroll-search' }),
    );

    await gridHarness.waitUntilRendered(() => searchHarness.enterText('xyz'));

    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo([]);
    // The no-rows overlay has no harness, so check its text directly.
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('.ag-overlay')
        ?.textContent?.trim(),
    ).toBe('No results found.');
  });

  it('should alert when a context menu action is clicked', async () => {
    const { loader } = await setupTest();
    const alertSpy = spyOn(window, 'alert');

    const contextMenu = await loader.getHarness(
      SkyDropdownHarness.with({
        selector: '.ag-row[row-index="0"] sky-dropdown',
      }),
    );
    await contextMenu.clickDropdownButton();

    const menu = await contextMenu.getDropdownMenu();
    const items = await menu.getItems();
    await expectAsync(
      Promise.all(items.map((item) => item.getText())),
    ).toBeResolvedTo(['Delete', 'Mark inactive', 'More info']);

    await (await menu.getItem({ text: 'Delete' })).click();

    expect(alertSpy).toHaveBeenCalledWith('Delete clicked for Billy Bob');
  });
});
