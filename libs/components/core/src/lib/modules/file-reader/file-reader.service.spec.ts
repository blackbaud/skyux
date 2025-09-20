import { TestBed } from '@angular/core/testing';

import { SkyFileReaderService } from './file-reader.service';

describe('file-reader.service', () => {
  function setupTest(options?: {
    readFileWithStatus: 'abort' | 'error' | 'load';
  }): { fileReaderSvc: SkyFileReaderService } {
    const fileReaderSvc = TestBed.inject(SkyFileReaderService);

    const { readFileWithStatus } = options || { readFileWithStatus: 'load' };

    spyOn(window, 'FileReader').and.returnValue({
      addEventListener: (eventName: string, cb: (data?: unknown) => void) => {
        if (eventName === 'load' && readFileWithStatus === 'load') {
          cb({ target: { result: 'data:MOCK' } });
        } else {
          if (eventName === readFileWithStatus) {
            cb();
          }
        }
      },
      readAsDataURL: () => {
        /* */
      },
    } as unknown as FileReader);

    return { fileReaderSvc };
  }

  it('should read a file as data URL', async () => {
    const { fileReaderSvc } = setupTest();

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    const result = await fileReaderSvc.readAsDataURL(file);

    expect(result).toEqual('data:MOCK');
  });

  it('should reject on error', async () => {
    const { fileReaderSvc } = setupTest({ readFileWithStatus: 'error' });

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    await expectAsync(fileReaderSvc.readAsDataURL(file)).toBeRejectedWith(file);
  });

  it('should reject on abort', async () => {
    const { fileReaderSvc } = setupTest({ readFileWithStatus: 'abort' });

    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });

    await expectAsync(fileReaderSvc.readAsDataURL(file)).toBeRejectedWith(file);
  });
});
