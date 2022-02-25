import { ComponentFixture } from '@angular/core/testing';

import { DebugElement } from '@angular/core';

import { By } from '@angular/platform-browser';

import { SkyAppTestUtility } from '@skyux-sdk/testing';

/**
 * Allows interaction with a SKY UX avatar component.
 */
export class SkyCardFixture {
  /**
   * The card's current title.
   */
  public get titleText(): string {
    return SkyAppTestUtility.getText(
      this.debugEl.query(By.css('sky-card-title'))
    );
  }

  /**
   * The card's current content text.
   */
  public get contentText(): string {
    return SkyAppTestUtility.getText(
      this.debugEl.query(By.css('sky-card-content'))
    );
  }

  /**
   * A flag indicating whether the user can select the card.
   */
  public get selectable(): boolean {
    return !!this.debugEl.query(By.css('.sky-card-check'));
  }

  /**
   * A flag indicating whether the card is currently selected.  If the card
   * is not selectable, an error is thrown.
   */
  public get selected(): boolean {
    if (this.selectable) {
      return this.getCheckInputEl().nativeElement.checked;
    }

    throw new Error('The card is not selectable.');
  }

  private debugEl: DebugElement;

  constructor(fixture: ComponentFixture<any>, skyTestId: string) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-card'
    );
  }

  /**
   * Selects the card.
   */
  public select(): void {
    if (!this.selected) {
      this.clickCheckLabelEl();
    }
  }

  /**
   * Deselects the card.
   */
  public deselect(): void {
    if (this.selected) {
      this.clickCheckLabelEl();
    }
  }

  private clickCheckLabelEl(): void {
    this.debugEl
      .query(By.css('.sky-card-check label.sky-checkbox-wrapper'))
      .nativeElement.click();
  }

  private getCheckInputEl(): DebugElement {
    return this.debugEl.query(
      By.css('.sky-card-check .sky-checkbox-wrapper input')
    );
  }
}
