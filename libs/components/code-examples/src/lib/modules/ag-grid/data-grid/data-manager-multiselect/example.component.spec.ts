import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataManagerService } from '@skyux/data-manager';
import {
  SkyDataManagerHarness,
  SkyDataManagerToolbarHarness,
  SkyDataViewHarness,
} from '@skyux/data-manager/testing';
import { SkyFilterBarHarness } from '@skyux/filter-bar/testing';
import { SkyButtonHarness, SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyListSummaryHarness } from '@skyux/lists/testing';
import { SkySelectionModalHarness } from '@skyux/lookup/testing';
import { SkyConfirmHarness } from '@skyux/modals/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { firstValueFrom, of } from 'rxjs';

import { AG_GRID_DEMO_DATA, JOB_TITLES } from './data';
import { AgGridDataGridDataManagerMultiselectExampleComponent } from './example.component';
import { ExampleService } from './example.service';

const EMILY_ID = '09b7da69-0272-4fe0-ace3-658a6d8f175c';
const JANE_ID = 'aea50a38-aa1e-44e0-94b5-52d3f577767f';

describe('AG Grid data manager multiselect example', () => {
  async function setupTest(): Promise<{
    dataViewHarness: SkyDataViewHarness;
    docLoader: HarnessLoader;
    filterBarHarness: SkyFilterBarHarness;
    fixture: ComponentFixture<AgGridDataGridDataManagerMultiselectExampleComponent>;
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
      imports: [AgGridDataGridDataManagerMultiselectExampleComponent],
      providers: [
        provideSkyAgGridTesting(),
        provideNoopSkyAnimations(),
        { provide: ExampleService, useValue: mockSvc },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataGridDataManagerMultiselectExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const dataManagerHarness = await loader.getHarness(
      SkyDataManagerHarness.with({ dataSkyId: 'employees-data-manager' }),
    );
    const dataViewHarness = await dataManagerHarness.getView({
      viewId: 'dataGridMultiselectWithDataManagerView',
    });
    const gridHarness = await dataViewHarness.queryHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'employees-grid' }),
    );

    // AG Grid renders outside the Angular zone, so `whenStable()` doesn't
    // wait for it.
    await gridHarness.waitUntilRendered();

    return {
      dataViewHarness,
      docLoader,
      filterBarHarness: await loader.getHarness(
        SkyFilterBarHarness.with({ dataSkyId: 'employees-filter-bar' }),
      ),
      fixture,
      gridHarness,
      loader,
      toolbarHarness: await dataManagerHarness.getToolbar(),
    };
  }

  async function getRecordCount(loader: HarnessLoader): Promise<string> {
    const summaryHarness = await loader.getHarness(
      SkyListSummaryHarness.with({ dataSkyId: 'employees-summary' }),
    );
    const [summaryItem] = await summaryHarness.getSummaryItems();

    return `${await summaryItem.getValueText()} ${await summaryItem.getLabelText()}`;
  }

  async function getSelectedIds(
    fixture: ComponentFixture<unknown>,
  ): Promise<string[] | undefined> {
    const dataState = await firstValueFrom(
      fixture.debugElement.injector
        .get(SkyDataManagerService)
        .getDataStateUpdates('spec'),
    );

    return dataState.selectedIds;
  }

  async function getRowSelector(
    dataViewHarness: SkyDataViewHarness,
    rowIndex: number,
  ): Promise<SkyCheckboxHarness> {
    return await dataViewHarness.queryHarness(
      SkyCheckboxHarness.with({
        selector: `.ag-row[row-index="${rowIndex}"] sky-checkbox`,
      }),
    );
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

    await (await menu.getItem({ text: 'More info' })).click();
    expect(alertSpy).toHaveBeenCalledWith('More info clicked for Billy Bob');
  });

  describe('multiselect', () => {
    it('should sync row selection with the data manager state', async () => {
      const { dataViewHarness, fixture } = await setupTest();
      const janeSelector = await getRowSelector(dataViewHarness, 1);
      const emilySelector = await getRowSelector(dataViewHarness, 3);

      await expectAsync(emilySelector.isChecked()).toBeResolvedTo(true);
      await expectAsync(getSelectedIds(fixture)).toBeResolvedTo([EMILY_ID]);

      await janeSelector.check();
      await emilySelector.uncheck();

      await expectAsync(getSelectedIds(fixture)).toBeResolvedTo([JANE_ID]);
    });

    it('should select and clear all rows from the toolbar', async () => {
      const { fixture, toolbarHarness } = await setupTest();

      await toolbarHarness.clickSelectAll();

      await expectAsync(getSelectedIds(fixture)).toBeResolvedTo(
        jasmine.arrayWithExactContents(AG_GRID_DEMO_DATA.map((d) => d.id)),
      );

      await toolbarHarness.clickClearAll();

      await expectAsync(getSelectedIds(fixture)).toBeResolvedTo([]);
    });

    it('should only show selected rows', async () => {
      const { dataViewHarness, gridHarness, toolbarHarness } =
        await setupTest();

      await (await getRowSelector(dataViewHarness, 1)).check();

      const onlyShowSelected = await toolbarHarness.getOnlyShowSelected();
      await gridHarness.waitUntilRendered(() => onlyShowSelected?.check());

      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(['Jane Deere', 'Emily Johnson']);
    });
  });

  it('should search employees by name', async () => {
    const { gridHarness, loader, toolbarHarness } = await setupTest();
    const searchHarness = await toolbarHarness.getSearch();

    await gridHarness.waitUntilRendered(() => searchHarness?.enterText('JO'));

    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Emily Johnson', 'John Doe']);

    await gridHarness.waitUntilRendered(() => searchHarness?.clear());

    await expectAsync(getRecordCount(loader)).toBeResolvedTo('7 Records');
  });

  it('should hide columns deselected in the column picker', async () => {
    const { gridHarness, toolbarHarness } = await setupTest();

    const columnPicker = await toolbarHarness.openColumnPicker();
    await (await columnPicker.getColumn({ titleText: 'Age' })).deselect();
    await (await columnPicker.getColumn({ titleText: 'Title' })).deselect();
    await gridHarness.waitUntilRendered(() => columnPicker.saveAndClose());

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo(['', '', 'Name', 'Start date', 'End date', 'Department']);
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
