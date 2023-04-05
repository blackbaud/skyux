import { SkyFileItem } from '../file-item';

export interface SkyFileAttachmentChange {
  /**
   * The file that was added. If the file was removed this property will be `undefined`.
   */
  file?: SkyFileItem;
}
