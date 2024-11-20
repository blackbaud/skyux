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
    const classList = this.#debugEl.query(By.css('.fa.sky-icon')).nativeElement
      .classList;

    for (let i = 0, n = classList.length; i < n; i++) {
      const cls = classList.item(i);

      if (cls.indexOf('fa-') === 0) {
        return cls.substr(3);
      }
    }
    /* istanbul ignore next */
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
