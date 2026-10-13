import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import {
  SkyAutocompleteHarness,
  SkySearchHarness,
} from '@skyux/lookup/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { AgGridDataEntryGridInlineHelpExampleComponent } from './example.component';
import {
  clickButton,
  clickElement,
  enterValue,
  openEditModal,
  pressTab,
  startEditing,
  typeIntoEditor,
} from './spec-helpers';

describe('AG Grid data entry grid inline help example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<AgGridDataEntryGridInlineHelpExampleComponent>;
    loader: HarnessLoader;
    docLoader: HarnessLoader;
    gridHarness: SkyAgGridWrapperHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataEntryGridInlineHelpExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataEntryGridInlineHelpExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'inline-help-grid' }),
    );

    // AG Grid renders outside the Angular zone, so wait for the grid itself
    // rather than relying on `fixture.whenStable()`.
    await gridHarness.waitUntilRendered();

    return { fixture, loader, docLoader, gridHarness };
  }

  it('should render the grid', async () => {
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
    // Billy Bob, who started first, has no end date.
    const [billyBobEndDate] =
      await gridHarness.getDisplayedCellValues('endDate');
    expect(billyBobEndDate).toBe('N/A');
  });

  it('should show inline help in the column headers', async () => {
    const { loader } = await setupTest();
    const alertSpy = spyOn(window, 'alert');

    const helpButtons = await loader.getAllHarnesses(SkyHelpInlineHarness);
    await expectAsync(
      Promise.all(helpButtons.map((helpButton) => helpButton.getAriaLabel())),
    ).toBeResolvedTo([
      'Information about Name',
      'Information about Age',
      'Information about Start date',
      'Information about End date',
      'Information about Department',
      'Information about Title',
      'Information about Validation currency',
      'Information about Validation date',
    ]);

    await helpButtons[0].click();

    expect(alertSpy).toHaveBeenCalledWith('Help was clicked for Name.');
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

  it('should filter rows using the search', async () => {
    const { gridHarness, loader } = await setupTest();
    const search = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: 'grid-search' }),
    );

    await gridHarness.waitUntilRendered(async () => {
      await search.enterText('Jane');
      await search.clickSubmitButton();
    });

    await expectAsync(
      gridHarness.getDisplayedCellValues('name'),
    ).toBeResolvedTo(['Jane Deere']);

    await gridHarness.waitUntilRendered(() => search.clickClearButton());

    const names = await gridHarness.getDisplayedCellValues('name');
    expect(names.length).toBe(7);
  });

  describe('edit modal', () => {
    let alertSpy: jasmine.Spy;

    beforeEach(() => {
      alertSpy = spyOn(window, 'alert');
    });

    it('should alert when edits are canceled or the modal is closed', async () => {
      const { fixture, docLoader } = await setupTest();

      await openEditModal(docLoader);
      await clickButton(docLoader, 'cancel-button');

      expect(alertSpy).toHaveBeenCalledOnceWith('Edits canceled!');

      await openEditModal(docLoader);
      await clickElement(fixture, '.sky-modal-btn-close');

      expect(alertSpy).toHaveBeenCalledTimes(2);
    });

    it('should update the grid with saved edits', async () => {
      const { fixture, docLoader, gridHarness } = await setupTest();
      const modalGridHarness = await openEditModal(docLoader);

      // Jane Deere is the second row, sorted by start date.
      await startEditing(fixture, 1, 'department');
      const department = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await department.getControl()).setValue('Mark');
      await department.selectSearchResult({ text: 'Marketing' });
      // Tab saves the department and starts editing the job title.
      await modalGridHarness.waitUntilRendered(() => pressTab(fixture));

      // Job title options are limited to the selected department.
      const jobTitle = await docLoader.getHarness(SkyAutocompleteHarness);
      await (await jobTitle.getControl()).setValue('Manager');
      await expectAsync(jobTitle.getSearchResultsText()).toBeResolvedTo([
        'Blog Manager',
        'Events Manager',
      ]);

      await typeIntoEditor(
        fixture,
        await startEditing(fixture, 1, 'validationDate'),
        '01/01/2020',
      );

      await gridHarness.waitUntilRendered(() =>
        clickButton(docLoader, 'save-button'),
      );

      const departments =
        await gridHarness.getDisplayedCellValues('department');
      const jobTitles = await gridHarness.getDisplayedCellValues('jobTitle');
      const validationDates =
        await gridHarness.getDisplayedCellValues('validationDate');
      expect(departments[1]).toBe('Marketing');
      // Changing the department clears the job title.
      expect(jobTitles[1]).toBe('');
      expect(validationDates[1]).toBe('1/1/2020');
    });

    it('should not allow an end date before the start date', async () => {
      const { fixture, docLoader } = await setupTest();
      await openEditModal(docLoader);

      // Billy Bob started on 12/1/1994.
      const endDateEditor = await startEditing(fixture, 0, 'endDate');

      await enterValue(fixture, endDateEditor, '01/01/1990');
      expect(endDateEditor).toHaveClass('ng-invalid');

      await enterValue(fixture, endDateEditor, '01/01/2000');
      expect(endDateEditor).not.toHaveClass('ng-invalid');

      await clickButton(docLoader, 'cancel-button');
    });

    it('should keep the job title when the department does not change', async () => {
      const { fixture, docLoader } = await setupTest();
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
      const { fixture, docLoader } = await setupTest();
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
