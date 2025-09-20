import { SkyFileItem } from '../shared/file-item';

export interface SkyFileDropChange {
  /**
   * The array of files that were added or removed.
   */
  files: SkyFileItem[];
  /**
   * The array of files that were rejected.
   */
  rejectedFiles: SkyFileItem[];
}
