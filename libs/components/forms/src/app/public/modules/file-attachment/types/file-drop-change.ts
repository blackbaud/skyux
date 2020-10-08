import {
  SkyFileItem
} from '../file-item';

export interface SkyFileDropChange {
  /**
   * Specifies an array of files that were added or removed.
   */
  files: Array<SkyFileItem>;
  /**
   * Specifies an array of files that were rejected.
   */
  rejectedFiles: Array<SkyFileItem>;
}
