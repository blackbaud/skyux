import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyTokenHarness } from '@skyux/indicators/testing';

import { SkyAutocompleteHarness } from '../autocomplete/autocomplete-harness';
import { SkyAutocompleteHarnessFilters } from '../autocomplete/autocomplete-harness-filters';

import { SkyLookupShowMorePickerHarness } from './lookup-show-more-picker-harness';

export class SkyLookupHarness extends SkyAutocompleteHarness {
  public static hostSelector = 'sky-lookup,.sky-input-box';

  #getAutocompleteHarness = this.locatorFor(SkyAutocompleteHarness);

  #documentRootLocator = this.documentRootLocatorFactory();

  public static with(
    filters: SkyAutocompleteHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return new HarnessPredicate(SkyLookupHarness, filters).addOption(
      'dataSkyId',
      filters.dataSkyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.getSkyId(), text)
    );
  }

  public async openShowMorePicker(): Promise<SkyLookupShowMorePickerHarness> {
    await this.focus();
    await this.clickShowMoreButton();

    const pickerId = await (
      await (await this.#getAutocompleteHarness()).host()
    ).getAttribute('data-sky-lookup-show-more-picker-id');

    const defaultPicker = await this.#documentRootLocator.locatorFor(
      SkyLookupShowMorePickerHarness.with({ selector: `#${pickerId}` })
    )();

    return defaultPicker;
  }

  public async getTokens(): Promise<{ textContent: string }[]> {
    const tokens: { textContent: string }[] = [];
    const harnesses = await this.#getTokenHarnesses();

    if (harnesses) {
      for (const harness of harnesses) {
        tokens.push({ textContent: await (await harness.host()).text() });
      }
    }

    return tokens;
  }

  public async closeTokens(): Promise<void> {
    const harnesses = await this.#getTokenHarnesses();
    if (harnesses) {
      for (const harness of harnesses) {
        await harness.close();
      }
    }
  }

  async #getTokenHarnesses(): Promise<SkyTokenHarness[]> {
    return (await this.locatorForAll(SkyTokenHarness))();
  }
}
