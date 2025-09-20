import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

const SKY_ERROR_IMAGE_CLS_REGEX = /^sky-error-(\w*)-image$/;

/**
 * Allows interaction with a SKY UX error component.
 * @deprecated Use `SkyErrorHarness` instead.
 * @internal
 */
export class SkyErrorFixture {
  /**
   * The error's current type.
   */
  public get errorType(): string | undefined {
    const imageEl = this.#debugEl.query(
      By.css('.sky-error-image-container > div'),
    );

    if (imageEl) {
      const classList = imageEl.nativeElement.classList;

      for (let i = 0, n = classList.length; i < n; i++) {
        const cls = classList.item(i);
        const matches = SKY_ERROR_IMAGE_CLS_REGEX.exec(cls);

        /* istanbul ignore else */
        if (matches) {
          return matches[1];
        }
      }
    }

    return undefined;
  }

  #debugEl: DebugElement;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-error',
    );
  }
}
