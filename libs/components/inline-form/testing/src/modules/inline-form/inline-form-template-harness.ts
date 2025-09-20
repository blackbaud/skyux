import { SkyQueryableComponentHarness } from '@skyux/core/testing';

/**
 * Harness to interact with inline form template components in tests.
 */
export class SkyInlineFormTemplateHarness extends SkyQueryableComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-inline-form-content';
}
