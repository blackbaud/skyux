import { TestBed } from '@angular/core/testing';
import { SkyFileReaderService } from '@skyux/forms';

import { SkyFileReaderTestingService } from './file-reader-testing.service';
import { provideSkyFileAttachmentTesting } from './provide-file-attachment-testing';

describe('provideFileAttachmentTesting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyFileAttachmentTesting()],
    });
  });

  it('should mock the service', () => {
    const actualSvc = TestBed.inject(SkyFileReaderService);

    expect(actualSvc instanceof SkyFileReaderTestingService).toBe(true);
  });

  it('should return file url', async () => {
    const file = new File([''], 'filename', { type: 'text/plain' });

    await expectAsync(
      TestBed.inject(SkyFileReaderService).readFile(file),
    ).toBeResolvedTo('data:text/plain;base64,');
  });
});
