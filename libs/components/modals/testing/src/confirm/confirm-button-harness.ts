import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SkyConfirmButtonStyleType } from '@skyux/modals';

import { SkyConfirmButtonHarnessFilters } from './confirm-button-harness-filters';

/**
 * Harness for interacting with a confirm component in tests.
 * @internal
 */
export class SkyConfirmButtonHarness extends ComponentHarness {
  public static hostSelector = '.sky-confirm-buttons .sky-btn';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyConfirmButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyConfirmButtonHarnessFilters,
  ): HarnessPredicate<SkyConfirmButtonHarness> {
    return new HarnessPredicate(SkyConfirmButtonHarness, filters)
      .addOption(
        'text',
        filters.text,
        async (harness, text) =>
          await HarnessPredicate.stringMatches(await harness.getText(), text),
      )
      .addOption(
        'styleType',
        filters.styleType,
        async (harness, styleType) =>
          await HarnessPredicate.stringMatches(
            await harness.getStyleType(),
            styleType,
          ),
      );
  }

  /**
   * Clicks the confirm button.
   */
  public async click(): Promise<void> {
    return await (await this.host()).click();
  }

  /**
   * Gets the button style of the confirm button.
   */
  public async getStyleType(): Promise<SkyConfirmButtonStyleType> {
    const hostEl = await this.host();

    if (await hostEl.hasClass('sky-btn-primary')) {
      return 'primary';
    } else if (await hostEl.hasClass('sky-btn-link')) {
      return 'link';
    } else if (await hostEl.hasClass('sky-btn-danger')) {
      return 'danger';
    }
    return 'default';
  }

  /**
   * Gets the text content of the confirm button.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }
}
