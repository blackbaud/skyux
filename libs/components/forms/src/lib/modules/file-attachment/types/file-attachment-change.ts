import { SkyFileItem } from '../file-item';

export interface SkyFileAttachmentChange {
  /**
   * The file that was added or removed.
   */
  file: SkyFileItem;
}
