import { SkyFileItem } from '../file-item';

export interface SkyFileDropChange {
  /**
   * An array of files that were added or removed.
   */
  files: Array<SkyFileItem>;
  /**
   * An array of files that were rejected.
   */
  rejectedFiles: Array<SkyFileItem>;
}
