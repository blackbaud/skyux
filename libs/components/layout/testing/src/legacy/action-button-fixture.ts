import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX action button component.
 * @internal
 */
export class SkyActionButtonFixture {
  /**
   * The action button's current header text.
   */
  public get headerText(): string | undefined {
    return SkyAppTestUtility.getText(
      this.#debugEl.query(By.css('.sky-action-button-header')),
    );
  }

  /**
   * The action button's current details text.
   */
  public get detailsText(): string | undefined {
    return SkyAppTestUtility.getText(
      this.#debugEl.query(By.css('sky-action-button-details')),
    );
  }

  /**
   * The action button's current icon type.
   */
  public get iconType(): string | undefined {
    const svgElement = this.#debugEl.query(By.css('sky-icon svg'));
    
    if (svgElement) {
      return svgElement.nativeElement.getAttribute('data-sky-icon');
    }
    
    return undefined;
  }

  #debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-action-button',
    );
  }

  /**
   * Clicks the action button.
   */
  public actionClick(): void {
    this.#debugEl
      .query(By.css('.sky-action-button'))
      .triggerEventHandler('click', {});
  }
}
