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

  it('should mock the service', async () => {
    const mockSvc = TestBed.inject(SkyFileReaderTestingService);
    const actualSvc = TestBed.inject(SkyFileReaderService);

    const mockSpy = spyOn(mockSvc, 'readFile').and.callThrough();
    const file = new File([''], 'test.txt');

    await actualSvc.readFile(file);

    expect(mockSpy).toHaveBeenCalledWith(file);
  });
});
