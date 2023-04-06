import { SkyFileItem } from '../file-item';

export interface SkyFileAttachmentChange {
  /**
   * The file that was added, or undefined if the file was removed.
   */
  file?: SkyFileItem;
}
