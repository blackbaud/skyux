import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import {
  SkyComponentHarness,
  SkyHarnessFilters,
  SkyOverlayHarness,
} from '@skyux/core/testing';

import { SkyAutocompleteInputHarness } from './autocomplete-input.harness';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SkyAutocompleteHarnessFilters extends SkyHarnessFilters {}

interface SkyAutocompleteHarnessOption {
  textContent: string;
}

export class SkyAutocompleteHarness extends SkyComponentHarness {
  public static hostSelector = '.sky-autocomplete';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getInputHarness = this.locatorFor(SkyAutocompleteInputHarness);

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
    const overlayHarness = await this.getOverlay();

    if (overlayHarness) {
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

  protected async getInputEl(): Promise<TestElement> {
    return (await this.#getInputHarness()).host();
  }

  protected async getOverlay(): Promise<SkyOverlayHarness | undefined> {
    const overlayId = await (await this.getInputEl()).getAttribute('aria-owns');
    return overlayId
      ? this.#documentRootLocator.locatorFor(
          SkyOverlayHarness.with({ id: overlayId })
        )()
      : undefined;
  }
}
