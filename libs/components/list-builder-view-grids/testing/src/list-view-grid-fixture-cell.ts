import { DebugElement } from '@angular/core';

/**
 * Properties of a list view grid cell.
 */
export interface SkyListViewGridFixtureCell {
  /**
   * The cell's DebugElement.  This is useful for validating HTML inside the cell
   * when the grid column has a template associated with it.
   */
  el: DebugElement;

  /**
   * The text content of the cell.  Use this to validate simple columns bound directly
   * to a field without the use of a column template.
   */
  textContent: string;
}
