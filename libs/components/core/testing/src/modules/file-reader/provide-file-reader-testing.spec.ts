import { TestBed } from '@angular/core/testing';
import { SkyFileReaderService } from '@skyux/core';

import { SkyFileReaderTestingService } from './file-reader-testing.service';
import { provideSkyFileReaderTesting } from './provide-file-reader-testing';

describe('provideSkyFileReaderTesting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSkyFileReaderTesting()],
    });
  });

  it('should mock the service', () => {
    const actualSvc = TestBed.inject(SkyFileReaderService);

    expect(actualSvc instanceof SkyFileReaderTestingService).toBe(true);
  });

  it('should return file url', async () => {
    const file = new File([''], 'filename', { type: 'text/plain' });

    await expectAsync(
      TestBed.inject(SkyFileReaderService).readAsDataURL(file),
    ).toBeResolvedTo('data:text/plain;base64,MOCK_DATA');
  });
});
