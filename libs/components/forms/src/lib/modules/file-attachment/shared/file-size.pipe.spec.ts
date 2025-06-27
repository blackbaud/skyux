import { TestBed } from '@angular/core/testing';
import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyFileSizePipe } from './file-size.pipe';

describe('File size pipe', () => {
  let fileSizePipe: SkyFileSizePipe;

  function validateFormatted(
    value: number | string | undefined | null,
    expected: string,
  ): void {
    const result = fileSizePipe.transform(value);

    expect(result).toBe(expected);
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [SkyFileSizePipe],
    });

    fileSizePipe = new SkyFileSizePipe(TestBed.inject(SkyLibResourcesService));
  });

  it('should format bytes', function () {
    validateFormatted(1, '1 byte');
    validateFormatted(100, '100 bytes');
    validateFormatted(999, '999 bytes');
    validateFormatted('1', '1 byte');
    validateFormatted('100', '100 bytes');
    validateFormatted('999', '999 bytes');
  });

  it('should format kilobytes', function () {
    validateFormatted(1000, '1,000 bytes');
    validateFormatted(1024, '1 KB');
    validateFormatted(102400, '100 KB');
    validateFormatted(1022976, '999 KB');
    validateFormatted('1000', '1,000 bytes');
    validateFormatted('1024', '1 KB');
    validateFormatted('102400', '100 KB');
    validateFormatted('1022976', '999 KB');
  });

  it('should format megabytes', function () {
    validateFormatted(1048575, '1,023 KB');
    validateFormatted(1048576, '1 MB');
    validateFormatted(1992300, '1.9 MB');
    validateFormatted(104857600, '100 MB');
    validateFormatted(1048471150, '999.9 MB');
    validateFormatted('1048575', '1,023 KB');
    validateFormatted('1048576', '1 MB');
    validateFormatted('1992300', '1.9 MB');
    validateFormatted('104857600', '100 MB');
    validateFormatted('1048471150', '999.9 MB');
  });

  it('should format gigabytes', function () {
    validateFormatted(1073741823, '1,023.9 MB');
    validateFormatted(1073741824, '1 GB');
    validateFormatted(107374182400, '100 GB');
    validateFormatted(1073634449818, '999.9 GB');
    validateFormatted('1073741823', '1,023.9 MB');
    validateFormatted('1073741824', '1 GB');
    validateFormatted('107374182400', '100 GB');
    validateFormatted('1073634449818', '999.9 GB');
  });

  it('should format values over 1,000 gigabytes as gigabytes', function () {
    validateFormatted(1073741824000, '1,000 GB');
    validateFormatted(10737310865818, '9,999.9 GB');
    validateFormatted('1073741824000', '1,000 GB');
    validateFormatted('10737310865818', '9,999.9 GB');
  });

  it('should return an empty string when the input is null or undefined', function () {
    validateFormatted(undefined, '');
    validateFormatted(null, '');
  });
});
