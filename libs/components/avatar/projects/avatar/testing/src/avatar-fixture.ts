import {
  ComponentFixture
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX avatar component.
 */
export class SkyAvatarFixture {

  /**
   * The initials displayed when no image URL is specified.
   */
  public get initials(): string {
    const initialsEl = this.debugEl.query(By.css('.sky-avatar-initials'));

    if (SkyAppTestUtility.isVisible(initialsEl)) {
      return SkyAppTestUtility.getText(
        initialsEl.query(By.css('.sky-avatar-initials-inner'))
      );
    }

    return undefined;
  }

  /**
   * The avatar's current image URL.
   */
  public get imageUrl(): string {
    const imageEl = this.debugEl.query(By.css('.sky-avatar-image'));

    if (SkyAppTestUtility.isVisible(imageEl)) {
      return SkyAppTestUtility.getBackgroundImageUrl(imageEl);
    }

    return undefined;
  }

  private debugEl: DebugElement;

  constructor(
    fixture: ComponentFixture<any>,
    skyTestId: string
  ) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(fixture, skyTestId, 'sky-avatar');
  }

}
