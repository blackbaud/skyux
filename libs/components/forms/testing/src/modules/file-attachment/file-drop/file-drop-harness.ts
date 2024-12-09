import { EventData, HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFileDropHarnessFilters } from './file-drop-harness-filters';

/**
 * Harness for interacting with a file drop component in tests.
 * @internal
 */
export class SkyFileDropHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-file-drop';

  #getDropTarget = this.locatorFor('.sky-file-drop-target');

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
}
