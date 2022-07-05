import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';

export class SkyLookupHarness extends ComponentHarness {
  public static hostSelector = 'sky-lookup';

  protected getInputEl = this.locatorFor('textarea.sky-lookup-input');

  public static with(
    options: SkyLookupHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return new HarnessPredicate(SkyLookupHarness, options).addOption(
      'skyId',
      options.skyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.getSkyId(), text)
    );
  }

  protected async getSkyId(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-sky-id');
  }

  public async getValue() {}

  public async setValue() {}
}
