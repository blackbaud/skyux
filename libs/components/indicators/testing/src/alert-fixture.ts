import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX alert component.
 * @deprecated Use `SkyAlertHarness` instead.
 * @internal
 */
export class SkyAlertFixture {
  /**
   * The alert's current text.
   */
  public get text(): string | undefined {
    return SkyAppTestUtility.getText(this.#debugEl);
  }

  /**
   * A flag indicating whether the alert can be closed.
   */
  public get closeable(): boolean | undefined {
    const closeBtnEl = this.#getCloseBtnEl();

    return SkyAppTestUtility.isVisible(closeBtnEl);
  }

  /**
   * Returns a flag indicating whether the alert is closed.
   */
  public get closed(): boolean {
    return !SkyAppTestUtility.isVisible(this.#getAlertEl());
  }

  /**
   * The alert's current type.
   */
  public get alertType(): string | undefined {
    const clsList = this.#getAlertEl().nativeElement.classList;

    if (clsList.contains('sky-alert-danger')) {
      return 'danger';
    }

    if (clsList.contains('sky-alert-info')) {
      return 'info';
    }

    if (clsList.contains('sky-alert-success')) {
      return 'success';
    }

    if (clsList.contains('sky-alert-warning')) {
      return 'warning';
    }

    return undefined;
  }

  #debugEl: DebugElement;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-alert',
    );
  }

  /**
   * Closes the alert.  If the alert is not closeable, an error is thrown.
   */
  public close(): void {
    if (this.closeable) {
      const closeBtnEl = this.#getCloseBtnEl();

      closeBtnEl.triggerEventHandler('click', {});
    } else {
      throw new Error('The alert is not closeable.');
    }
  }

  #getAlertEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-alert'));
  }

  #getCloseBtnEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-alert-close'));
  }
}
