import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkySplitViewDockType } from '@skyux/split-view';

import { SkySplitViewDrawerHarness } from './split-view-drawer-harness';
import { SkySplitViewHarnessFilters } from './split-view-harness-filters';
import { SkySplitViewWorkspaceHarness } from './split-view-workspace-harness';

/**
 * Harness for interacting with a split view component in tests.
 */
export class SkySplitViewHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-split-view';

  #getSplitView = this.locatorFor('.sky-split-view');
  #getSplitViewDrawer = this.locatorForOptional(SkySplitViewDrawerHarness);
  #getSplitViewDrawerContainer = this.locatorFor(
    '.sky-split-view-drawer-flex-container',
  );
  #getSplitViewWorkspace = this.locatorForOptional(
    SkySplitViewWorkspaceHarness,
  );
  #getSplitViewWorkspaceContainer = this.locatorFor(
    '.sky-split-view-workspace-flex-container',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySplitViewHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySplitViewHarnessFilters,
  ): HarnessPredicate<SkySplitViewHarness> {
    return SkySplitViewHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the text for the button that appears in the workspace header in responsive mode.
   */
  public async getBackButtonText(): Promise<string> {
    return (await (await this.#getBackButton()).text()).trim();
  }

  /**
   * Gets the type of dock style on the split view.
   */
  public async getDockType(): Promise<SkySplitViewDockType> {
    const dockClass = await (
      await this.#getSplitView()
    ).hasClass('sky-split-view-dock-fill');

    return dockClass ? 'fill' : 'none';
  }

  /**
   * Gets a 'SkySplitViewDrawerHarness`.
   */
  public async getDrawer(): Promise<SkySplitViewDrawerHarness> {
    const drawer = await this.#getSplitViewDrawer();

    if (!drawer) {
      throw Error('Could not find split view drawer.');
    }

    return drawer;
  }

  /**
   * Whether the drawer component is visible
   */
  public async getDrawerIsVisible(): Promise<boolean> {
    const drawerContainer = await this.#getSplitViewDrawerContainer();
    return (await drawerContainer.getAttribute('hidden')) === null;
  }

  /**
   * Gets a `SkySplitViewWorkspaceHarness`.
   */
  public async getWorkspace(): Promise<SkySplitViewWorkspaceHarness> {
    const workspace = await this.#getSplitViewWorkspace();

    if (!workspace) {
      throw Error('Could not find split view workspace.');
    }

    return workspace;
  }

  /**
   * Whether the workspace component is visible.
   */
  public async getWorkspaceIsVisible(): Promise<boolean> {
    const workspaceContainer = await this.#getSplitViewWorkspaceContainer();
    return (await workspaceContainer.getAttribute('hidden')) === null;
  }

  /**
   * Opens the drawer component when in responsive mode.
   */
  public async openDrawer(): Promise<void> {
    const button = await this.#getBackButton();

    await button.click();
  }

  async #getBackButton(): Promise<TestElement> {
    const workspace = await this.getWorkspace();
    return await (await workspace.getHeader()).getBackButton();
  }
}
