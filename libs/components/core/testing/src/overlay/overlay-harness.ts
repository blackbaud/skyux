import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

interface SkyOverlayHarnessFilters extends BaseHarnessFilters {
  id: string;
}

export class SkyOverlayHarness extends ComponentHarness {
  public static hostSelector = '.sky-overlay';

  public static with(
    options: SkyOverlayHarnessFilters
  ): HarnessPredicate<SkyOverlayHarness> {
    return new HarnessPredicate(SkyOverlayHarness, options).addOption(
      'id',
      options.id,
      (harness, text) => HarnessPredicate.stringMatches(harness.#getId(), text)
    );
  }

  public async queryAll(selector: string) {
    return this.locatorForAll(selector)();
  }

  async #getId(): Promise<string | null> {
    return (await this.host()).getAttribute('id');
  }
}
