import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

export class SkyWaitFixture {

  public get isWaiting(): boolean {
    return this.innerWaitComponentContainsClass('.sky-wait-mask');
  }

  public get isFullPage(): boolean {
    return this.innerWaitComponentContainsClass('.sky-wait-mask-loading-fixed');
  }

  public get ariaLabel(): string {
    const div: HTMLDivElement = this.debugEl.nativeElement.querySelector('.sky-wait-mask');
    return div.getAttribute('aria-label');
  }

  public get isNonBlocking(): boolean {
    return this.innerWaitComponentContainsClass('.sky-wait-mask-loading-non-blocking');
  }

  private debugEl: DebugElement;

  constructor(
    fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-wait');
  }

  private innerWaitComponentContainsClass(className: string): boolean {
    const element: HTMLDivElement = this.debugEl.nativeElement.querySelector(className);
    return element !== null;
  }
}
