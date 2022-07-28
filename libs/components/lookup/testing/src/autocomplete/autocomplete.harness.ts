import {
  ComponentHarness,
  HarnessPredicate,
  TestElement,
} from '@angular/cdk/testing';
import { SkyOverlayHarness } from '@skyux/core/testing';

import { SkyHarnessFilters } from '../lookup/harness-filters';

import { SkyAutocompleteInputHarness } from './autocomplete-input.harness';

interface SkyAutocompleteHarnessFilters extends SkyHarnessFilters {}

interface SkyAutocompleteHarnessOption {
  textContent: string;
}

export class SkyAutocompleteHarness extends ComponentHarness {
  public static hostSelector = '.sky-autocomplete';

  protected getInputHarness = this.locatorFor(SkyAutocompleteInputHarness);

  protected async getInputEl(): Promise<TestElement> {
    return (await this.getInputHarness()).host();
  }

  #documentRootLocator = this.documentRootLocatorFactory();

  public static with(
    options: SkyAutocompleteHarnessFilters
  ): HarnessPredicate<SkyAutocompleteHarness> {
    return new HarnessPredicate(SkyAutocompleteHarness, options).addOption(
      'dataSkyId',
      options.dataSkyId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.#getSkyId(), text)
    );
  }

  public async blur(): Promise<void> {
    return (await this.getInputEl()).blur();
  }

  public async enterText(value: string): Promise<void> {
    const el = await this.getInputEl();
    await el.focus();
    await el.clear();
    await el.sendKeys(value);
  }

  public async focus(): Promise<void> {
    return (await this.getInputEl()).focus();
  }

  public async getOptions(): Promise<
    SkyAutocompleteHarnessOption[] | undefined
  > {
    const overlayId = await (await this.getInputEl()).getAttribute('aria-owns');

    if (overlayId) {
      const overlayHarness = await this.#documentRootLocator.locatorFor(
        SkyOverlayHarness.with({ id: overlayId })
      )();

      const optionEls = await overlayHarness.queryAll(
        '.sky-autocomplete-result'
      );

      const options = [];
      for (const optionEl of optionEls) {
        const option: SkyAutocompleteHarnessOption = {
          textContent: await optionEl.text(),
        };
        options.push(option);
      }

      return options;
    }

    return;
  }

  public async isFocused(): Promise<boolean> {
    return (await this.getInputEl()).isFocused();
  }

  async #getSkyId(): Promise<string | null> {
    return (await this.host()).getAttribute('data-sky-id');
  }
}
