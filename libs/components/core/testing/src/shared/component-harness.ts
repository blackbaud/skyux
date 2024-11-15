import {
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';

import { SkyHarnessFilters } from './harness-filters';

/**
 * @internal
 */
export abstract class SkyComponentHarness extends ComponentHarness {
  protected static getDataSkyIdPredicate<T extends SkyComponentHarness>(
    this: ComponentHarnessConstructor<T>,
    filters: SkyHarnessFilters,
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, filters).addOption(
      'dataSkyId',
      filters.dataSkyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.#getSkyId(), text),
    );
  }

  async #getSkyId(): Promise<string | null> {
    return await (await this.host()).getAttribute('data-sky-id');
  }
}
