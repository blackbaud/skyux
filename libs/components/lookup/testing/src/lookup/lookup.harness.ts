import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyLookupHarnessFilters } from './lookup-harness-filters';

export class SkyLookupHarness extends ComponentHarness {
  public static hostSelector = 'sky-lookup';

  protected getInputEl = this.locatorFor('textarea.sky-lookup-input');

  public static with(
    options: SkyLookupHarnessFilters
  ): HarnessPredicate<SkyLookupHarness> {
    return new HarnessPredicate(SkyLookupHarness, options).addOption(
      'skyTestId',
      options.skyTestId,
      (harness, text) =>
        HarnessPredicate.stringMatches(harness.getSkyId(), text)
    );
  }

  /**
   * Whether the form control has been touched. Returns "null"
   * if no form control is set up.
   */
  async isControlTouched(): Promise<boolean | null> {
    if (!(await this.#hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-touched');
  }

  /**
   * Whether the form control is dirty. Returns "null"
   * if no form control is set up.
   */
  async isControlDirty(): Promise<boolean | null> {
    if (!(await this.#hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-dirty');
  }

  /**
   * Whether the form control is valid. Returns "null"
   * if no form control is set up.
   */
  async isControlValid(): Promise<boolean | null> {
    if (!(await this.#hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-valid');
  }

  /**
   * Whether the form control is pending validation. Returns "null"
   * if no form control is set up.
   */
  async isControlPending(): Promise<boolean | null> {
    if (!(await this.#hasFormControl())) {
      return null;
    }
    return (await this.host()).hasClass('ng-pending');
  }

  async getControl() {
    return await this.host();
  }

  // What can a end user do?
  // set value
  // get value
  // is disabled?

  // open showmore
  // select result

  protected async getSkyId(): Promise<string | null> {
    const host = await this.host();
    console.log('eh?', host.matchesSelector('[data-sky-id]="lookup_1"'));
    return host.getAttribute('data-sky-id');
  }

  /**
   * Checks whether the form-field control has set up a form control.
   */
  async #hasFormControl(): Promise<boolean> {
    const hostEl = await this.host();

    // If no form "NgControl" is bound to the form-field control, the form-field
    // is not able to forward any control status classes. Therefore if either the
    // "ng-touched" or "ng-untouched" class is set, we know that it has a form control
    const [isTouched, isUntouched] = await Promise.all([
      hostEl.hasClass('ng-touched'),
      hostEl.hasClass('ng-untouched'),
    ]);
    return isTouched || isUntouched;
  }
}
