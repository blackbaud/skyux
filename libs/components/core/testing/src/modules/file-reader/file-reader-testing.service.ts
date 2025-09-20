import { Injectable } from '@angular/core';
import { SkyFileReaderService } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyFileReaderTestingService extends SkyFileReaderService {
  public override async readAsDataURL(file: File): Promise<string> {
    return await new Promise((resolve) => {
      resolve(`data:${file.type};base64,MOCK_DATA`);
    });
  }
}
