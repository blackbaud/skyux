import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyInputBoxHarnessFilters } from './input-box-harness-filters';

export class SkyInputBoxHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-input-box';

  public static with(
    options: SkyInputBoxHarnessFilters
  ): HarnessPredicate<SkyInputBoxHarness> {
    return new HarnessPredicate(SkyInputBoxHarness, options).addOption(
      'data-sky-id',
      options.dataSkyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.getSkyId(), text)
    );
  }

  public async getHarness<C extends ComponentHarness>(
    C: HarnessQuery<C>
  ): Promise<C> {
    return (await this.locatorFor(C))();
  }
}
