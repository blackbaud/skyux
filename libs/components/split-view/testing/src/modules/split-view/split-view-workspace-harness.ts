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
   * Gets the workspace content component.
   */
  public async getContent(): Promise<SkySplitViewWorkspaceContentHarness> {
    const content = await this.#getContent();
    if (content === null) {
      throw Error('Could not find split view workspace content.');
    }

    return content;
  }

  /**
   * Gets the workspace footer component.
   */
  public async getFooter(): Promise<SkySplitViewWorkspaceFooterHarness> {
    const footer = await this.#getFooter();

    if (footer === null) {
      throw Error('Could not find split view workspace footer.');
    }

    return footer;
  }

  /**
   * Gets the workspace header component.
   * @internal
   */
  public async getHeader(): Promise<SkySplitViewWorkspaceHeaderHarness> {
    const header = await this.#getHeader();

    if (header === null) {
      throw Error('Could not find split view workspace header.');
    }

    return header;
  }
}
