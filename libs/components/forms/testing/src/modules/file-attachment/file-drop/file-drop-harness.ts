import { EventData, HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

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
  #label = this.locatorFor('span.sky-file-drop-label');
  #formErrors = this.locatorFor(SkyFormErrorsHarness);

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
   * Gets the accepted file types.
   */
  public async getAcceptedTypes(): Promise<string | null> {
    return await (await this.#input()).getAttribute('accept');
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
    const content = await (await this.#getHelpInline()).getPopoverContent();

    return content as string | undefined;
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
   * Gets the upload link aria-label.
   */
  public async getUploadLinkAriaLabel(): Promise<string | undefined> {
    return await (await this.#getLinkUpload()).getAriaLabel();
  }

  /**
   * Gets the upload link hint text.
   */
  public async getUploadLinkHintText(): Promise<string | undefined> {
    return await (await this.#getLinkUpload()).getHintText();
  }

  /**
   * Clicks the upload link `done` button.
   */
  public async clickUploadLinkDoneButton(): Promise<void> {
    if (await (await this.#getLinkUpload()).isDisabled()) {
      throw new Error('Done button is disabled and cannot be clicked.');
    }
    return await (await this.#getLinkUpload()).clickButton();
  }

  /**
   * Uploads a link.
   */
  public async uploadLink(link: string): Promise<void> {
    return await (await this.#getLinkUpload()).enterLink(link);
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
    return await (await this.host()).hasClass('sky-margin-stacked-lg');
  }

  /**
   * Whether the required error has fired.
   */
  public async hasRequiredError(): Promise<boolean> {
    return await (await this.#formErrors()).hasError('required');
  }

  /**
   * Whether the file type error has fired.
   */
  public async hasFileTypeError(): Promise<boolean> {
    return await (await this.#formErrors()).hasError('fileType');
  }

  /**
   * Whether the max file size error has fired.
   */
  public async hasMaxFileSizeError(): Promise<boolean> {
    return await (await this.#formErrors()).hasError('maxFileSize');
  }

  /**
   * Whether the min file size error has fired.
   */
  public async hasMinFileSizeError(): Promise<boolean> {
    return await (await this.#formErrors()).hasError('minFileSize');
  }

  /**
   * Whether the custom validation error has fired.
   */
  public async hasCustomValidationError(): Promise<boolean> {
    return await (await this.#formErrors()).hasError('validate');
  }

  /**
   * Drops a file onto the component's drop target.
   */
  public async dropFile(file: File): Promise<void> {
    await this.#dropFiles([file]);
  }

  // Consider making this public when we finalize this harness's public API.
  async #dropFiles(files: File[]): Promise<void> {
    const dropTarget = await this.#getDropTarget();

    const fileList = {
      item: (index: number): File => files[index],
      length: files.length,
    };

    await dropTarget.dispatchEvent('drop', {
      dataTransfer: {
        files: fileList as unknown as EventData,
      },
    });
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
