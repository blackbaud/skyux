import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a file drop component in tests.
 * @internal
 */
export class SkyFileAttachmentHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-drop';
}
