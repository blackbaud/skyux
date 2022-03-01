import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyListViewGridFixtureCell } from './list-view-grid-fixture-cell';
import { SkyListViewGridFixtureHeader } from './list-view-grid-fixture-header';
import { SkyListViewGridFixtureRow } from './list-view-grid-fixture-row';

/**
 * Allows interaction with a SKY UX list view grid component.
 */
export class SkyListViewGridFixture {
  private debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-list-view-grid'
    );
  }

  /**
   * Gets the row at the specified index.
   * @param index The row's index.
   */
  public getRow(index: number): SkyListViewGridFixtureRow {
    const rowEl = this.getRowEl(index);
    const cellEls = this.getCellEls(rowEl);

    const rowCells: SkyListViewGridFixtureCell[] = cellEls.map(
      (cellEl: DebugElement) => {
        return {
          el: cellEl,
          textContent: SkyAppTestUtility.getText(cellEl),
        };
      }
    );

    return {
      cells: rowCells,
    };
  }

  public getRowCount(): number {
    return this.getRowEls().length;
  }

  /**
   * Gets the header at the specified index.
   * @param columnIndex The index of the column to which the header belongs.
   */
  public getHeader(columnIndex: number): SkyListViewGridFixtureHeader {
    const headerEls = this.getHeaderEls();

    const headerEl = headerEls[columnIndex];

    if (!headerEl) {
      throw new Error(`No column exists at index ${columnIndex}.`);
    }

    return {
      locked: headerEl.nativeElement.classList.contains(
        'sky-grid-header-locked'
      ),
      textContent: SkyAppTestUtility.getText(headerEl),
    };
  }

  public getHeaderCount(): number {
    return this.getHeaderEls().length;
  }

  private getRowEls(): DebugElement[] {
    return this.debugEl.queryAll(By.css('.sky-grid-row'));
  }

  private getRowEl(index: number): DebugElement {
    const rowEls = this.getRowEls();

    const rowEl = rowEls[index];

    if (!rowEl) {
      throw new Error(`No row exists at index ${index}.`);
    }

    return rowEl;
  }

  private getHeaderEls(): DebugElement[] {
    return this.debugEl.queryAll(By.css('th.sky-grid-heading > div'));
  }

  private getCellEls(rowEl: DebugElement) {
    return rowEl.queryAll(By.css('.sky-grid-cell sky-grid-cell'));
  }
}
