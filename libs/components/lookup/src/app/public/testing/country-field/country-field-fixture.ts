import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX country field component.
 */
export class SkyCountryFieldFixture {
  private debugEl: DebugElement;

  /**
   * The value of the input field's autocomplete attribute.
   */
  public get autocompleteAttribute(): string {
    return this.getInputElement().getAttribute('autocomplete');
  }

  /**
   * A flag indicating if the country flag is currently visible.
   * The flag will be visible only if a selection has been made
   * and if the hideSelectedCountryFlag option is false.
   */
  public get countryFlagIsVisible(): boolean {
    const flag = this.getCountryFlag();
    return flag !== null;
  }

  /**
   * A flag indicating whether or not the input has been disabled.
   */
  public get disabled(): boolean {
    return this.getInputElement().disabled;
  }

  /**
   * The value of the input field.
   */
  public get searchText(): string {
    return this.getInputElement().value;
  }

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-country-field');
  }

  /**
   * Enters the search text into the input field displaying search results, but making no selection.
   * @param searchText The name of the country to select.
   * @returns The list of country names matching the search text.
   */
  public async search(searchText: string): Promise<string[]> {
    const resultNodes = await this.searchAndGetResults(searchText, this.fixture);
    const resultArray = Array.prototype.slice.call(resultNodes);
    const results = resultArray.map((result: HTMLElement) => {
      const countryNameEl = result.querySelector('.sky-highlight-mark');
      const countryName = SkyAppTestUtility.getText(countryNameEl);
      return countryName;
    });

    this.fixture.detectChanges();
    await this.fixture.whenStable();

    return results;
  }

  /**
   * Enters the search text into the input field and selects the first result (if any).
   * @param searchText The name of the country to select.
   */
  public async searchAndSelectFirstResult(searchText: string): Promise<void> {
    await this.searchAndSelect(searchText, 0, this.fixture);

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  /**
   * Clears the country selection and input field.
   */
  public clear(): Promise<void> {
    this.enterSearch('', this.fixture);

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  //#region helpers

  private getCountryFlag(): DebugElement {
    return this.debugEl.query(By.css('.sky-country-field-flag'));
  }

  private getAutocompleteElement(): HTMLElement {
    return document.querySelector('.sky-autocomplete-results') as HTMLElement;
  }

  private getInputElement(): HTMLTextAreaElement {
    const debugEl = this.debugEl.query(By.css('textarea'));
    return debugEl.nativeElement as HTMLTextAreaElement;
  }

  private blurInput(fixture: ComponentFixture<any>): Promise<void> {
    SkyAppTestUtility.fireDomEvent(this.getInputElement(), 'blur');
    fixture.detectChanges();
    return fixture.whenStable();
  }

  private enterSearch(
    newValue: string,
    fixture: ComponentFixture<any>
  ): Promise<void> {
    const inputElement = this.getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    fixture.detectChanges();
    return fixture.whenStable();
  }

  private async searchAndGetResults(
    newValue: string,
    fixture: ComponentFixture<any>
  ): Promise<NodeListOf<HTMLElement>> {
    await this.enterSearch(newValue, fixture);
    return this.getAutocompleteElement().querySelectorAll('.sky-autocomplete-result');
  }

  private async searchAndSelect(
    newValue: string,
    index: number,
    fixture: ComponentFixture<any>
  ): Promise<void> {
    const inputElement = this.getInputElement();
    const searchResults = await this.searchAndGetResults(newValue, fixture);

    if (searchResults.length < (index + 1)) {
      throw new Error('Index out of range for results');
    }

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'mousedown');
    this.blurInput(fixture);
  }

  //#endregion helpers
}
