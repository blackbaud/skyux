import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX toast component.
 * @internal
 */
export class SkyToastFixture {
  /**
   * The toast's current text.
   */
  public get text(): string | undefined {
    return SkyAppTestUtility.getText(this.#getToastContentEl());
  }

  /**
   * The toast's current type.
   */
  public get toastType(): string {
    const clsList = this.#getToastEl().nativeElement.classList;

    if (clsList.contains('sky-toast-danger')) {
      return 'danger';
    }

    if (clsList.contains('sky-toast-success')) {
      return 'success';
    }

    if (clsList.contains('sky-toast-warning')) {
      return 'warning';
    }

    return 'info';
  }

  #debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-toast',
    );
  }

  /**
   * Clicks the toast's close button.
   */
  public clickCloseButton(): void {
    const closeBtnEl = this.#getCloseBtnEl();

    closeBtnEl.triggerEventHandler('click', {});
  }

  #getToastEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-toast'));
  }

  #getToastContentEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-toast-content'));
  }

  #getCloseBtnEl(): DebugElement {
    return this.#debugEl.query(By.css('.sky-toast-btn-close'));
  }
}
