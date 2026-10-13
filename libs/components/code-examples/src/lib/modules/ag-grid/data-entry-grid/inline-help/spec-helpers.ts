import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture } from '@angular/core/testing';
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
}

export async function clickButton(
  docLoader: HarnessLoader,
  dataSkyId: string,
): Promise<void> {
  const button = await docLoader.getHarness(
    SkyButtonHarness.with({ dataSkyId }),
  );
  await button.click();
}

export async function openEditModal(
  docLoader: HarnessLoader,
): Promise<SkyAgGridWrapperHarness> {
  await clickButton(docLoader, 'edit-button');

  const modalGridHarness = await docLoader.getHarness(
    SkyAgGridWrapperHarness.with({ dataSkyId: 'edit-modal-grid' }),
  );
  await modalGridHarness.waitUntilRendered();

  return modalGridHarness;
}

/**
 * Starts editing a modal grid cell the way a keyboard user would, by focusing
 * the cell and pressing Enter, and returns the editor's input.
 */
export async function startEditing(
  fixture: ComponentFixture<unknown>,
  rowIndex: number,
  colId: string,
): Promise<HTMLInputElement> {
  const cell = document.querySelector<HTMLElement>(
    `[data-sky-id="edit-modal-grid"] .ag-row[row-index="${rowIndex}"] [col-id="${colId}"]`,
  )!;
  cell.focus();
  cell.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );
  await settle(fixture);

  return document.activeElement as HTMLInputElement;
}

export async function enterValue(
  fixture: ComponentFixture<unknown>,
  editor: HTMLInputElement,
  value: string,
): Promise<void> {
  editor.value = value;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  editor.dispatchEvent(new Event('change', { bubbles: true }));
  await settle(fixture);
}

/**
 * Types a value into a cell editor and presses Enter to save it.
 */
export async function typeIntoEditor(
  fixture: ComponentFixture<unknown>,
  editor: HTMLInputElement,
  value: string,
): Promise<void> {
  await enterValue(fixture, editor, value);
  editor.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );
  await settle(fixture);
}

export async function pressTab(
  fixture: ComponentFixture<unknown>,
): Promise<void> {
  document.activeElement?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
  );
  await settle(fixture);
}

/**
 * Clicks an element that has no harness, such as the modal's close button.
 */
export async function clickElement(
  fixture: ComponentFixture<unknown>,
  selector: string,
): Promise<void> {
  document.querySelector<HTMLElement>(selector)?.click();
  await settle(fixture);
}
