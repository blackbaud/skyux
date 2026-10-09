import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyCheckboxHarness } from '@skyux/forms/testing';
import {
  SkyAutocompleteHarness,
  SkySearchHarness,
} from '@skyux/lookup/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { AgGridDataEntryGridBasicExampleComponent } from './example.component';
import {
  clickButton,
  clickElement,
  enterValue,
  openEditModal,
  pressTab,
  startEditing,
  typeIntoEditor,
} from './spec-helpers';

describe('AG Grid data entry grid basic example', () => {
  async function setupTest(): Promise<{
    docLoader: HarnessLoader;
    fixture: ComponentFixture<AgGridDataEntryGridBasicExampleComponent>;
    gridHarness: SkyAgGridWrapperHarness;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataEntryGridBasicExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataEntryGridBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'employee-grid' }),
    );

    // AG Grid renders outside the Angular zone, so wait for the grid itself
    // rather than relying on `fixture.whenStable()`.
    await gridHarness.waitUntilRendered();

    return { docLoader, fixture, gridHarness, loader };
  }

  function isCellInvalid(rowIndex: number, colId: string): boolean {
    return !!document
      .querySelector(
        `[data-sky-id="employee-grid"] .ag-row[row-index="${rowIndex}"] [col-id="${colId}"]`,
      )
      ?.classList.contains('sky-ag-grid-cell-invalid');
  }

  it('should render employees sorted by start date', async () => {
    const { gridHarness } = await setupTest();

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
    ).toBeResolvedTo([
      'Billy Bob',
      'Jane Deere',
      'David Smith',
      'Emily Johnson',
      'John Doe',
      'Nicole Davidson',
      'Carl Roberts',
    ]);
    // Billy Bob has no end date.
    const [billyBobEndDate] =
      await gridHarness.getDisplayedCellValues('endDate');
    expect(billyBobEndDate).toBe('N/A');
  });

  it('should flag cells that fail validation', async () => {
    await setupTest();

    // "Billy Bob" is within the 10 character limit.
    expect(isCellInvalid(0, 'name')).toBeFalse();
    // "Nicole Davidson" exceeds the 10 character limit.
    expect(isCellInvalid(5, 'name')).toBeTrue();
    // No validation date has been entered yet.
    expect(isCellInvalid(0, 'validationDate')).toBeTrue();
  });

  it('should toggle row selection', async () => {
    const { loader } = await setupTest();

    const billyBobCheckbox = await loader.getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'row-checkbox',
        ancestor: '.ag-row[row-index="0"]',
      }),
    );
    await expectAsync(billyBobCheckbox.getLabelText()).toBeResolvedTo(
      'Select Billy Bob',
    );

    await expectAsync(billyBobCheckbox.isChecked()).toBeResolvedTo(true);

    await billyBobCheckbox.uncheck();
    await expectAsync(billyBobCheckbox.isChecked()).toBeResolvedTo(false);
  });

  it('should filter rows using the search', async () => {
    const { gridHarness, loader } = await setupTest();
    const search = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: 'employee-search' }),
    );

    await gridHarness.waitUntilRendered(async () => {
      await search.enterText('Billy');
      await search.clickSubmitButton();
    });

    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Billy Bob']);

    await gridHarness.waitUntilRendered(() => search.clickClearButton());

    const names = await gridHarness.getDisplayedCellValues('name');
    expect(names.length).toBe(7);
  });

  it('should log the selected context menu action', async () => {
    const { loader } = await setupTest();
    const consoleSpy = spyOn(console, 'error');

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

    expect(consoleSpy).toHaveBeenCalledWith(
      'Mark inactive clicked for Billy Bob',
    );
  });

  describe('edit modal', () => {
    let alertSpy: jasmine.Spy;

    beforeEach(() => {
      alertSpy = spyOn(window, 'alert');
    });

    it('should log when a row is marked inactive', async () => {
      const { docLoader, fixture } = await setupTest();
      const consoleSpy = spyOn(console, 'error');
      await openEditModal(docLoader);

      await clickElement(fixture, '[aria-label="Mark Billy Bob inactive"]');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Mark inactive action clicked for Billy Bob',
      );

      await clickButton(docLoader, 'cancel-button');
    });

    it('should save edits to the grid', async () => {
      const { docLoader, fixture, gridHarness } = await setupTest();
      await openEditModal(docLoader);

      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 0, 'name'),
        'Bobby',
      );
      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 0, 'validationDate'),
        '01/01/2020',
      );

      await gridHarness.waitUntilRendered(() =>
        clickButton(docLoader, 'save-button'),
      );

      const [billyBobName] = await gridHarness.getDisplayedCellValues('name');
      expect(billyBobName).toBe('Bobby');
      expect(isCellInvalid(0, 'validationDate')).toBeFalse();
    });

    it('should alert when edits are canceled or the modal is closed', async () => {
      const { docLoader, fixture, gridHarness } = await setupTest();

      await openEditModal(docLoader);
      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 0, 'name'),
        'Discarded',
      );
      await clickButton(docLoader, 'cancel-button');

      expect(alertSpy).toHaveBeenCalledOnceWith('Edits canceled!');
      const [billyBobName] = await gridHarness.getDisplayedCellValues('name');
      expect(billyBobName).toBe('Billy Bob');

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
      const modalGridHarness = await openEditModal(docLoader);

      await startEditing(fixture, 0, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).setValue('Sales');
      await department.selectSearchResult({ text: 'Sales' });
      // Tab saves the department and starts editing the job title.
      await modalGridHarness.waitUntilRendered(() => pressTab(fixture));

      const [billyBobJobTitle] =
        await modalGridHarness.getDisplayedCellValues('jobTitle');
      expect(billyBobJobTitle).toBe('');

      // Job title options are limited to the selected department.
      const jobTitle = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await jobTitle.getControl()).setValue('e');
      await expectAsync(jobTitle.getSearchResultsText()).toBeResolvedTo([
        'Business Development Representative',
        'Account Executive',
      ]);

      await clickButton(docLoader, 'cancel-button');
    });

    it('should keep the job title when the department does not change', async () => {
      const { docLoader, fixture } = await setupTest();
      const modalGridHarness = await openEditModal(docLoader);

      await startEditing(fixture, 0, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).setValue('Customer Support');
      await department.selectSearchResult({ text: 'Customer Support' });
      await pressTab(fixture);

      const [billyBobJobTitle] =
        await modalGridHarness.getDisplayedCellValues('jobTitle');
      expect(billyBobJobTitle).toBe('Account Manager');

      await clickButton(docLoader, 'cancel-button');
    });

    it('should not offer job titles when the department is cleared', async () => {
      const { docLoader, fixture } = await setupTest();
      const modalGridHarness = await openEditModal(docLoader);

      await startEditing(fixture, 0, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).clear();
      await modalGridHarness.waitUntilRendered(() => pressTab(fixture));

      const jobTitle = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await jobTitle.getControl()).setValue('e');
      await expectAsync(jobTitle.getSearchResultsText()).toBeResolvedTo([]);

      await clickButton(docLoader, 'cancel-button');
    });
  });
});
