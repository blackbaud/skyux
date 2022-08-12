import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyOverlayHarness } from '@skyux/core/testing';

import { SkyAutocompleteHarnessFilters } from './autocomplete-harness-filters';
import { SkyAutocompleteHarnessSearchResult } from './autocomplete-harness-search-result';
import { SkyAutocompleteInputHarness } from './autocomplete-input-harness';
import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-filters';
import { SkyAutocompleteSearchResultHarness } from './autocomplete-search-result-harness';

export class SkyAutocompleteHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-autocomplete';

  #documentRootLocator = this.documentRootLocatorFactory();

  protected getInputHarness = this.locatorFor(SkyAutocompleteInputHarness);

  public static with(
    filters: SkyAutocompleteHarnessFilters
  ): HarnessPredicate<SkyAutocompleteHarness> {
    return SkyAutocompleteHarness.getDataSkyIdPredicate(filters);
  }

  public async blur(): Promise<void> {
    return (await this.#getInputEl()).blur();
  }

  public async clear(): Promise<void> {
    return (await this.#getInputEl()).clear();
  }

  public async enterText(value: string): Promise<void> {
    const el = await this.#getInputEl();
    await el.focus();
    await el.clear();
    await el.sendKeys(value);
  }

  public async focus(): Promise<void> {
    return (await this.#getInputEl()).focus();
  }

  public async getSearchResults(): Promise<
    SkyAutocompleteHarnessSearchResult[] | undefined
  > {
    const harnesses = await this.#getSearchResultHarnesses();
    if (harnesses) {
      const results: SkyAutocompleteHarnessSearchResult[] = [];

      for (const harness of harnesses) {
        const harnessTestElement = await harness.host();
        const option: SkyAutocompleteHarnessSearchResult = {
          textContent: await harnessTestElement.text(),
        };

        if (await harness.hasCustomTemplate()) {
          option.testElement = harnessTestElement;
        }

        results.push(option);
      }

      return results;
    }

    return;
  }

  public async selectSearchResult(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<void> {
    const resultHarnesses = await this.#getSearchResultHarnesses(filters);
    if (resultHarnesses && resultHarnesses.length > 0) {
      await resultHarnesses[0].select();
    }
  }

  public async getValue(): Promise<string> {
    return (await this.#getInputEl()).getProperty('value');
  }

  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.#getInputEl()).getAttribute('disabled');
    return disabled !== null;
  }

  public async isOpen(): Promise<boolean> {
    const overlay = await this.#getOverlay();
    return !!overlay;
  }

  public async isFocused(): Promise<boolean> {
    return (await this.#getInputEl()).isFocused();
  }

  public async clickAddButton(): Promise<void> {
    const overlay = await this.#getOverlay();
    if (!overlay) {
      throw new Error(
        'Unable to find the add button. ' +
          'The autocomplete dropdown is closed.'
      );
    }

    const button = await overlay.querySelector(
      'button.sky-autocomplete-action-add'
    );

    if (!button) {
      throw new Error(
        'The add button cannot be clicked because it does not exist.'
      );
    }

    await button.click();
  }

  public async clickShowMoreButton(): Promise<void> {
    const overlay = await this.#getOverlay();
    if (!overlay) {
      throw new Error(
        'Unable to find the show more button. ' +
          'The autocomplete dropdown is closed.'
      );
    }

    const button = await overlay.querySelector(
      'button.sky-autocomplete-action-more'
    );

    if (!button) {
      throw new Error(
        'The show more button cannot be clicked because it does not exist.'
      );
    }

    await button.click();
  }

  async #getInputEl(): Promise<TestElement> {
    return (await this.getInputHarness()).host();
  }

  async #getOverlay(): Promise<SkyOverlayHarness | undefined> {
    const overlayId = await (
      await this.#getInputEl()
    ).getAttribute('aria-owns');

    return overlayId
      ? this.#documentRootLocator.locatorFor(
          SkyOverlayHarness.with({ selector: `#${overlayId}` })
        )()
      : undefined;
  }

  async #getSearchResultHarnesses(
    filters?: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<SkyAutocompleteSearchResultHarness[]> {
    const overlay = await this.#getOverlay();

    if (!overlay) {
      throw new Error(
        'Unable to retrieve search results. ' +
          'The autocomplete dropdown is closed.'
      );
    }

    const harnesses = await overlay.queryHarnesses(
      SkyAutocompleteSearchResultHarness.with(filters || {})
    );

    if (!harnesses || harnesses.length === 0) {
      throw new Error(
        `Could not find search results matching filter(s): ${JSON.stringify(
          filters
        )}`
      );
    }

    return harnesses;
  }
}
