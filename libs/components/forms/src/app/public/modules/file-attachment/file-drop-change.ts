import {
  SkyFileItem
} from './file-item';

export interface SkyFileDropChange {
  files: Array<SkyFileItem>;
  rejectedFiles: Array<SkyFileItem>;
}
