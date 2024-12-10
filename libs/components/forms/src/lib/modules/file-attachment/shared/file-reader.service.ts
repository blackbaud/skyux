import { Injectable } from '@angular/core';

/**
 * Wraps the FileReader API so it can be mocked in tests.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyFileReaderService {
  public async readFile(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
        resolve(event.target?.result as string);
      });

      reader.addEventListener('error', () => {
        reject(file);
      });

      reader.addEventListener('abort', () => {
        reject(file);
      });

      reader.readAsDataURL(file);
    });
  }
}
