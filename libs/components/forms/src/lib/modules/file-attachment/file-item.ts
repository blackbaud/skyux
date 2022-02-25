import { SkyFileItemErrorType } from './file-item-error-type';

export interface SkyFileItem {
  /**
   * The object that was added or removed.
   */
  file: File;
  /**
   * The [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
   * for the file that was added or removed.
   */
  url: string;
  /**
   * The type of error that caused the file to be rejected.
   */
  errorType: SkyFileItemErrorType;
  /**
   * Additional parameters about the error that caused the file to be rejected.
   */
  errorParam: string;
}
