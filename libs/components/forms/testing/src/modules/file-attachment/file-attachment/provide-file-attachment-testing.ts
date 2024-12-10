import { Provider } from '@angular/core';
import { SkyFileReaderService } from '@skyux/forms';

import { SkyFileReaderTestingService } from './file-reader-testing.service';

/**
 * Provides mocks for file attachment testing.
 * @internal
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   providers: [provideSkyFileAttachmentTesting()]
 * });
 * ```
 */
export function provideSkyFileAttachmentTesting(): Provider[] {
  return [
    SkyFileReaderTestingService,
    {
      provide: SkyFileReaderService,
      useClass: SkyFileReaderTestingService,
    },
  ];
}
