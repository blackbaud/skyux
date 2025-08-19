import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX country field component.
 * @internal
 */
export class SkyCountryFieldFixture {
  #debugEl: DebugElement;

  /**
   * The value of the input field's autocomplete attribute.
   * @deprecated The country field component's `autocompleteAttribute` is deprecated.
   */
  public get autocompleteAttribute(): string | null {
    return this.#getInputElement().getAttribute('autocomplete');
  }

  /**
   * A flag indicating whether or not the input has been disabled.
   */
  public get disabled(): boolean {
    return this.#getInputElement().disabled;
  }

  /**
   * The value of the input field.
   */
  public get searchText(): string {
    return this.#getInputElement().value;
  }

  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-country-field',
    );
  }

  /**
   * Enters the search text into the input field displaying search results, but making no selection.
   * @param searchText The name of the country to select.
   * @returns The list of country names matching the search text.
   */
  public async search(searchText: string): Promise<string[]> {
    const resultNodes = await this.#searchAndGetResults(
      searchText,
      this.#fixture,
    );
    const resultArray = Array.prototype.slice.call(resultNodes);
    const results = resultArray
      .map((result) => {
        const countryNameEl = result.querySelector('.sky-highlight-mark');
        const countryName = SkyAppTestUtility.getText(countryNameEl);
        return countryName;
      })
      .filter((result) => result !== undefined);

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();

    return results;
  }

  /**
   * Enters the search text into the input field and selects the first result (if any).
   * @param searchText The name of the country to select.
   */
  public async searchAndSelectFirstResult(searchText: string): Promise<void> {
    await this.#searchAndSelect(searchText, 0, this.#fixture);

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  /**
   * Clears the country selection and input field.
   */
  public async clear(): Promise<void> {
    await this.#enterSearch('', this.#fixture);

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  //#region helpers
  #getAutocompleteElement(): HTMLElement {
    return document.querySelector('.sky-autocomplete-results') as HTMLElement;
  }

  #getInputElement(): HTMLTextAreaElement {
    const debugEl = this.#debugEl.query(By.css('textarea'));
    return debugEl.nativeElement as HTMLTextAreaElement;
  }

  async #blurInput(fixture: ComponentFixture<unknown>): Promise<void> {
    SkyAppTestUtility.fireDomEvent(this.#getInputElement(), 'blur');

    fixture.detectChanges();
    await fixture.whenStable();
  }

  async #enterSearch(
    newValue: string,
    fixture: ComponentFixture<unknown>,
  ): Promise<void> {
    const inputElement = this.#getInputElement();
    inputElement.value = newValue;
    SkyAppTestUtility.fireDomEvent(inputElement, 'focusin');
    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async #searchAndGetResults(
    newValue: string,
    fixture: ComponentFixture<unknown>,
  ): Promise<NodeListOf<HTMLElement>> {
    await this.#enterSearch(newValue, fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    return this.#getAutocompleteElement().querySelectorAll(
      '.sky-autocomplete-result',
    );
  }

  async #searchAndSelect(
    newValue: string,
    index: number,
    fixture: ComponentFixture<unknown>,
  ): Promise<void> {
    const inputElement = this.#getInputElement();
    const searchResults = await this.#searchAndGetResults(newValue, fixture);

    if (searchResults.length < index + 1) {
      throw new Error('Index out of range for results');
    }

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'click');
    await this.#blurInput(fixture);
  }

  //#endregion helpers
}
