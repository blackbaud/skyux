import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';

interface SkyLookupHarnessOption {
  textContent: string;
}

export class SkyLookupHarness extends ComponentHarness {
  // Do not use `sky-lookup` since the component may be included in a select-box component.
  public static hostSelector = '.sky-lookup';

  protected getInputEl = this.locatorFor('textarea.sky-lookup-input');

  #documentRootLocator = this.documentRootLocatorFactory();

  public static with(
    options: SkyLookupHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return new HarnessPredicate(SkyLookupHarness, options).addOption(
      'skyTestId',
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

  public async getOptions(): Promise<SkyLookupHarnessOption[]> {
    const overlayId = await (await this.getInputEl()).getAttribute('aria-owns');

    const optionEls = await this.#documentRootLocator.locatorForAll(
      `#${overlayId} .sky-autocomplete-result`
    )();

    const options = [];
    for (const optionEl of optionEls) {
      const option: SkyLookupHarnessOption = {
        textContent: await optionEl.text(),
      };
      options.push(option);
    }

    return options;
  }

  public async isFocused(): Promise<boolean> {
    const el = await this.getInputEl();
    return el.isFocused();
  }

  async #getSkyId(): Promise<string | null> {
    return (await this.host()).getAttribute('data-sky-id');
  }
}
