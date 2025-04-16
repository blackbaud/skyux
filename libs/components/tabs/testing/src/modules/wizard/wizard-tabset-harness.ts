import { SkyTabsetHarness } from '../tabs/tabset-harness';

/**
 * Harness for interacting with a tabset component in tests.
 */
export class SkyWizardTabsetHarness extends SkyTabsetHarness {
  /**
   * @internal
   */
  public static override hostSelector = 'sky-tabset[tabstyle="wizard"]';
}
