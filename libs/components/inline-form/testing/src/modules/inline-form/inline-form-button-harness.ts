import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyInlineFormButtonHarnessFilters } from './inline-form-button-harness.filters';

/**
 * Harness to interact with inline form button component in tests.
 */
export class SkyInlineFormButtonHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '.sky-inline-form-footer > button';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInlineFormButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyInlineFormButtonHarnessFilters,
  ): HarnessPredicate<SkyInlineFormButtonHarness> {
    return new HarnessPredicate(SkyInlineFormButtonHarness, filters)
      .addOption('text', filters.text, async (harness, text) => {
        const harnessText = await harness.getText();
        return await HarnessPredicate.stringMatches(harnessText, text);
      })
      .addOption('styleType', filters.styleType, async (harness, styleType) => {
        const harnessStyleType = await harness.getStyleType();
        return await HarnessPredicate.stringMatches(
          harnessStyleType,
          styleType,
        );
      });
  }

  /**
   * Clicks the button.
   */
  public async click(): Promise<void> {
    return await (await this.host()).click();
  }

  /**
   * Gets the button style type.
   */
  public async getStyleType(): Promise<'primary' | 'link' | 'default'> {
    const host = await this.host();
    if (await host.hasClass('sky-btn-primary')) {
      return 'primary';
    }
    if (await host.hasClass('sky-btn-link')) {
      return 'link';
    }
    return 'default';
  }

  /**
   * Gets the button text.
   */
  public async getText(): Promise<string> {
    return await (await this.host()).text();
  }

  /**
   * Whether the button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute('disabled')) === 'true';
  }
}
