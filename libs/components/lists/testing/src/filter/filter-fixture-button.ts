import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyListsFilterFixtureButton } from './lists-filter-fixture-button';

/**
 * Provides information for and interaction with a SKY UX filter button component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 * @internal
 */
export class SkyFilterFixtureButton {
  #debugElement: DebugElement;
  #fixture: ComponentFixture<any>;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugElement = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-filter-button',
    );
  }

  /**
   * Click the button to apply the filter.
   */
  public async clickFilterButton(): Promise<any> {
    const button = this.#getButtonElement();
    if (button instanceof HTMLButtonElement && !button.disabled) {
      button.click();
    }
    this.#fixture.detectChanges();
    return await this.#fixture.whenStable();
  }

  public get button(): SkyListsFilterFixtureButton {
    const buttonElement = this.#getButtonElement();
    return {
      ariaControls: buttonElement?.getAttribute('aria-controls') ?? undefined,
      ariaExpanded: buttonElement?.getAttribute('aria-expanded') === 'true',
      disabled: !!buttonElement?.disabled,
      id: buttonElement?.id,
    };
  }
  /**
   * Get the button text.
   */
  public get buttonText(): string {
    const text = this.#getButtonElement()?.innerText;
    return this.#normalizeText(text);
  }

  #getButtonElement(): HTMLButtonElement | null {
    return this.#debugElement.nativeElement.querySelector('.sky-filter-btn');
  }

  #normalizeText(text: string | undefined): string {
    let retVal = '';
    if (text) {
      retVal = text?.trim().replace(/\s+/g, ' ');
    }
    return retVal;
  }
}
