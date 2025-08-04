import { ComponentHarness } from '@angular/cdk/testing';

import { SkyHelpInlineHarness } from '../help-inline/help-inline-harness';

/**
 * Utility functions for interacting with help inline popover functionality in tests.
 * These functions can be used with any harness via composition instead of inheritance.
 */

/**
 * Gets the help inline harness from a parent harness.
 * @param harness The parent harness to search within
 * @param options Optional configuration for finding the help inline harness
 * @returns Promise resolving to the SkyHelpInlineHarness
 * @throws Error if no help inline is found
 */
export async function getHelpInlineHarness(
  harness: ComponentHarness,
  options?: { ancestor?: string },
): Promise<SkyHelpInlineHarness> {
  const helpInlineHarness = await harness.locatorForOptional(
    options?.ancestor
      ? SkyHelpInlineHarness.with({ ancestor: options.ancestor })
      : SkyHelpInlineHarness,
  )();

  if (helpInlineHarness) {
    return helpInlineHarness;
  }

  throw Error('No help inline found.');
}

/**
 * Gets the help popover content from a harness.
 * @param harness The harness to get help popover content from
 * @param options Optional configuration for finding the help inline harness
 * @returns Promise resolving to the popover content or undefined
 */
export async function getHelpPopoverContent(
  harness: ComponentHarness,
  options?: { ancestor?: string },
): Promise<string | undefined> {
  const helpInlineHarness = await getHelpInlineHarness(harness, options);
  return await helpInlineHarness.getPopoverContent();
}

/**
 * Gets the help popover title from a harness.
 * @param harness The harness to get help popover title from
 * @param options Optional configuration for finding the help inline harness
 * @returns Promise resolving to the popover title or undefined
 */
export async function getHelpPopoverTitle(
  harness: ComponentHarness,
  options?: { ancestor?: string },
): Promise<string | undefined> {
  const helpInlineHarness = await getHelpInlineHarness(harness, options);
  return await helpInlineHarness.getPopoverTitle();
}

/**
 * Clicks the help inline button from a harness.
 * @param harness The harness to click help inline from
 * @param options Optional configuration for finding the help inline harness
 * @returns Promise that resolves when the click is complete
 */
export async function clickHelpInline(
  harness: ComponentHarness,
  options?: { ancestor?: string },
): Promise<void> {
  const helpInlineHarness = await getHelpInlineHarness(harness, options);
  return await helpInlineHarness.click();
}

/**
 * Interface for harnesses that want to include help popover functionality.
 * This provides a consistent API for help popover methods.
 */
export interface HelpPopoverHarnessMethods {
  getHelpPopoverContent(): Promise<string | undefined>;
  getHelpPopoverTitle(): Promise<string | undefined>;
  clickHelpInline(): Promise<void>;
}

/**
 * Creates help popover methods for a harness using composition.
 * This function returns an object with the help popover methods that can be
 * spread into a harness class or used to implement the HelpPopoverHarnessMethods interface.
 *
 * @param harness The harness instance
 * @param options Optional configuration for finding the help inline harness
 * @returns Object containing help popover methods
 */
export function createHelpPopoverHarnessMethods(
  harness: ComponentHarness,
  options?: { ancestor?: string },
): HelpPopoverHarnessMethods {
  return {
    async getHelpPopoverContent(): Promise<string | undefined> {
      return await getHelpPopoverContent(harness, options);
    },
    async getHelpPopoverTitle(): Promise<string | undefined> {
      return await getHelpPopoverTitle(harness, options);
    },
    async clickHelpInline(): Promise<void> {
      return await clickHelpInline(harness, options);
    },
  };
}
