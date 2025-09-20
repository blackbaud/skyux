import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * @deprecated Use `SkyWaitHarness` instead.
 * @internal
 */
export class SkyWaitFixture {
  public get isWaiting(): boolean {
    return this.#innerWaitComponentContainsClass('.sky-wait-mask');
  }

  public get isFullPage(): boolean {
    return this.#innerWaitComponentContainsClass(
      '.sky-wait-mask-loading-fixed',
    );
  }

  public get ariaLabel(): string {
    const div = this.#debugEl.nativeElement.querySelector('.sky-wait-mask');
    return div.getAttribute('aria-label');
  }

  public get isNonBlocking(): boolean {
    return this.#innerWaitComponentContainsClass(
      '.sky-wait-mask-loading-non-blocking',
    );
  }

  #debugEl: DebugElement;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-wait',
    );
  }

  #innerWaitComponentContainsClass(className: string): boolean {
    const element: HTMLDivElement =
      this.#debugEl.nativeElement.querySelector(className);
    return element !== null;
  }
}
