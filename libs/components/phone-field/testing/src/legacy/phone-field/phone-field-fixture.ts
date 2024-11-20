import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyCountryFieldFixture } from '@skyux/lookup/testing';

/**
 * Provides information for and interaction with a SKY UX phone field component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 * @internal
 */
export class SkyPhoneFieldFixture {
  /**
   * The value of the input field for the phone field.
   */
  public get inputText(): string {
    return this.#phoneFieldInput.value;
  }

  /**
   * This property is lazy loaded and should be accessed via the #getCountryFixture() function.
   */
  #_countryFixture: SkyCountryFieldFixture | undefined;

  #_debugEl: DebugElement;

  #fixture: ComponentFixture<unknown>;

  #skyTestId: string;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#skyTestId = skyTestId;
    this.#_debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-phone-field',
    );

    // The country selector needs extra time to initialize.
    // Consumers shouldn't need to work around this so we do an extra detect here
    fixture.detectChanges();
  }

  /**
   * Blurs the phone field input and returns a promise that indicates when the action is complete.
   */
  public async blur(): Promise<void> {
    SkyAppTestUtility.fireDomEvent(this.#phoneFieldInput, 'blur');
    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  /**
   * Returns the selected country iso2 code.
   */
  public async getSelectedCountryIso2(): Promise<string | null> {
    // Wait for the country field to initialize.
    await this.#fixture.whenStable();
    return this.#countryFlagButtonContainer.getAttribute('data-sky-test-iso2');
  }

  /**
   * Returns the selected country name.
   */
  public async getSelectedCountryName(): Promise<string | null> {
    // Wait for the country field to initialize.
    await this.#fixture.whenStable();
    return this.#countryFlagButtonContainer.getAttribute('data-sky-test-name');
  }

  /**
   * Sets the value of the input field for the phone field.
   */
  public async setInputText(inputText: string): Promise<void> {
    const inputEl = this.#phoneFieldInput;
    inputEl.value = inputText;

    SkyAppTestUtility.fireDomEvent(inputEl, 'input');
    this.#fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change');

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }

  /**
   * Opens the country selector, performs a search, but makes no selection.
   * @param searchText The name of the country to select.
   * @returns The list of country names matching the search text.
   */
  public async searchCountry(searchText: string): Promise<string[]> {
    await this.#openCountrySelection();

    const countryFixture = await this.#getCountryFixture();
    const results = await countryFixture.search(searchText);

    await this.#waitForCountrySelection();
    return results;
  }

  /**
   * Opens the country selector, performs a search, and selects the first result (if any).
   * @param searchText The name of the country to select.
   */
  public async selectCountry(searchText: string): Promise<void> {
    await this.#openCountrySelection();

    const countryFixture = await this.#getCountryFixture();
    await countryFixture.searchAndSelectFirstResult(searchText);

    await this.#waitForCountrySelection();
  }

  /**
   * Gets a boolean promise indicating if the phone field is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    const disabled = this.#phoneFieldInput.getAttribute('disabled');
    return coerceBooleanProperty(disabled);
  }

  /**
   * Gets a boolean promise indicating if the phone field is valid.
   */
  public async isValid(): Promise<boolean> {
    return this.#phoneFieldInput.classList.contains('ng-valid');
  }

  get #countryElement(): HTMLInputElement {
    return this.#_debugEl.query(By.css('sky-country-field')).nativeElement;
  }

  get #countryFlagButtonContainer(): HTMLInputElement {
    return this.#_debugEl.query(By.css('.sky-phone-field-country-btn'))
      .nativeElement;
  }

  get #countryFlagButton(): HTMLInputElement {
    return this.#_debugEl.query(By.css('.sky-phone-field-country-btn .sky-btn'))
      .nativeElement;
  }

  get #phoneFieldInput(): HTMLInputElement {
    return this.#_debugEl.query(By.css('input[skyPhoneFieldInput]'))
      .nativeElement;
  }

  /**
   * The country-field can take a really long time to initialize. Since we can't perform an await
   * in our constructor, it's safest to do a lazy load of the country field to avoid any race
   * conditions where a test tries to access the sky-country-field element too quickly.
   */
  async #getCountryFixture(): Promise<SkyCountryFieldFixture> {
    if (this.#_countryFixture === undefined) {
      // tag the country field with a sky test id
      const countrySkyTestId = `${this.#skyTestId}-country`;
      this.#setSkyTestId(this.#countryElement, countrySkyTestId);

      // initialize the country fixture
      this.#_countryFixture = new SkyCountryFieldFixture(
        this.#fixture,
        countrySkyTestId,
      );

      this.#fixture.detectChanges();
      await this.#fixture.whenStable();
    }

    return this.#_countryFixture;
  }

  async #openCountrySelection(): Promise<void> {
    this.#countryFlagButton.click();
    await this.#waitForCountrySelection();
  }

  #setSkyTestId(element: HTMLElement, skyTestId: string): void {
    element.setAttribute('data-sky-id', skyTestId);
  }

  async #waitForCountrySelection(): Promise<void> {
    // any country selection needs extra time to complete
    this.#fixture.detectChanges();
    await this.#fixture.whenStable();

    this.#fixture.detectChanges();
    await this.#fixture.whenStable();
  }
}
