import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyConfirmButtonHarnessFilters } from './confirm-button-harness-filters';

type ButtonStyle = 'primary' | 'default' | 'link';

/**
 * Harness for interacting with a confirm component in tests.
 */
export class SkyConfirmButtonHarness extends ComponentHarness {
  public static hostSelector = '.sky-confirm-buttons .sky-btn';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyConfirmButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyConfirmButtonHarnessFilters
  ): HarnessPredicate<SkyConfirmButtonHarness> {
    return new HarnessPredicate(SkyConfirmButtonHarness, filters)
      .addOption('textContent', filters.textContent, async (harness, text) =>
        HarnessPredicate.stringMatches(await harness.textContent(), text)
      )
      .addOption('styleType', filters.styleType, async (harness, styleType) =>
        HarnessPredicate.stringMatches(await harness.styleType(), styleType)
      );
  }

  /**
   * Gets the text content of the confirm button.
   */
  public async textContent(): Promise<string> {
    return (await this.host()).text();
  }

  /**
   * Gets the button style of the confirm button.
   */
  public async styleType(): Promise<ButtonStyle> {
    const hostEl = await this.host();

    if (await hostEl.hasClass('sky-btn-primary')) {
      return 'primary';
    } else if (await hostEl.hasClass('sky-btn-link')) {
      return 'link';
    }
    return 'default';
  }

  /**
   * Clicks the confirm button.
   */
  public async click(): Promise<void> {
    return (await this.host()).click();
  }
}
