import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX search component.
 * @deprecated Use `SkySearchHarness` instead.
 * @internal
 */
export class SkySearchFixture {
  /**
   * Gets the search's current text.
   */
  public get searchText(): string {
    return this.#getInputEl().nativeElement.value;
  }

  /**
   * Gets the search's current placeholder text.
   */
  public get placeholderText(): string {
    return this.#getInputEl().nativeElement.placeholder;
  }

  #debugEl: DebugElement;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-search',
    );
  }

  /**
   * Applies the specified search text, invoking the search.
   * @param searchText The search text to apply.  If none is specified, the search's
   * current search text will be applied.
   */
  public apply(searchText?: string): void {
    if (searchText) {
      SkyAppTestUtility.setInputValue(
        this.#getInputEl().nativeElement,
        searchText,
      );
    }

    const btnEl = this.#getApplyBtnEl();

    btnEl.triggerEventHandler('click', {});
  }

  /**
   * Clears the current search text. If there is no search text or the search text is
   * not currently applied, an error is thrown.
   */
  public clear(): void {
    const clearEl = this.#debugEl.query(By.css('.sky-input-group-clear'));

    if (!SkyAppTestUtility.isVisible(clearEl)) {
      throw new Error(
        'There currently is no search text or the current search text has not been applied, ' +
          'so the clear button is not visible.',
      );
    }

    const btnEl = this.#getClearBtnEl();

    btnEl.triggerEventHandler('click', {});
  }

  #getApplyBtnEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-search-btn-apply'));
  }

  #getClearBtnEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-search-btn-clear'));
  }

  #getInputEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-search-input'));
  }
}
