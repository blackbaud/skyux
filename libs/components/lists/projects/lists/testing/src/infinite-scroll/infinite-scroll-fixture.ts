import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture
} from '@angular/core/testing';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

/**
 * Provides information for and interaction with a SKY UX infinite scroll component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyInfiniteScrollFixture {
  private debugElement: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-infinite-scroll');
  }

  public get loadMoreButtonIsVisible(): boolean {
    return this.getButton() instanceof HTMLButtonElement;
  }

  public async clickLoadMoreButton(): Promise<any> {
    const button = this.getButton();
    if (button instanceof HTMLButtonElement) {
      button.click();
    }
    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  private getButton() {
    return this.debugElement.nativeElement.querySelector('.sky-infinite-scroll .sky-btn');
  }
}
