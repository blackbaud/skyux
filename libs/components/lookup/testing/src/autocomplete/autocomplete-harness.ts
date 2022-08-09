import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import {
  SkyComponentHarness,
  SkyHarnessFilters,
  SkyOverlayHarness,
} from '@skyux/core/testing';

import { SkyAutocompleteInputHarness } from './autocomplete-input-harness';
import { SkyAutocompleteSearchResultHarness } from './autocomplete-search-result';
import { SkyAutocompleteSearchResultHarnessFilters } from './autocomplete-search-result-filters';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SkyAutocompleteHarnessFilters extends SkyHarnessFilters {}

interface SkyAutocompleteHarnessOption {
  textContent: string;
  testElement?: TestElement;
}

export class SkyAutocompleteHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-autocomplete';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getInputHarness = this.locatorFor(SkyAutocompleteInputHarness);

  #getAddButton = this.locatorFor('.sky-autocomplete-action-add');

  #getShowMoreButton = this.locatorFor('.sky-autocomplete-action-more');

  public static with(
    options: SkyAutocompleteHarnessFilters
  ): HarnessPredicate<SkyAutocompleteHarness> {
    return new HarnessPredicate(SkyAutocompleteHarness, options).addOption(
      'dataSkyId',
      options.dataSkyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.getSkyId(), text)
    );
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

  public async getOptions(): Promise<
    SkyAutocompleteHarnessOption[] | undefined
  > {
    const optionHarnesses = await this.#getOptionHarnesses();

    if (optionHarnesses) {
      const options: SkyAutocompleteHarnessOption[] = [];

      for (const harness of optionHarnesses) {
        const harnessTestElement = await harness.host();

        const option: SkyAutocompleteHarnessOption = {
          textContent: await harnessTestElement.text(),
        };

        if (await harness.hasCustomTemplate()) {
          option.testElement = harnessTestElement;
        }

        options.push(option);
      }

      return options;
    }

    return;
  }

  public async selectOption(
    filters: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<void> {
    const optionHarnesses = await this.#getOptionHarnesses(filters);
    if (optionHarnesses && optionHarnesses.length > 0) {
      await optionHarnesses[0].click();
    }
  }

  public async getValue(): Promise<string> {
    return (await this.#getInputEl()).getProperty('value');
  }

  public async isDisabled(): Promise<boolean> {
    const disabled = await (await this.host()).getAttribute('disabled');
    return !!disabled;
  }

  public async isOpen(): Promise<boolean> {
    const overlay = await this.#getOverlay();
    return !!overlay;
  }

  public async isFocused(): Promise<boolean> {
    return (await this.#getInputEl()).isFocused();
  }

  public async clickAddButton(): Promise<void> {
    (await this.#getAddButton()).click();
  }

  public async clickShowMoreButton(): Promise<void> {
    const button = await this.#getShowMoreButton();
    await button.click();
  }

  async #getInputEl(): Promise<TestElement> {
    return (await this.#getInputHarness()).host();
  }

  async #getOptionHarnesses(
    filters?: SkyAutocompleteSearchResultHarnessFilters
  ): Promise<SkyAutocompleteSearchResultHarness[] | undefined> {
    const overlayHarness = await this.#getOverlay();
    return overlayHarness
      ? overlayHarness.queryHarnesses(
          SkyAutocompleteSearchResultHarness.with(filters || {})
        )
      : undefined;
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
}
