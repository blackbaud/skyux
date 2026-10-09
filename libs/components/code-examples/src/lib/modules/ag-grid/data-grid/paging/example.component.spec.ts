import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyPagingHarness } from '@skyux/lists/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { AgGridDataGridPagingExampleComponent } from './example.component';

describe('AG Grid data grid paging example', () => {
  async function setupTest(route?: { path: string; url: string }): Promise<{
    gridHarness: SkyAgGridWrapperHarness;
    loader: HarnessLoader;
    pagingHarness: SkyPagingHarness;
  }> {
    TestBed.configureTestingModule({
      imports: [AgGridDataGridPagingExampleComponent],
      providers: [
        provideRouter(
          route
            ? [
                {
                  path: route.path,
                  component: AgGridDataGridPagingExampleComponent,
                },
              ]
            : [],
        ),
        provideSkyAgGridTesting(),
        provideNoopSkyAnimations(),
      ],
    });

    // Route tests navigate to the example so it can read the page from the URL.
    const fixture = route
      ? (await RouterTestingHarness.create(route.url)).fixture
      : TestBed.createComponent(AgGridDataGridPagingExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'paging-grid' }),
    );
    // AG Grid renders outside the Angular zone, so wait on the harness rather than `whenStable()`.
    await gridHarness.waitUntilRendered();

    const pagingHarness = await loader.getHarness(
      SkyPagingHarness.with({ dataSkyId: 'paging-grid-paging' }),
    );

    return { gridHarness, loader, pagingHarness };
  }

  it('should render the first page of the grid', async () => {
    const { gridHarness, pagingHarness } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
    ]);
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Billy Bob', 'Jane Deere', 'David Smith']);
    await expectAsync(
      gridHarness.getDisplayedCellValues('endDate'),
    ).toBeResolvedTo(['N/A', 'N/A', '06/15/2018']);
  });

  it('should page through the grid rows', async () => {
    const { gridHarness, pagingHarness } = await setupTest();

    await pagingHarness.clickNextButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Emily Johnson', 'John Doe', 'Nicole Davidson']);

    await pagingHarness.clickPreviousButton();
    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Billy Bob', 'Jane Deere', 'David Smith']);
  });

  it('should open the page specified by the "page" query parameter', async () => {
    const { gridHarness, pagingHarness } = await setupTest({
      path: '',
      url: '/?page=3',
    });

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Carl Roberts']);
  });

  it('should open the page specified by the "page" route parameter', async () => {
    const { gridHarness, pagingHarness } = await setupTest({
      path: ':page',
      url: '/2',
    });

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(2);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Emily Johnson', 'John Doe', 'Nicole Davidson']);
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
