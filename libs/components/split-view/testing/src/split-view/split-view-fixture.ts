import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkySplitViewFixtureDrawer } from './split-view-fixture-drawer';
import { SkySplitViewFixtureWorkspace } from './split-view-fixture-workspace';

/**
 * Provides information for and interaction with a SKY UX split view component.
 * By using the fixture API, a test insulates itself against updates to the internals
 * of a component, such as changing its DOM structure.
 * @internal
 */
export class SkySplitViewFixture {
  #debugEl: DebugElement;

  /**
   * Returns information about the split view's drawer component.
   */
  public get drawer(): SkySplitViewFixtureDrawer {
    const drawer = this.#getDrawer();

    return {
      ariaLabel: drawer.getAttribute('aria-label'),
      isVisible: !this.#drawerIsHidden(),
      width: drawer.style.width,
    };
  }

  /**
   * Returns information about the split view's workspace component.
   */
  public get workspace(): SkySplitViewFixtureWorkspace {
    const workspace = this.#getWorkspace();
    const backButton = this.#getBackToListButton();
    const workspaceIsHidden = this.#workspaceIsHidden();

    return {
      ariaLabel: workspace.getAttribute('aria-label'),
      backButtonIsVisible: !workspaceIsHidden && backButton !== undefined,
      backButtonText: SkyAppTestUtility.getText(backButton),
      isVisible: !workspaceIsHidden,
    };
  }

  #fixture: ComponentFixture<unknown>;

  constructor(fixture: ComponentFixture<unknown>, skyTestId: string) {
    this.#fixture = fixture;
    this.#debugEl = SkyAppTestUtility.getDebugElementByTestId(
      fixture,
      skyTestId,
      'sky-split-view',
    );

    // the component takes a while to initialize so we need to wait
    this.#waitForComponent();
  }

  /**
   * Opens the drawer component when in responsive mode. This method clicks the back to list
   * button, if it is visible.
   */
  public async openDrawer(): Promise<void> {
    const backButton = this.#getBackToListButton();
    if (backButton !== undefined) {
      backButton.click();
      this.#fixture.detectChanges();
      await this.#fixture.whenStable();
    }
  }

  // #region helpers

  #getDrawer(): HTMLElement {
    return this.#debugEl.query(By.css('.sky-split-view-drawer')).nativeElement;
  }

  #drawerIsHidden(): boolean {
    const drawer = this.#debugEl.query(
      By.css('.sky-split-view-drawer-flex-container'),
    ).nativeElement;
    return drawer.hasAttribute('hidden');
  }

  #getWorkspace(): HTMLElement {
    return this.#debugEl.query(By.css('.sky-split-view-workspace'))
      .nativeElement;
  }

  #workspaceIsHidden(): boolean {
    const workspace = this.#debugEl.query(
      By.css('.sky-split-view-workspace-flex-container'),
    ).nativeElement;
    return workspace.hasAttribute('hidden');
  }

  #getBackToListButton(): HTMLButtonElement {
    return this.#debugEl.query(
      By.css('.sky-split-view-workspace-header-content > button'),
    )?.nativeElement as HTMLButtonElement;
  }

  async #waitForComponent(): Promise<void> {
    this.#fixture.detectChanges();
    await this.#fixture.whenStable();

    this.#fixture.detectChanges();
    return await this.#fixture.whenStable();
  }

  // #endregion
}
