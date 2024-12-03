import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkySplitViewWorkspaceContentHarness } from './split-view-workspace-content-harness';
import { SkySplitViewWorkspaceFooterHarness } from './split-view-workspace-footer-harness';
import { SkySplitViewWorkspaceHeaderHarness } from './split-view-workspace-header-harness';

/**
 * Harness to interact with the split view workspace component in tests.
 */
export class SkySplitViewWorkspaceHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-split-view-workspace';

  #getContent = this.locatorForOptional(SkySplitViewWorkspaceContentHarness);
  #getFooter = this.locatorForOptional(SkySplitViewWorkspaceFooterHarness);
  #getHeader = this.locatorForOptional(SkySplitViewWorkspaceHeaderHarness);
  #getWorkspace = this.locatorFor('.sky-split-view-workspace');

  /**
   * The aria-label property of the split view workspace
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getWorkspace()).getAttribute('aria-label');
  }

  /**
   * Gets the workspace content component, if it exists.
   */
  public async getContent(): Promise<SkySplitViewWorkspaceContentHarness | null> {
    return await this.#getContent();
  }

  /**
   * Gets the workspace footer component, if it exists.
   */
  public async getFooter(): Promise<SkySplitViewWorkspaceFooterHarness | null> {
    return await this.#getFooter();
  }

  /**
   * Gets the workspace header component, if it exists.
   * @internal
   */
  public async getHeader(): Promise<SkySplitViewWorkspaceHeaderHarness | null> {
    return await this.#getHeader();
  }
}
