import { EventData, HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFormErrorsHarness } from '../../form-error/form-errors-harness';

import { SkyFileAttachmentHarnessFilters } from './file-attachment-harness-filters';

type TestDataTransfer = DataTransfer & { [key: string]: EventData };

/**
 * Harness for interacting with a file attachment component in tests.
 */
export class SkyFileAttachmentHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-attachment';

  #getButton = this.locatorFor('button.sky-file-attachment-btn');
  #getLabel = this.locatorFor('.sky-control-label');
  #input = this.locatorFor('input[type="file"]');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFileAttachmentHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFileAttachmentHarnessFilters,
  ): HarnessPredicate<SkyFileAttachmentHarness> {
    return SkyFileAttachmentHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the attach file button if it is visible.
   */
  public async clickAttachFileButton(): Promise<void> {
    try {
      const button = await this.#getButton();
      if ((await button.text()).trim() === 'Replace file') {
        throw new Error();
      }
      return await button.click();
    } catch {
      throw new Error(
        'Cannot click Attach file button, there is currently a file attached.',
      );
    }
  }

  /**
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return await (await this.#getHelpInline()).click();
  }

  /**
   * Clicks the replace file button in default theme.
   */
  public async clickReplaceFileButton(): Promise<void> {
    try {
      const button = await this.#getButton();
      if ((await button.text()).trim() !== 'Replace file') {
        throw new Error();
      }
      return await button.click();
    } catch {
      throw new Error('Cannot click Replace file button, it is not visible.');
    }
  }

  /**
   * Clicks the attached file to download it.
   */
  public async clickAttachedFile(): Promise<void> {
    try {
      const file = await this.locatorFor('a')();
      return await file.click();
    } catch {
      throw new Error('Unable to find the attached file.');
    }
  }

  /**
   * Clicks the attached file's delete button.
   */
  public async clickAttachedFileDeleteButton(): Promise<void> {
    try {
      const deleteButton = await this.locatorFor(
        'button.sky-file-attachment-delete',
      )();
      return await deleteButton.click();
    } catch {
      throw new Error(
        "Unable to find attached file's delete button. Check if a file is attached.",
      );
    }
  }

  /**
   * Gets the accepted file types.
   */
  public async getAcceptedTypes(): Promise<string | null> {
    return await (await this.#input()).getAttribute('accept');
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
      await (await this.locatorFor('.sky-file-attachment-hint-text')()).text()
    ).trim();
  }

  /**
   * Gets the file attachment label.
   */
  public async getLabelText(): Promise<string> {
    return (await (await this.#getLabel()).text()).trim();
  }

  /**
   * Whether a custom error has fired.
   */
  public async hasCustomError(errorName: string): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError(errorName);
  }

  /**
   * Whether the wrong file type error has fired.
   */
  public async hasFileTypeError(): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError('fileType');
  }

  /**
   * Whether the max file size error has fired.
   */
  public async hasMaxFileSizeError(): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError('maxFileSize');
  }

  /**
   * Whether the min file size error has fired.
   */
  public async hasMinFileSizeError(): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError('minFileSize');
  }

  /**
   * Whether the required error has fired.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#getFormErrors())?.hasError('required');
  }

  /**
   * Whether file attachment is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.#getButton()).getAttribute('disabled')) !== null;
  }

  /**
   * Whether file attachment is required.
   */
  public async isRequired(): Promise<boolean> {
    return await (
      await this.#getLabel()
    ).hasClass('sky-control-label-required');
  }

  /**
   * Whether file attachment has stacked enabled.
   */
  public async isStacked(): Promise<boolean> {
    return await (await this.host()).hasClass('sky-form-field-stacked');
  }

  /**
   * Attaches a file.
   * Be sure to include `provideSkyFileReaderTesting` as a provider when calling this function in tests.
   *  @example
   * ```typescript
   * TestBed.configureTestingModule({
   *   providers: [provideSkyFileReaderTesting()]
   * });
   * ```
   */
  public async attachFile(file: File): Promise<void> {
    return await this.#dropFile(file);
  }

  async #dropFile(file: File): Promise<void> {
    const attachLocation = await this.locatorFor(
      '.sky-file-attachment-upload',
    )();

    const dataTransfer = new DataTransfer() as TestDataTransfer;
    dataTransfer.items.add(file);

    return await attachLocation.dispatchEvent('drop', {
      dataTransfer,
    });
  }

  async #getFormErrors(): Promise<SkyFormErrorsHarness> {
    return await this.locatorFor(SkyFormErrorsHarness)();
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
