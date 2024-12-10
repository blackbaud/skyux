import { Injectable } from '@angular/core';
import { SkyFileReaderService } from '@skyux/forms';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyFileReaderTestingService extends SkyFileReaderService {
  public override async readFile(file: File): Promise<string> {
    return await new Promise((resolve) => {
      resolve(`data:${file.type};base64,`);
    });
  }
}
