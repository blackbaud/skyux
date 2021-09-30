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
 * Provides information for and interaction with a SKY UX filter summary component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 */
export class SkyFilterFixtureSummary {
  private debugElement: DebugElement;

  constructor(
    private fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugElement = SkyAppTestUtility.getDebugElementByTestId(this.fixture, skyTestId, 'sky-filter-summary');
  }

  public async filterCloseClick(index: number): Promise<any> {
    const summaryItems = this.debugElement.nativeElement.querySelectorAll('sky-filter-summary-item');
    if (summaryItems.length > index) {
      const summaryItem = summaryItems[index];
      if (summaryItem instanceof HTMLElement) {
        const closeButton = summaryItem.querySelector('.sky-token-btn-close');
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
          this.fixture.detectChanges();
          return this.fixture.whenStable();
        }
      }
    }
    throw new Error(`Unable to click close for a filter index ${index}`);
  }
}
