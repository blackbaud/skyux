import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { AgGridDataEntryGridFocusExampleComponent } from './example.component';

describe('AG Grid data entry grid focus example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<AgGridDataEntryGridFocusExampleComponent>;
    loader: HarnessLoader;
    gridHarness: SkyAgGridWrapperHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataEntryGridFocusExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataEntryGridFocusExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'focus-grid' }),
    );
    // AG Grid renders outside the Angular zone, so wait for it to finish.
    await gridHarness.waitUntilRendered();

    return { fixture, loader, gridHarness };
  }

  function getCell(
    fixture: ComponentFixture<unknown>,
    rowIndex: number,
    colId: string,
  ): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      `.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${colId}"]`,
    )!;
  }

  /**
   * Edits a cell the way a keyboard user would: focus the cell, press Enter to
   * open its editor, type a value, then press Enter to save it.
   */
  async function editCell(
    fixture: ComponentFixture<unknown>,
    rowIndex: number,
    colId: string,
    value: string,
  ): Promise<void> {
    const cell = getCell(fixture, rowIndex, colId);
    cell.focus();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const editor = document.activeElement as HTMLInputElement;
    editor.value = value;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
    editor.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should render the grid with editable columns', async () => {
    const { fixture, gridHarness } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
      'Validation currency',
      'Validation date',
    ]);

    expect(getCell(fixture, 0, 'name')).toHaveClass(
      'sky-ag-grid-cell-editable',
    );
  });

  it('should flag validation dates that are not after October 26, 1985', async () => {
    const { fixture } = await setupTest();

    await editCell(fixture, 0, 'validationDate', '01/01/1980');
    await editCell(fixture, 1, 'validationDate', '01/01/2000');

    expect(getCell(fixture, 0, 'validationDate')).toHaveClass(
      'sky-ag-grid-cell-invalid',
    );
    expect(getCell(fixture, 1, 'validationDate')).not.toHaveClass(
      'sky-ag-grid-cell-invalid',
    );
  });

  it('should flag names longer than 10 characters', async () => {
    const { fixture } = await setupTest();

    expect(getCell(fixture, 0, 'name')).not.toHaveClass(
      'sky-ag-grid-cell-invalid',
    );

    await editCell(fixture, 0, 'name', 'Billy Bob Thornton');

    expect(getCell(fixture, 0, 'name')).toHaveClass('sky-ag-grid-cell-invalid');
  });

  describe('surrounding input boxes', () => {
    it('should direct users to tab into the grid', async () => {
      const { loader } = await setupTest();

      const startInputBox = await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'focus-start-input' }),
      );
      await expectAsync(startInputBox.getLabelText()).toBeResolvedTo(
        'Start here',
      );
      await startInputBox.clickHelpInline();
      await expectAsync(startInputBox.getHelpPopoverContent()).toBeResolvedTo(
        'Then tab to the grid',
      );

      const endInputBox = await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'focus-end-input' }),
      );
      await expectAsync(endInputBox.getLabelText()).toBeResolvedTo(
        'Or start here',
      );
      await endInputBox.clickHelpInline();
      await expectAsync(endInputBox.getHelpPopoverContent()).toBeResolvedTo(
        'Then tab backwards to the grid',
      );
    });
  });

  describe('initial focus', () => {
    it('should start editing the first name cell when focus enters the grid', async () => {
      const { fixture } = await setupTest();

      expect(
        (fixture.nativeElement as HTMLElement).querySelector(
          '.ag-cell-inline-editing',
        ),
      ).toBeNull();

      // AG Grid calls `focusGridInnerElement` when its tab guard receives
      // focus, which is what happens when a user tabs into the grid.
      const tabGuard = (
        fixture.nativeElement as HTMLElement
      ).querySelector<HTMLElement>('sky-ag-grid-wrapper .ag-tab-guard-top');
      tabGuard?.focus();
      await fixture.whenStable();

      expect(getCell(fixture, 0, 'name')).toHaveClass('ag-cell-inline-editing');
      expect(document.activeElement).toBe(
        getCell(fixture, 0, 'name').querySelector('input'),
      );
    });
  });
});
