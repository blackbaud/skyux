import { Provider } from '@angular/core';
import { provideSkyFileReaderTesting } from '@skyux/core/testing';

/**
 * Provides mocks for file attachment testing.
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   providers: [provideSkyFileAttachmentTesting()]
 * });
 * ```
 */
export function provideSkyFileAttachmentTesting(): Provider[] {
  return [provideSkyFileReaderTesting()];
}
