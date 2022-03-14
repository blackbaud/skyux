import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyListsFilterFixtureButton } from './lists-filter-fixture-button';

/**
 * Provides information for and interaction with a SKY UX filter button component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyFilterFixtureButton {
  private debugElement: DebugElement;

  constructor(private fixture: ComponentFixture<any>, skyTestId: string) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(
      this.fixture,
      skyTestId,
      'sky-filter-button'
    );
  }

  /**
   * Click the button to apply the filter.
   */
  public async clickFilterButton(): Promise<any> {
    const button = this.getButtonElement();
    if (button instanceof HTMLButtonElement && !button.disabled) {
      button.click();
    }
    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  public get button(): SkyListsFilterFixtureButton {
    const buttonElement = this.getButtonElement();
    return {
      ariaControls: buttonElement.getAttribute('aria-controls'),
      ariaExpanded: buttonElement.getAttribute('aria-expanded') === 'true',
      disabled: buttonElement.disabled,
      id: buttonElement.id,
    };
  }
  /**
   * Get the button text.
   */
  public get buttonText(): string {
    const text = this.getButtonElement()?.innerText;
    return this.normalizeText(text);
  }

  private getButtonElement(): HTMLButtonElement | null {
    return this.debugElement.nativeElement.querySelector('.sky-filter-btn');
  }

  private normalizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }
}
