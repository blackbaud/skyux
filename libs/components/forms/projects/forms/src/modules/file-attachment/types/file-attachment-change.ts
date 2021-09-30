import {
  SkyFileItem
} from '../file-item';

export interface SkyFileAttachmentChange {
  /**
   * Specifies the file that was added or removed.
   */
  file: SkyFileItem;
}
