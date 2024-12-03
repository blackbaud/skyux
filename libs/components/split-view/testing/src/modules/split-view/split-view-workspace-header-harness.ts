import { TestElement } from '@angular/cdk/testing';
import { SkyInputHarness } from '@skyux/core/testing';

/**
 * Harness to interact with the split view workspace header component in tests.
 * @internal
 */
export class SkySplitViewWorkspaceHeaderHarness extends SkyInputHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-split-view-workspace-header';

  #getButton = this.locatorFor(
    '.sky-split-view-workspace-header-content button',
  );

  /**
   * Gets the back to list button.
   * @internal
   */
  public async getButton(): Promise<TestElement> {
    return await this.#getButton();
  }
}
