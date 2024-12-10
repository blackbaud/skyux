import { Injectable } from '@angular/core';

/**
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

      reader.addEventListener('error', (event: ProgressEvent<FileReader>) => {
        reject(event.target?.error);
      });

      reader.readAsDataURL(file);
    });
  }
}
