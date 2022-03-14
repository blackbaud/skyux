import { Injectable } from '@angular/core';

import { SkyFileItem } from './file-item';

/**
 * @internal
 */
@Injectable()
export class SkyFileItemService {
  public isFile(fileItem: SkyFileItem): boolean {
    const file = fileItem.file;

    /* tslint:disable */
    return (
      file &&
      file !== undefined &&
      file !== null &&
      file.size !== undefined &&
      file.size !== null
    );
    /* tslint:enable */
  }

  public isImage(fileItem: SkyFileItem): boolean {
    const fileTypeUpper = this.getFileTypeUpper(fileItem);
    const slashIndex = fileTypeUpper.indexOf('/');

    if (slashIndex >= 0) {
      switch (fileTypeUpper.substr(fileTypeUpper.indexOf('/') + 1)) {
        case 'BMP':
        case 'GIF':
        case 'JPEG':
        case 'PNG':
          return true;
        default:
          break;
      }
    }

    return false;
  }

  public getFileExtensionUpper(fileItem: SkyFileItem): string {
    let extension = '',
      name: string;

    /* istanbul ignore else */
    /* sanity check */
    if (fileItem) {
      const file = fileItem.file;
      if (file) {
        /* istanbul ignore next */
        name = file.name || '';
        /* istanbul ignore next */
        extension = name.substr(name.lastIndexOf('.')) || '';
      } else {
        extension = '';
      }
    }

    return extension.toUpperCase();
  }

  public getFileTypeUpper(fileItem: SkyFileItem): string {
    let fileType = '';
    /* istanbul ignore else */
    /* sanity check */
    if (fileItem) {
      const file = fileItem.file;
      if (file) {
        fileType = file.type || '';
      } else {
        fileType = '';
      }
    }

    return fileType.toUpperCase();
  }
}
