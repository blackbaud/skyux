import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyHarnessUtility } from '@skyux/core/testing';
import { SkyErrorModalHarness } from '@skyux/errors/testing';
import { SkyFileDropHarness } from '@skyux/forms/testing';

import { SkyAvatarHarnessFilters } from './avatar-harness-filters';

async function isHidden(el: TestElement): Promise<boolean> {
  return (await el.getCssValue('display')) === 'none';
}

/**
 * Harness for interacting with an avatar component in tests.
 */
export class SkyAvatarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-avatar';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getFileDrop = this.locatorForOptional(SkyFileDropHarness);
  #errorModal =
    this.#documentRootLocator.locatorForOptional(SkyErrorModalHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyAvatarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyAvatarHarnessFilters,
  ): HarnessPredicate<SkyAvatarHarness> {
    return SkyAvatarHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the initials displayed when no image URL is specified.
   */
  public async getInitials(): Promise<string | undefined> {
    const initialsEl = await this.locatorFor('.sky-avatar-initials')();

    if (await isHidden(initialsEl)) {
      return undefined;
    }

    return initialsEl.text();
  }

  /**
   * Gets the avatar's current image URL.
   */
  public async getSrc(): Promise<string | undefined> {
    const imageEl = await this.locatorFor('.sky-avatar-image')();

    if (await isHidden(imageEl)) {
      return undefined;
    }

    return await SkyHarnessUtility.getBackgroundImageUrl(imageEl);
  }

  /**
   * Gets whether users can change the image.
   */
  public async getCanChange(): Promise<boolean> {
    return !!(await this.#getFileDrop());
  }

  /**
   * Simulates the user selecting or dropping an image onto the component.
   */
  public async changeAvatar(file: File): Promise<void> {
    const fileDrop = await this.#getFileDrop();

    if (!fileDrop) {
      throw new Error(
        'A new avatar cannot be selected because the canChange input is not set to true.',
      );
    }

    await fileDrop.dropFile(file);
  }

  /**
   * Gets whether an error indicating an invalid file type is displayed.
   */
  public async hasFileTypeError(): Promise<boolean> {
    const errorModal = await this.#errorModal();

    return !!(await errorModal?.getTitle())?.includes('File is not an image.');
  }

  /**
   * Gets whether an error indicating an invalid file size is displayed.
   */
  public async hasMaxSizeError(): Promise<boolean> {
    const errorModal = await this.#errorModal();

    return !!(await errorModal?.getTitle())?.includes('File is too large.');
  }

  /**
   * Closes the currently displayed error.
   */
  public async closeError(): Promise<void> {
    const errorModal = await this.#errorModal();

    if (!errorModal) {
      throw new Error('No error is currently displayed.');
    }

    await errorModal.clickCloseButton();
  }
}
