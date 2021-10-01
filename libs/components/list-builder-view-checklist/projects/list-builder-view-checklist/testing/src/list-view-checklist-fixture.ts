import {
  ComponentFixture
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyListViewChecklistItem
} from './list-view-checklist-item';

const MULTI_SELECT_EL_SELECTOR = By.css('.sky-checkbox-wrapper > input');
const SINGLE_SELECT_EL_SELECTOR = By.css('.sky-list-view-checklist-single-button');

/**
 * Allows interaction with a SKY UX list view checklist component.
 */
export class SkyListViewChecklistFixture {

  private debugEl: DebugElement;

  constructor(
    fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-list-view-checklist'
    );
  }

  /**
   * Gets an item at the specified index.
   * @param index The item's index.
   */
  public getItem(index: number): SkyListViewChecklistItem {
    const selectWrapperEl = this.getSelectWrapperEl(index);
    const selectEl = this.getSelectEl(index);

    return {
      label: SkyAppTestUtility.getText(
        selectWrapperEl.query(By.css('div.sky-emphasized'))
      ),
      description: SkyAppTestUtility.getText(
        selectWrapperEl.query(By.css('div:not(.sky-emphasized)'))
      ),
      selected: this.isChecked(selectEl)
    };
  }

  /**
   * Selects the item at the specified index.
   * @param index The item's index.
   */
  public selectItem(index: number) {
    const selectEl = this.getSelectEl(index);

    if (!this.isChecked(selectEl)) {
      selectEl.nativeElement.click();
    }
  }

  /**
   * Deselects the item at the specified index.
   * @param index The item's index.
   */
  public deselectItem(index: number) {
    const selectEl = this.getSelectEl(index);

    if (selectEl.nativeElement.tagName === 'BUTTON') {
      throw new Error(`Items cannot be deselected in single select mode.`);
    }

    if (this.isChecked(selectEl)) {
      selectEl.nativeElement.click();
    }
  }

  private getItemEl(index: number): DebugElement {
    const itemEls = this.debugEl.queryAll(By.css('sky-list-view-checklist-item'));

    const itemEl = itemEls[index];

    if (!itemEl) {
      throw new Error(`No item exists at index ${index}.`);
    }

    return itemEl;
  }

  private getSelectEl(index: number): DebugElement {
    const itemEl = this.getItemEl(index);

    const checkboxEl = itemEl.query(MULTI_SELECT_EL_SELECTOR);

    if (checkboxEl) {
      return checkboxEl;
    }

    // Assume the list is in single-select mode.
    return itemEl.query(SINGLE_SELECT_EL_SELECTOR);
  }

  private getSelectWrapperEl(index: number): DebugElement {
    const itemEl = this.getItemEl(index);

    const itemWrapperEl = itemEl.query(By.css('sky-checkbox-label'));

    if (itemWrapperEl) {
      return itemWrapperEl;
    }

    // Assume the list is in single-select mode.
    return itemEl.query(SINGLE_SELECT_EL_SELECTOR);
  }

  private isChecked(selectEl: DebugElement): boolean {
    const el = selectEl.nativeElement;

    if (el.tagName === 'INPUT') {
      return el.checked;
    }

    // Assume the list is in single-select mode.
    return el.getAttribute('aria-checked') === 'true';
  }

}
