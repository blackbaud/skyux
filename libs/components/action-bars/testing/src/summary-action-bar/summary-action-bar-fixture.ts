import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkySummaryActionBarFixtureAction } from './summary-action-bar-fixture-action';

/**
 * Allows interaction with a SKY UX summary action bar component.
 */
export class SkySummaryActionBarFixture {
  /**
   * The cancel action model.
   */
  public get cancelAction(): SkySummaryActionBarFixtureAction {
    const cancelBtn = this.getCancelButton();
    return this.buildActionModel(cancelBtn);
  }

  /**
   * The primary action model.
   */
  public get primaryAction(): SkySummaryActionBarFixtureAction {
    const primaryBtn = this.getPrimaryActionButton();
    return this.buildActionModel(primaryBtn);
  }

  /**
   * The collection of secondary action models.
   */
  public get secondaryActions(): SkySummaryActionBarFixtureAction[] {
    const secondaryBtns = this.getSecondaryActionButtons();
    return secondaryBtns.map((btn: HTMLButtonElement) =>
      this.buildActionModel(btn)
    );
  }

  /**
   * A flag indicating whether or not the summary content is visible.
   */
  public get summaryBodyIsVisible(): boolean {
    const summaryEl = this.getSummaryElement();
    return summaryEl.clientHeight > 0;
  }

  private debugEl: DebugElement;

  private get isResponsiveMode(): boolean {
    const toggleButton =
      this.getSummaryCollapseButton() ?? this.getSummaryExpandButton();
    return toggleButton !== undefined;
  }

  constructor(private fixture: ComponentFixture<any>, skyTestId: string) {
    this.debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-summary-action-bar'
    );
  }

  /**
   * Toggles the secondary action dropdown open or closed, if in responsive mode.
   */
  public async toggleSecondaryActionDropdown(): Promise<void> {
    const toggleButton = this.getSecondaryActionsDropdownButton();

    if (toggleButton !== undefined) {
      toggleButton.click();

      this.fixture.detectChanges();
      await this.fixture.whenStable();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  /**
   * Toggles the summary content area open or closed, if in responsive mode.
   */
  public async toggleSummaryContentVisibility(): Promise<void> {
    const toggleButton =
      this.getSummaryCollapseButton() ?? this.getSummaryExpandButton();

    if (toggleButton !== undefined) {
      toggleButton.click();

      this.fixture.detectChanges();
      await this.fixture.whenStable();

      this.fixture.detectChanges();
      return this.fixture.whenStable();
    }
  }

  /**
   * Returns the first element that is a descendant of the node that matches the selector query
   * within the summary body element.
   * @param query The selector query to use.
   */
  public querySummaryBody(query: string): HTMLElement {
    return this.querySummaryBodyElement(query);
  }

  /**
   * Returns the all elements that are descendants of the node that matches the selector query
   * within the summary body element.
   * @param query The selector query to use.
   */
  public queryAllSummaryBody(query: string): NodeList {
    return this.queryAllSummaryBodyElement(query);
  }

  //#region helpers

  private buildActionModel(buttonEl: HTMLButtonElement) {
    return {
      buttonText: SkyAppTestUtility.getText(buttonEl),
      isDisabled: buttonEl.disabled,

      click: () => {
        buttonEl.click();
        this.fixture.detectChanges();
        return this.fixture.whenStable();
      },
    };
  }

  private getCancelButton(): HTMLButtonElement {
    return this.debugEl.query(By.css('sky-summary-action-bar-cancel .sky-btn'))
      ?.nativeElement;
  }

  private getPrimaryActionButton(): HTMLButtonElement {
    return this.debugEl.query(
      By.css('sky-summary-action-bar-primary-action .sky-btn')
    )?.nativeElement;
  }

  private getSecondaryActionButtons(): HTMLButtonElement[] {
    // get the secondary action buttons from the dropdown overlay in responsive mode
    if (this.isResponsiveMode) {
      const resultNodes = document.querySelectorAll(
        'sky-overlay sky-summary-action-bar-secondary-action .sky-btn'
      );
      return Array.prototype.slice.call(resultNodes);
    }

    // otherwise grab them from the component's debug element
    return this.debugEl
      .queryAll(By.css('sky-summary-action-bar-secondary-action .sky-btn'))
      .map((debugEl: DebugElement) => debugEl.nativeElement);
  }

  private getSecondaryActionsDropdownButton(): HTMLButtonElement {
    return this.debugEl.query(
      By.css('sky-summary-action-bar-secondary-actions .sky-dropdown-button')
    )?.nativeElement;
  }

  private getSummaryElement(): HTMLButtonElement {
    return this.debugEl.query(By.css('.sky-summary-action-bar-summary'))
      ?.nativeElement;
  }

  private getSummaryCollapseButton(): HTMLButtonElement {
    return this.debugEl.query(
      By.css('.sky-summary-action-bar-details-collapse button')
    )?.nativeElement;
  }

  private getSummaryExpandButton(): HTMLButtonElement {
    return this.debugEl.query(
      By.css('.sky-summary-action-bar-details-expand button')
    )?.nativeElement;
  }

  private querySummaryBodyElement(query: string): HTMLElement {
    return this.debugEl.nativeElement.querySelector(
      `sky-summary-action-bar-summary ${query}`
    );
  }

  private queryAllSummaryBodyElement(query: string): NodeList {
    return this.debugEl.nativeElement.querySelectorAll(
      `sky-summary-action-bar-summary ${query}`
    );
  }

  //#endregion helpers
}
