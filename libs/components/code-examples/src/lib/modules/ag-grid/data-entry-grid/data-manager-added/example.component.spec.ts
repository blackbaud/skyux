import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';
import { SkyFilterBarHarness } from '@skyux/filter-bar/testing';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import { SkyListSummaryHarness } from '@skyux/lists/testing';
import {
  SkyAutocompleteHarness,
  SkySelectionModalHarness,
} from '@skyux/lookup/testing';
import { SkyConfirmHarness } from '@skyux/modals/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { of } from 'rxjs';

import { JOB_TITLES } from './data';
import { AgGridDataEntryGridDataManagerAddedExampleComponent } from './example.component';
import { ExampleService } from './example.service';
import {
  clickButton,
  clickElement,
  enterValue,
  openEditModal,
  pressTab,
  startEditing,
  typeIntoEditor,
} from './spec-helpers';

describe('AG Grid data entry grid data manager example', () => {
  // The grid sorts rows by start date by default.
  const DEFAULT_ORDER = [
    'Billy Bob',
    'Jane Deere',
    'David Smith',
    'Emily Johnson',
    'John Doe',
    'Nicole Davidson',
    'Carl Roberts',
  ];

  async function setupTest(): Promise<{
    fixture: ComponentFixture<AgGridDataEntryGridDataManagerAddedExampleComponent>;
    loader: HarnessLoader;
    docLoader: HarnessLoader;
    dataManagerHarness: SkyDataManagerHarness;
    gridHarness: SkyAgGridWrapperHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataEntryGridDataManagerAddedExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataEntryGridDataManagerAddedExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();

    const dataManagerHarness = await loader.getHarness(
      SkyDataManagerHarness.with({ dataSkyId: 'employees-data-manager' }),
    );
    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'employees-grid' }),
    );

    // AG Grid renders outside the Angular zone, so wait for the grid itself
    // rather than relying on `fixture.whenStable()`.
    await gridHarness.waitUntilRendered();

    return { fixture, loader, docLoader, dataManagerHarness, gridHarness };
  }

  async function getFilterBar(
    loader: HarnessLoader,
  ): Promise<SkyFilterBarHarness> {
    return await loader.getHarness(
      SkyFilterBarHarness.with({ dataSkyId: 'employees-filter-bar' }),
    );
  }

  it('should render employees sorted by start date with a record count', async () => {
    const { gridHarness, loader } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
      'Context menu',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
      'Validation currency',
      'Validation date',
    ]);
    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(DEFAULT_ORDER);
    // Billy Bob has no end date.
    const [billyBobEndDate] =
      await gridHarness.getDisplayedCellValues('endDate');
    expect(billyBobEndDate).toBe('N/A');

    const listSummary = await loader.getHarness(
      SkyListSummaryHarness.with({ dataSkyId: 'employees-list-summary' }),
    );
    const [recordCount] = await listSummary.getSummaryItems();
    await expectAsync(recordCount.getValueText()).toBeResolvedTo('7');
    await expectAsync(recordCount.getLabelText()).toBeResolvedTo('Records');
  });

  it('should alert the selected context menu action', async () => {
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

  describe('data manager toolbar', () => {
    it('should search rows by name', async () => {
      const { dataManagerHarness, gridHarness } = await setupTest();
      const search = await (await dataManagerHarness.getToolbar()).getSearch();

      await gridHarness.waitUntilRendered(async () => {
        await search?.enterText('john');
        await search?.clickSubmitButton();
      });

      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(['Emily Johnson', 'John Doe']);

      await gridHarness.waitUntilRendered(async () => {
        await search?.clickClearButton();
      });

      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(DEFAULT_ORDER);
    });

    it('should show and hide columns using the column picker', async () => {
      const { dataManagerHarness, gridHarness } = await setupTest();
      const columnPicker = await (
        await dataManagerHarness.getToolbar()
      ).openColumnPicker();

      await columnPicker.clearAll();
      await columnPicker.selectColumns({ titleText: 'Name' });
      await gridHarness.waitUntilRendered(() => columnPicker.saveAndClose());

      // Columns that are always displayed are not listed in the column picker.
      await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
        'selected',
        'context',
        'name',
      ]);
    });
  });

  describe('filter bar', () => {
    it('should hide sales employees', async () => {
      const { docLoader, gridHarness, loader } = await setupTest();
      const filterBar = await getFilterBar(loader);

      await (await filterBar.getItem({ filterId: 'hideSales' })).click();
      await (
        await docLoader.getHarness(
          SkyCheckboxHarness.with({ dataSkyId: 'hide-sales-checkbox' }),
        )
      ).check();
      await gridHarness.waitUntilRendered(() =>
        clickButton(docLoader, 'apply-button'),
      );

      await expectAsync(filterBar.hasActiveFilters()).toBeResolvedTo(true);
      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(DEFAULT_ORDER.filter((name) => name !== 'John Doe'));
    });

    it('should not change the filter when the sales modal is canceled', async () => {
      const { docLoader, loader } = await setupTest();
      const filterBar = await getFilterBar(loader);

      await (await filterBar.getItem({ filterId: 'hideSales' })).click();
      await (
        await docLoader.getHarness(
          SkyCheckboxHarness.with({ dataSkyId: 'hide-sales-checkbox' }),
        )
      ).check();
      await clickButton(docLoader, 'cancel-button');

      await expectAsync(filterBar.hasActiveFilters()).toBeResolvedTo(false);
    });

    it('should filter by job title and clear the filters', async () => {
      const { docLoader, gridHarness, loader } = await setupTest();

      // Avoid the service's simulated network latency. A real-world service
      // would make a web request, which should be avoided in unit tests.
      spyOn(TestBed.inject(ExampleService), 'search').and.callFake(
        (searchText) => {
          const items = Object.values(JOB_TITLES)
            .flat()
            .filter((job) =>
              job.name.toLowerCase().includes(searchText.toLowerCase()),
            );

          return of({ hasMore: false, items, totalCount: items.length });
        },
      );

      const filterBar = await getFilterBar(loader);
      await (await filterBar.getItem({ filterId: 'jobTitle' })).click();

      const selectionModal = await docLoader.getHarness(
        SkySelectionModalHarness,
      );
      await selectionModal.enterSearchText('software engineer');
      await selectionModal.selectSearchResult({
        contentText: 'Principal Software Engineer',
      });
      await selectionModal.selectSearchResult({
        contentText: 'Software Engineer',
      });
      await gridHarness.waitUntilRendered(() => selectionModal.saveAndClose());

      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(['Jane Deere', 'Nicole Davidson']);

      await filterBar.clickClearFilters();
      const confirm = await docLoader.getHarness(SkyConfirmHarness);
      await gridHarness.waitUntilRendered(() =>
        confirm.clickCustomButton({ text: 'Clear values' }),
      );

      await expectAsync(filterBar.hasActiveFilters()).toBeResolvedTo(false);
      await expectAsync(
        gridHarness.getDisplayedCellValues('name'),
      ).toBeResolvedTo(DEFAULT_ORDER);
    });
  });

  describe('edit modal', () => {
    let alertSpy: jasmine.Spy;

    beforeEach(() => {
      alertSpy = spyOn(window, 'alert');
    });

    it('should update the grid when edits are saved', async () => {
      const { docLoader, fixture, gridHarness } = await setupTest();
      await openEditModal(docLoader);

      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 0, 'age'),
        '56',
      );
      await gridHarness.waitUntilRendered(() =>
        clickButton(docLoader, 'save-button'),
      );

      const [billyBobAge] = await gridHarness.getDisplayedCellValues('age');
      expect(billyBobAge).toBe('56');
    });

    it('should alert when edits are canceled or the modal is closed', async () => {
      const { docLoader, fixture } = await setupTest();

      await openEditModal(docLoader);
      await clickButton(docLoader, 'cancel-button');

      expect(alertSpy).toHaveBeenCalledOnceWith('Edits canceled!');

      await openEditModal(docLoader);
      await clickElement(fixture, '.sky-modal-btn-close');

      expect(alertSpy).toHaveBeenCalledTimes(2);
    });

    it('should not allow an end date before the start date', async () => {
      const { docLoader, fixture } = await setupTest();
      await openEditModal(docLoader);

      // Billy Bob started on 12/1/1994.
      const endDateEditor = await startEditing(fixture, 0, 'endDate');

      await enterValue(fixture, endDateEditor, '01/01/1990');
      expect(endDateEditor).toHaveClass('ng-invalid');

      await enterValue(fixture, endDateEditor, '01/01/2000');
      expect(endDateEditor).not.toHaveClass('ng-invalid');

      await clickButton(docLoader, 'cancel-button');
    });

    it('should clear the job title when the department changes', async () => {
      const { docLoader, fixture } = await setupTest();
      const editGrid = await openEditModal(docLoader);

      await startEditing(fixture, 0, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).setValue('Sales');
      await department.selectSearchResult({ text: 'Sales' });
      // Tab saves the department and starts editing the job title.
      await editGrid.waitUntilRendered(() => pressTab(fixture));

      const [billyBobJobTitle] =
        await editGrid.getDisplayedCellValues('jobTitle');
      expect(billyBobJobTitle).toBe('');

      // Job title options are limited to the selected department.
      const jobTitle = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await jobTitle.getControl()).setValue('e');
      await expectAsync(jobTitle.getSearchResultsText()).toBeResolvedTo(
        JOB_TITLES['Sales'].map((title) => title.name),
      );

      await clickButton(docLoader, 'cancel-button');
    });

    it('should keep the job title when the department does not change', async () => {
      const { docLoader, fixture } = await setupTest();
      const editGrid = await openEditModal(docLoader);

      await startEditing(fixture, 0, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).setValue('Customer Support');
      await department.selectSearchResult({ text: 'Customer Support' });
      await pressTab(fixture);

      const [billyBobJobTitle] =
        await editGrid.getDisplayedCellValues('jobTitle');
      expect(billyBobJobTitle).toBe('Account Manager');

      await clickButton(docLoader, 'cancel-button');
    });

    it('should not offer job titles when the department is cleared', async () => {
      const { docLoader, fixture } = await setupTest();
      const editGrid = await openEditModal(docLoader);

      await startEditing(fixture, 0, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).clear();
      await editGrid.waitUntilRendered(() => pressTab(fixture));

      const jobTitle = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await jobTitle.getControl()).setValue('e');
      await expectAsync(jobTitle.getSearchResultsText()).toBeResolvedTo([]);

      await clickButton(docLoader, 'cancel-button');
    });

    it('should flag validation dates that are not in the future', async () => {
      const { docLoader, fixture, gridHarness } = await setupTest();
      await openEditModal(docLoader);

      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 0, 'validationDate'),
        '01/01/1980',
      );
      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 1, 'validationDate'),
        '01/01/2020',
      );
      await gridHarness.waitUntilRendered(() =>
        clickButton(docLoader, 'save-button'),
      );

      const getValidationDateCell = (rowIndex: number): Element | null =>
        (fixture.nativeElement as HTMLElement).querySelector(
          `.ag-row[row-index="${rowIndex}"] [col-id="validationDate"]`,
        );
      expect(getValidationDateCell(0)).toHaveClass('sky-ag-grid-cell-invalid');
      expect(getValidationDateCell(1)).not.toHaveClass(
        'sky-ag-grid-cell-invalid',
      );
    });
  });
});
