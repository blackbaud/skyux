import {
  ComponentHarness,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';
import { SkyOverlayHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with an popover component in tests.
 * @internal
 */
export class SkyPopoverHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-popover-content';

  #getBody = this.locatorFor('.sky-popover-body');
  #getContainer = this.locatorFor('.sky-popover-container');
  #getOverlay =
    this.documentRootLocatorFactory().locatorForOptional(SkyOverlayHarness);
  #getTitle = this.locatorForOptional('.sky-popover-title');

  /**
   * Returns a child harness.
   */
  public async queryHarness<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T | null> {
    return this.locatorForOptional(harness)();
  }

  /**
   * Returns child harnesses.
   */
  public async queryHarnesses<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T[]> {
    return this.locatorForAll(harness)();
  }

  /**
   * Returns a child test element.
   */
  public async querySelector(selector: string): Promise<TestElement | null> {
    return this.locatorForOptional(selector)();
  }

  /**
   * Returns child test elements.
   */
  public async querySelectorAll(selector: string): Promise<TestElement[]> {
    return this.locatorForAll(selector)();
  }

  /**
   * Gets the placement of the popover content.
   */
  public async getPlacement(): Promise<string> {
    const container = await this.#getContainer();

    for (const placement of ['left', 'right', 'above', 'below']) {
      if (await container.hasClass('sky-popover-placement-' + placement)) {
        return placement;
      }
    }

    // This should never happen because the placement input is always defined by the parent.
    /* istanbul ignore next */
    return '';
  }

  /**
   * Gets the alignment of the popover content.
   */
  public async getAlignment(): Promise<string> {
    const container = await this.#getContainer();

    for (const alignment of ['left', 'center', 'right']) {
      if (await container.hasClass('sky-popover-alignment-' + alignment)) {
        return alignment;
      }
    }

    // This should never happen because the alignment input is always defined by the parent.
    /* istanbul ignore next */
    return '';
  }

  /**
   * Gets the text of the popover content title.
   */
  public async getTitleText(): Promise<string | undefined> {
    return (await this.#getTitle())?.text();
  }

  /**
   * Gets the text of the popover content body.
   */
  public async getBodyText(): Promise<string> {
    return (await this.#getBody()).text();
  }

  /**
   * Clicks out of the dropdown menu. If `dismissOnBlur` property is set to false, then the dropdown menu does not close.
   */
  public async clickOut(): Promise<void> {
    (await (await this.#getOverlay())?.host())?.click();
  }
}
