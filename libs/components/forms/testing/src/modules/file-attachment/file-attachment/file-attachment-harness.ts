import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyFileAttachmentHarnessFilters } from './file-attachment-harness-filters';

/**
 * Harness for interacting with a file drop component in tests.
 * @internal
 */
export class SkyFileAttachmentHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-attachment';

  #getButton = this.locatorFor('button.sky-file-attachment-btn');
  #getLabel = this.locatorFor('.sky-control-label');

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
   * Clicks the help inline button.
   */
  public async clickHelpInline(): Promise<void> {
    return await (await this.#getHelpInline()).click();
  }

  /**
   * Clicks the attach file button if it is visible. Throws an error otherwise.
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
   * CLicks the replace file button in default theme. Throws an error otherwise.
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
   * Clicks the uploaded file's name link to download it.
   */
  public async clickUploadedFile(): Promise<void> {
    try {
      const file = await this.locatorFor('a')();
      return await file.click();
    } catch {
      throw new Error('Unable to find uploaded file.');
    }
  }

  /**
   * Clicks the uploaded file's delete button.
   */
  public async clickUploadedFileDeleteButton(): Promise<void> {
    try {
      const deleteButton = await this.locatorFor(
        'button.sky-file-attachment-delete',
      )();
      return await deleteButton.click();
    } catch {
      throw new Error(
        "Unable to find uploaded file's delete button. Check if a file is uploaded.",
      );
    }
  }

  /**
   * Gets the accepted file types.
   */
  public async getAcceptedTypes(): Promise<string | null> {
    return await (
      await this.locatorFor('input[type="file"]')()
    ).getAttribute('accept');
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
   * Whether file attachment is disabled
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
   * Whether file attachment is has stacked enabled.
   */
  public async isStacked(): Promise<boolean> {
    return await (await this.host()).hasClass('sky-margin-stacked-lg');
  }

  async #getHelpInline(): Promise<SkyHelpInlineHarness> {
    const harness = await this.locatorForOptional(SkyHelpInlineHarness)();

    if (harness) {
      return harness;
    }

    throw Error('No help inline found.');
  }
}
