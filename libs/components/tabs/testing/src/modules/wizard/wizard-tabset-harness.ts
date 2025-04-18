import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyTabsetHarness } from '../tabs/tabset-harness';

import { SkyWizardTabButtonHarness } from './wizard-tab-button-harness';
import { SkyWizardTabsetHarnessFilters } from './wizard-tabset-harness-filters';

/**
 * Harness for interacting with a tabset component in tests.
 */
export class SkyWizardTabsetHarness extends SkyTabsetHarness {
  /**
   * @internal
   */
  public static override hostSelector = 'sky-tabset[tabstyle="wizard"]';

  public static override with(
    filters: SkyWizardTabsetHarnessFilters,
  ): HarnessPredicate<SkyWizardTabsetHarness> {
    return SkyWizardTabsetHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Does the docs get overriden?
   */
  public override async getActiveTabButton(): Promise<SkyWizardTabButtonHarness | null> {
    return await super.getActiveTabButton();
  }
}
