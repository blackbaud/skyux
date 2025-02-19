import { TestElement } from '@angular/cdk/testing';
import { SkyQueryableComponentHarness } from '@skyux/core/testing';

import { SkyFlyoutIteratorHarness } from './flyout-iterator-harness';

/**
 * Harness for interacting with a flyout component in tests.
 */
export class SkyFlyoutHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-flyout';

  #getFlyout = this.locatorFor('.sky-flyout');

  /**
   * Clicks the flyout's next iterator button.
   */
  public async clickNextIteratorButton(): Promise<void> {
    const iterator = await this.#getIterator();

    await iterator.clickNextButton();
  }

  /**
   * Clicks the flyout's previous iterator button.
   */
  public async clickPreviousIteratorButton(): Promise<void> {
    const iterator = await this.#getIterator();

    await iterator.clickPreviousButton();
  }

  /**
   * Clicks the flyout's primary action button.
   */
  public async clickPrimaryActionButton(): Promise<void> {
    const primaryAction = await this.#getPrimaryAction();

    await primaryAction.click();
  }

  /**
   * Clicks the flyout's close button.
   */
  public async closeFlyout(): Promise<void> {
    const closeButton = await this.locatorFor('.sky-flyout-btn-close')();
    await closeButton.click();
  }

  /**
   * Gets the flyout's aria-describedby attribute.
   */
  public async getAriaDescribedBy(): Promise<string | null> {
    return await (await this.#getFlyout()).getAttribute('aria-describedby');
  }

  /**
   * Gets the flyout's aria-label attribute.
   */
  public async getAriaLabel(): Promise<string | null> {
    return await (await this.#getFlyout()).getAttribute('aria-label');
  }

  /**
   * Gets the flyout's aria-labelledby attribute.
   */
  public async getAriaLabelledBy(): Promise<string | null> {
    return await (await this.#getFlyout()).getAttribute('aria-labelledby');
  }

  /**
   * Gets the flyout's ARIA role.
   */
  public async getAriaRole(): Promise<string | null> {
    return await (await this.#getFlyout()).getAttribute('role');
  }

  /**
   * Gets the flyout's maximum width.
   */
  public async getFlyoutMaxWidth(): Promise<number> {
    const resizeHandle = await this.locatorFor('.sky-flyout-resize-handle')();
    const currentWidthAttr = (await resizeHandle.getAttribute(
      'aria-valuemax',
    )) as string;
    return parseInt(currentWidthAttr);
  }

  /**
   * Gets the flyout's minimum width.
   */
  public async getFlyoutMinWidth(): Promise<number> {
    const resizeHandle = await this.locatorFor('.sky-flyout-resize-handle')();
    const currentWidthAttr = (await resizeHandle.getAttribute(
      'aria-valuemin',
    )) as string;
    return parseInt(currentWidthAttr);
  }

  /**
   * Gets the flyout's current width.
   */
  public async getFlyoutWidth(): Promise<number> {
    const resizeHandle = await this.locatorFor('.sky-flyout-resize-handle')();
    const currentWidthAttr = (await resizeHandle.getAttribute(
      'aria-valuenow',
    )) as string;
    return parseInt(currentWidthAttr);
  }

  /**
   * Gets the label for the flyout's permalink button.
   */
  public async getPermalinkButtonLabel(): Promise<string> {
    const permalink = await this.#getPermalink();

    return await permalink.text();
  }

  /**
   * Gets the route for the flyout's permalink button.
   */
  public async getPermalinkButtonRoute(): Promise<string | null> {
    const permalink = await this.#getPermalink();

    return await permalink.getAttribute('href');
  }

  /**
   * Gets the label for the flyout's primary action button.
   */
  public async getPrimaryActionButtonLabel(): Promise<string> {
    const primaryAction = await this.#getPrimaryAction();

    return await primaryAction.text();
  }

  async #getIterator(): Promise<SkyFlyoutIteratorHarness> {
    const iterator = await this.locatorForOptional(SkyFlyoutIteratorHarness)();

    if (iterator === null) {
      throw new Error('Could not find iterator buttons.');
    }

    return iterator;
  }

  async #getPermalink(): Promise<TestElement> {
    const permalink = await this.locatorForOptional(
      '.sky-flyout-btn-permalink',
    )();

    if (permalink === null) {
      throw new Error('Could not find permalink button.');
    }

    return permalink;
  }

  async #getPrimaryAction(): Promise<TestElement> {
    const primaryAction = await this.locatorForOptional(
      '.sky-flyout-btn-primary-action',
    )();

    if (primaryAction === null) {
      throw new Error('Could not find primary action button.');
    }

    return primaryAction;
  }
}
