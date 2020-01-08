import {
  Injectable
} from '@angular/core';

import {
  SkyFileItem
} from './file-item';

@Injectable()
export class SkyFileAttachmentService {

  public checkFiles(files: FileList, minFileSize: number, maxFileSize: number, acceptedTypes: string, validateFn: Function): SkyFileItem[] {
    let fileResults: SkyFileItem[] = [];

    for (let index = 0; index < files.length; index++) {
      let fileItem = {
        file: files.item(index)
      } as SkyFileItem;

      if (fileItem.file.size < minFileSize) {
        fileItem.errorType = 'minFileSize';
        fileItem.errorParam = minFileSize.toString();
        fileResults.push(fileItem);

      } else if (fileItem.file.size > maxFileSize) {
        fileItem.errorType = 'maxFileSize';
        fileItem.errorParam = maxFileSize.toString();
        fileResults.push(fileItem);

      } else if (this.fileTypeRejected(fileItem.file.type, acceptedTypes)) {
        fileItem.errorType = 'fileType';
        fileItem.errorParam = acceptedTypes;
        fileResults.push(fileItem);

      } else if (validateFn) {
        let errorParam = validateFn(fileItem);

        if (!!errorParam) {
          fileItem.errorType = 'validate';
          fileItem.errorParam = errorParam;
        }
        fileResults.push(fileItem);

      } else {
        fileResults.push(fileItem);
      }
    }
    return fileResults;
  }

  /**
   * Returns `true` if a directory is found in the provided `files` parameter.
   */
  public hasDirectory(files: FileList): boolean {
    for (let index = 0; index < files.length; index++) {
      const file: any = files.item(index);
      if (file.webkitGetAsEntry && file.webkitGetAsEntry() && file.webkitGetAsEntry().isDirectory) {
        return true;
      }
    }

    return false;
  }

  public fileTypeRejected(fileType: string, acceptedTypes: string): boolean {
    if (!acceptedTypes) {
      return false;
    }

    if (!fileType) {
      return true;
    }

    let acceptedTypesUpper = acceptedTypes.toUpperCase();
    let typeArray = acceptedTypesUpper.split(',');

    return !this.fileTypeInArray(typeArray, fileType.toUpperCase());
  }

  private fileTypeInArray(typeArray: string[], fileType: string): boolean {
    if (typeArray.indexOf(fileType) !== -1) {
      return true;
    }

    for (let index = 0; index < typeArray.length; index++) {
      const type = typeArray[index];
      const validSubtype = this.getMimeSubtype(type);

      if (validSubtype === '*') {
        if (this.getMimeMainType(type) === this.getMimeMainType(fileType)) {
          return true;
        }
      }
    }

    return false;
  }

  private getMimeSubtype(type: string): string {
    return type.substr(type.indexOf('/') + 1, type.length);
  }

  private getMimeMainType(type: string): string {
    return type.substr(0, type.indexOf('/'));
  }
}
