import { Provider } from '@angular/core';
import { SkyFileReaderService } from '@skyux/core';

import { SkyFileReaderTestingService } from './file-reader-testing.service';

/**
 * Provides mocks for file reader testing.
 * @internal
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   providers: [provideSkyFileReaderTesting()]
 * });
 * ```
 */
export function provideSkyFileReaderTesting(): Provider[] {
  return [
    SkyFileReaderTestingService,
    {
      provide: SkyFileReaderService,
      useClass: SkyFileReaderTestingService,
    },
  ];
}
