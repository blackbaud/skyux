import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyDataManagerHarness,
  SkyDataManagerToolbarHarness,
} from '@skyux/data-manager/testing';
import { SkyFilterBarHarness } from '@skyux/filter-bar/testing';
import { SkyButtonHarness, SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyListSummaryHarness } from '@skyux/lists/testing';
import { SkySelectionModalHarness } from '@skyux/lookup/testing';
import { SkyConfirmHarness } from '@skyux/modals/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { of } from 'rxjs';

import { JOB_TITLES } from './data';
import { AgGridDataGridDataManagerExampleComponent } from './example.component';
import { ExampleService } from './example.service';

describe('Data grid with data manager example', () => {
  async function setupTest(): Promise<{
    docLoader: HarnessLoader;
    filterBarHarness: SkyFilterBarHarness;
    gridHarness: SkyAgGridWrapperHarness;
    loader: HarnessLoader;
    toolbarHarness: SkyDataManagerToolbarHarness;
  }> {
    // In a real-world application the search service would make a web request,
    // which should be avoided in unit tests.
    const mockSvc = jasmine.createSpyObj<ExampleService>('ExampleService', [
      'search',
    ]);
    mockSvc.search.and.callFake((searchText) => {
      const items = Object.values(JOB_TITLES)
        .flat()
        .filter((job) =>
          job.name.toUpperCase().includes(searchText.toUpperCase()),
        );

      return of({ hasMore: false, items, totalCount: items.length });
    });

    await TestBed.configureTestingModule({
      imports: [AgGridDataGridDataManagerExampleComponent],
      providers: [
        provideSkyAgGridTesting(),
        provideNoopSkyAnimations(),
        { provide: ExampleService, useValue: mockSvc },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataGridDataManagerExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const dataManagerHarness = await loader.getHarness(
      SkyDataManagerHarness.with({ dataSkyId: 'employees-data-manager' }),
    );
    const dataViewHarness = await dataManagerHarness.getView({
      viewId: 'dataGridWithDataManagerView',
    });
    const gridHarness = await dataViewHarness.queryHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'employees-grid' }),
    );

    // AG Grid renders outside the Angular zone, so wait for its first render
    // before inspecting the grid's cells.
    await gridHarness.waitUntilRendered();

    return {
      docLoader,
      filterBarHarness: await loader.getHarness(
        SkyFilterBarHarness.with({ dataSkyId: 'employees-filter-bar' }),
      ),
      gridHarness,
      loader,
      toolbarHarness: await dataManagerHarness.getToolbar(),
    };
  }

  async function getRecordCount(loader: HarnessLoader): Promise<string> {
    const listSummaryHarness = await loader.getHarness(
      SkyListSummaryHarness.with({ dataSkyId: 'employees-summary' }),
    );
    const [summaryItem] = await listSummaryHarness.getSummaryItems();

    return `${await summaryItem.getValueText()} ${await summaryItem.getLabelText()}`;
  }

  async function setHideSales(
    docLoader: HarnessLoader,
    filterBarHarness: SkyFilterBarHarness,
    buttonDataSkyId: 'apply-button' | 'cancel-button',
  ): Promise<void> {
    await (await filterBarHarness.getItem({ filterId: 'hideSales' })).click();
    await (
      await docLoader.getHarness(
        SkyCheckboxHarness.with({ dataSkyId: 'hide-sales-checkbox' }),
      )
    ).check();

    await (
      await docLoader.getHarness(
        SkyButtonHarness.with({ dataSkyId: buttonDataSkyId }),
      )
    ).click();
  }

  it('should render employees sorted by start date', async () => {
    const { gridHarness, loader } = await setupTest();

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
    await expectAsync(getRecordCount(loader)).toBeResolvedTo('7 Records');
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

    await (await menu.getItem({ text: 'Mark inactive' })).click();
    expect(alertSpy).toHaveBeenCalledWith(
      'Mark inactive clicked for Billy Bob',
    );
  });

  it('should search employees by name', async () => {
    const { gridHarness, loader, toolbarHarness } = await setupTest();
    const searchHarness = await toolbarHarness.getSearch();

    await gridHarness.waitUntilRendered(() => searchHarness?.enterText('JO'));

    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Emily Johnson', 'John Doe']);
    await expectAsync(getRecordCount(loader)).toBeResolvedTo('2 Records');

    await gridHarness.waitUntilRendered(() => searchHarness?.clear());

    await expectAsync(getRecordCount(loader)).toBeResolvedTo('7 Records');
  });

  it('should hide columns deselected in the column picker', async () => {
    const { gridHarness, toolbarHarness } = await setupTest();

    const columnPicker = await toolbarHarness.openColumnPicker();
    await (await columnPicker.getColumn({ titleText: 'Age' })).deselect();
    await (
      await columnPicker.getColumn({ titleText: 'Department' })
    ).deselect();
    await gridHarness.waitUntilRendered(() => columnPicker.saveAndClose());

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo(['', 'Name', 'Start date', 'End date', 'Title']);
  });

  describe('filters', () => {
    it('should hide sales employees', async () => {
      const { docLoader, filterBarHarness, gridHarness } = await setupTest();

      await gridHarness.waitUntilRendered(() =>
        setHideSales(docLoader, filterBarHarness, 'apply-button'),
      );

      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo([
        'Billy Bob',
        'Jane Deere',
        'David Smith',
        'Emily Johnson',
        'Nicole Davidson',
        'Carl Roberts',
      ]);
    });

    it('should not apply the sales filter when the modal is cancelled', async () => {
      const { docLoader, filterBarHarness, loader } = await setupTest();

      await setHideSales(docLoader, filterBarHarness, 'cancel-button');

      await expectAsync(filterBarHarness.hasActiveFilters()).toBeResolvedTo(
        false,
      );
      await expectAsync(getRecordCount(loader)).toBeResolvedTo('7 Records');
    });

    it('should filter employees by job title and clear filters', async () => {
      const { docLoader, filterBarHarness, gridHarness, loader } =
        await setupTest();

      await (await filterBarHarness.getItem({ filterId: 'jobTitle' })).click();

      const selectionModal = await docLoader.getHarness(
        SkySelectionModalHarness,
      );
      await selectionModal.enterSearchText('software engineer');
      await selectionModal.selectSearchResult({
        contentText: /^(Software|Principal Software) Engineer$/,
      });
      await gridHarness.waitUntilRendered(() => selectionModal.saveAndClose());

      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(['Jane Deere', 'Nicole Davidson']);

      await filterBarHarness.clickClearFilters();
      const confirmHarness = await docLoader.getHarness(SkyConfirmHarness);
      await gridHarness.waitUntilRendered(() =>
        confirmHarness.clickCustomButton({ text: 'Clear values' }),
      );

      await expectAsync(filterBarHarness.hasActiveFilters()).toBeResolvedTo(
        false,
      );
      await expectAsync(getRecordCount(loader)).toBeResolvedTo('7 Records');
    });
  });
});
