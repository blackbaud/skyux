import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { SkyFileItemHarnessFilters } from './file-item-harness-filters';

/**
 * Harness for interacting with a file item component in tests.
 */
export class SkyFileItemHarness extends ComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFileItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFileItemHarnessFilters,
  ): HarnessPredicate<SkyFileItemHarness> {
    return new HarnessPredicate(SkyFileItemHarness, filters).addOption(
      'fileName',
      filters.fileName,
      async (harness, fileName) => {
        const harnessFileName = await harness.getFileName();
        return await HarnessPredicate.stringMatches(harnessFileName, fileName);
      },
    );
  }

  /**
   * Clicks the delete button.
   */
  public async clickDeleteButton(): Promise<void> {
    return await (await this.locatorFor('.sky-file-item-btn-delete')()).click();
  }

  /**
   * Gets the file name.
   */
  public async getFileName(): Promise<string> {
    return await (await this.locatorFor('.sky-file-item-name')()).text();
  }

  /**
   * Gets the file size.
   */
  public async getFileSize(): Promise<string> {
    const size = await (await this.locatorFor('.sky-file-item-size')()).text();
    return size.substring(1, size.length - 1);
  }
}
