import { Provider } from '@angular/core';
import { SkyFileReaderService } from '@skyux/forms';

import { SkyFileReaderTestingService } from './file-reader-testing.service';

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
  return [
    {
      provide: SkyFileReaderService,
      useClass: SkyFileReaderTestingService,
    },
  ];
}
