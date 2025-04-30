import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyInlineFormButtonHarness` instances.
 */
export interface SkyInlineFormButtonHarnessFilters extends SkyHarnessFilters {
  /**
   * Finds the button whose text matches this value.
   */
  text?: string;

  /**
   * Finds the button whose style type matches this value.
   */
  styleType?: 'primary' | 'link' | 'default';
}
