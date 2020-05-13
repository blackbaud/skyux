import {
  SkyFileItemErrorType
} from './file-item-error-type';

export interface SkyFileItem {
  file: File;
  url: string;
  errorType: SkyFileItemErrorType;
  errorParam: string;
}
