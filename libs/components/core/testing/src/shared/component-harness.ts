import {
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';
import { SKY_DISABLED_ANIMATIONS_CLASS_NAME } from '@skyux/core';

import { SkyHarnessFilters } from './harness-filters';

/**
 * @internal
 */
export abstract class SkyComponentHarness extends ComponentHarness {
  static #animationsDisabled = false;

  constructor(...args: ConstructorParameters<typeof ComponentHarness>) {
    super(...args);
    SkyComponentHarness.#ensureAnimationsDisabled();
  }

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

  /**
   * Disables CSS animations for SKY UX components when browser testing. Tests
   * ran in JSDom do not execute animations.
   */
  static #ensureAnimationsDisabled(): void {
    if (
      SkyComponentHarness.#animationsDisabled ||
      typeof document === 'undefined' ||
      !document.body
    ) {
      return;
    }

    if (!document.body.classList.contains(SKY_DISABLED_ANIMATIONS_CLASS_NAME)) {
      document.body.classList.add(SKY_DISABLED_ANIMATIONS_CLASS_NAME);
    }

    SkyComponentHarness.#animationsDisabled = true;
  }

  async #getSkyId(): Promise<string | null> {
    return await (await this.host()).getAttribute('data-sky-id');
  }
}
