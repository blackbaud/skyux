import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFileItemHarnessFilters } from './file-item-harness-filters';

/**
 * Harness for interacting with a file item component in tests.
 */
export class SkyFileItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-item';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFileDropHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFileItemHarnessFilters,
  ): HarnessPredicate<SkyFileItemHarness> {
    return SkyFileItemHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the file name.
   */
  public async getFileName(): Promise<string | undefined> {
    return await (await this.locatorFor('strong')()).text();
  }

  /**
   * Gets the file size.
   */
  public async getFileSize(): Promise<string> {
    const size = await (await this.locatorFor('.sky-file-item-size')()).text();
    return size.substring(1, size.length - 1);
  }

  /**
   * Clicks the delete button.
   */
  public async clickDeleteButton(): Promise<void> {
    return await (await this.locatorFor('.sky-file-item-btn-delete')()).click();
  }
}
