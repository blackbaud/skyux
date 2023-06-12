import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
  TestElement,
} from '@angular/cdk/testing';
import { SkyOverlayHarness } from '@skyux/core/testing';

import { SkyPopoverBodyHarness } from './popover-body-harness';
import { SkyPopoverContentHarnessFilters } from './popover-content-harness-filters';

/**
 * Harness for interacting with a popover content component in tests.
 */
export class SkyPopoverContentHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-popover-content';

  #getBody = this.locatorFor(SkyPopoverBodyHarness);
  #getContainer = this.locatorFor('.sky-popover-container');
  #getOverlay =
    this.documentRootLocatorFactory().locatorForOptional(SkyOverlayHarness);
  #getTitle = this.locatorForOptional('.sky-popover-title');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyPopoverContentHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyPopoverContentHarnessFilters
  ): HarnessPredicate<SkyPopoverContentHarness> {
    return new HarnessPredicate(SkyPopoverContentHarness, filters);
  }

  /**
   * Returns a child harness.
   */
  public async queryHarness<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T | null> {
    return (await this.#getBody()).queryHarness(harness);
  }

  /**
   * Returns child harnesses.
   */
  public async queryHarnesses<T extends ComponentHarness>(
    harness: HarnessQuery<T>
  ): Promise<T[]> {
    return (await this.#getBody()).queryHarnesses(harness);
  }

  /**
   * Returns a child test element.
   */
  public async querySelector(selector: string): Promise<TestElement | null> {
    return (await this.#getBody()).querySelector(selector);
  }

  /**
   * Returns child test elements.
   */
  public async querySelectorAll(selector: string): Promise<TestElement[]> {
    return (await this.#getBody()).querySelectorAll(selector);
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
    return (await this.#getBody()).getText();
  }

  /**
   * Clicks out of the popover. If `dismissOnBlur` property is set to false, then the popover does not close.
   */
  public async clickOut(): Promise<void> {
    (await (await this.#getOverlay())?.host())?.click();
  }
}
