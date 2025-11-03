import { EventData, HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorHarness } from '../../form-error/form-error-harness';
import { SkyFormErrorsHarness } from '../../form-error/form-errors-harness';

import { SkyFileDropHarnessFilters } from './file-drop-harness-filters';
import { SkyFileDropLinkUploadHarness } from './file-drop-link-upload-harness';

/**
 * Harness for interacting with a file drop component in tests.
 */
export class SkyFileDropHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-drop';

  #getDropTarget = this.locatorFor('.sky-file-drop-target');
  #input = this.locatorFor('input[type="file"]');
  #fileUploadButton = this.locatorFor('button.sky-file-drop-target');
  #label = this.locatorFor('.sky-file-drop-label-text');
  #formErrors = this.locatorForAll(SkyFormErrorsHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFileDropHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFileDropHarnessFilters,
  ): HarnessPredicate<SkyFileDropHarness> {
    return SkyFileDropHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the file drop target.
   */
  public async clickFileDropTarget(): Promise<void> {
    return await (await this.#fileUploadButton()).click();
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return await (await this.#getHelpInline()).click();
  }

  /**
   * Clicks the link upload `Done` button'.
   */
  public async clickLinkUploadDoneButton(): Promise<void> {
    return await (await this.#getLinkUpload()).clickDoneButton();
  }

  /**
   * Enters text into the link upload input.
   */
  public async enterLinkUploadText(link: string): Promise<void> {
    return await (await this.#getLinkUpload()).enterText(link);
  }

  /**
   * Gets the accepted file types.
   */
  public async getAcceptedTypes(): Promise<string | null> {
    return await (await this.#input()).getAttribute('accept');
  }

  /**
   * Gets the custom form error.
   */
  public async getCustomError(
    errorName: string,
  ): Promise<SkyFormErrorHarness> {
    return await this.locatorFor(
      SkyFormErrorHarness.with({ errorName: errorName }),
    )();
  }

  /**
   * Gets the aria-label for the file upload button.
   */
  public async getFileUploadAriaLabel(): Promise<string | null> {
    return await (await this.#fileUploadButton()).getAttribute('aria-label');
  }

  /**
   * Gets the help inline popover content.
   */
  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverContent();
  }

  /**
   * Gets the help inline popover title.
   */
  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await (await this.#getHelpInline()).getPopoverTitle();
  }

  /**
   * Gets the hint text.
   */
  public async getHintText(): Promise<string> {
    return (
      await (await this.locatorFor('.sky-file-drop-hint-text')()).text()
    ).trim();
  }

  /**
   * Gets the label text.
   */
  public async getLabelText(): Promise<string> {
    return (await (await this.#label()).text()).trim();
  }

  /**
   * Gets the link upload aria-label.
   */
  public async getLinkUploadAriaLabel(): Promise<string | null> {
    return await (await this.#getLinkUpload()).getAriaLabel();
  }

  /**
   * Gets the link upload hint text.
   */
  public async getLinkUploadHintText(): Promise<string | undefined> {
    return await (await this.#getLinkUpload()).getHintText();
  }

  /**
   * Whether a custom form error has fired.
   */
  public async hasCustomError(errorName: string): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError(errorName);
  }

  /**
   * Whether the file type error has fired.
   */
  public async hasFileTypeError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('fileType');
  }

  /**
   * Whether the max file size error has fired.
   */
  public async hasMaxFileSizeError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('maxFileSize');
  }

  /**
   * Whether the min file size error has fired.
   */
  public async hasMinFileSizeError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('minFileSize');
  }

  /**
   * Whether the required error has fired.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('required');
  }

  /**
   * Whether the validate error from the customer validation has fired.
   */
  public async hasValidateFnError(): Promise<boolean> {
    return await (await this.#getFormErrors()).hasError('validate');
  }

  /**
   * Whether label text is hidden.
   */
  public async isLabelHidden(): Promise<boolean> {
    return await (
      await this.locatorFor('legend.sky-control-label')()
    ).hasClass('sky-screen-reader-only');
  }

  /**
   * Whether file drop is required.
   */
  public async isRequired(): Promise<boolean> {
    return await (await this.#label()).hasClass('sky-control-label-required');
  }

  /**
   * Whether file drop has stacked enabled.
   */
  public async isStacked(): Promise<boolean> {
    return await (await this.host()).hasClass('sky-form-field-stacked');
  }

  /**
   * Loads a single file.
   * Be sure to include `provideSkyFileReaderTesting` as a provider when calling this function in tests.
   *  @example
   * ```typescript
   * TestBed.configureTestingModule({
   *   providers: [provideSkyFileReaderTesting()]
   * });
   * ``
   */
  public async loadFile(file: File): Promise<void> {
    await this.#dropFiles([file]);
  }

  /**
   * Loads multiple files.
   * Be sure to include `provideSkyFileReaderTesting` as a provider when calling this function in tests.
   *  @example
   * ```typescript
   * TestBed.configureTestingModule({
   *   providers: [provideSkyFileReaderTesting()]
   * });
   * ``
   */
  public async loadFiles(files: File[] | null): Promise<void> {
    return await this.#dropFiles(files);
  }

  async #dropFiles(files: File[] | null): Promise<void> {
    const dropTarget = await this.#getDropTarget();

    type TestDataTransfer = DataTransfer & { [key: string]: EventData };

    const dataTransfer = new DataTransfer() as TestDataTransfer;

    files?.forEach((file) => {
      dataTransfer.items.add(file);
    });

    await dropTarget.dispatchEvent('drop', {
      dataTransfer,
    });
  }

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    return (await this.#formErrors())[1];
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }

  async #getLinkUpload(): Promise<SkyFileDropLinkUploadHarness> {
    const linkUpload = await this.locatorForOptional(
      SkyFileDropLinkUploadHarness,
    )();

    if (linkUpload) {
      return linkUpload;
    }

    throw new Error(
      'Link upload cannot be found. Set `allowLinks` property to `true`.',
    );
  }
}
