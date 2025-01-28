import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness, SkyHarnessUtility } from '@skyux/core/testing';
import { SkyErrorModalHarness } from '@skyux/errors/testing';
import { SkyFileDropHarness } from '@skyux/forms/testing';

import { SkyAvatarHarnessFilters } from './avatar-harness-filters';

const WAIT_INTERVAL = 10;
const WAIT_TIMEOUT = 3000;

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

    return await initialsEl.text();
  }

  /**
   * Gets the avatar's current image URL or Blob.
   */
  public async getSrc(): Promise<string | Blob | undefined> {
    const url = await this.#getImageUrl();

    if (url?.startsWith('blob:')) {
      return await (await fetch(url)).blob();
    }

    return url;
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
  public async dropAvatarFile(
    file: File,
    waitForChange?: boolean,
  ): Promise<void> {
    const fileDrop = await this.#getFileDrop();

    if (!fileDrop) {
      throw new Error(
        'A new avatar cannot be selected because the canChange input is not set to true.',
      );
    }

    if (waitForChange) {
      await this.#dropAndWait(fileDrop, file);
    } else {
      await fileDrop.loadFile(file);
    }
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

  async #getImageUrl(): Promise<string | undefined> {
    const imageEl = await this.locatorFor('.sky-avatar-image')();

    if (await isHidden(imageEl)) {
      return undefined;
    }

    return await SkyHarnessUtility.getBackgroundImageUrl(imageEl);
  }

  async #dropAndWait(fileDrop: SkyFileDropHarness, file: File): Promise<void> {
    const currentUrl = await this.#getImageUrl();

    await fileDrop.loadFile(file);

    return await new Promise<void>((resolve, reject) => {
      const checkForFileChange = async (attempts: number): Promise<void> => {
        if ((await this.#getImageUrl()) !== currentUrl) {
          resolve();
        } else if (attempts * WAIT_INTERVAL < WAIT_TIMEOUT) {
          setTimeout(
            () => void checkForFileChange(attempts + 1),
            WAIT_INTERVAL,
          );
        } else {
          reject(
            new Error(
              'The avatar src did not change within the expected time span',
            ),
          );
        }
      };

      void checkForFileChange(0);
    });
  }
}
