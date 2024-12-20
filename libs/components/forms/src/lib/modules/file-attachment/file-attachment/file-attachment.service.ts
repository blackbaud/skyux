import { Injectable } from '@angular/core';

import { SkyFileItem } from '../shared/file-item';
import { SkyFileValidateFn } from '../shared/file-validate-function';

/**
 * @internal
 */
@Injectable()
export class SkyFileAttachmentService {
  // make it an array of SkyFileItem
  public checkFiles(
    files: FileList | SkyFileItem,
    minFileSize: number,
    maxFileSize: number,
    acceptedTypes?: string,
    validateFn?: SkyFileValidateFn,
  ): SkyFileItem[] {
    const fileResults: SkyFileItem[] = [];

    if (files instanceof FileList) {
      for (let index = 0; index < files.length; index++) {
        const fileItem = {
          file: files.item(index),
        } as SkyFileItem;

        fileResults.push(
          this.checkFile(
            fileItem,
            minFileSize,
            maxFileSize,
            acceptedTypes,
            validateFn,
          ),
        );
      }
    } else {
      fileResults.push(
        this.checkFile(
          files as SkyFileItem,
          minFileSize,
          maxFileSize,
          acceptedTypes,
          validateFn,
        ),
      );
    }
    return fileResults;
  }

  public checkFile(
    fileItem: SkyFileItem,
    minFileSize: number,
    maxFileSize: number,
    acceptedTypes?: string,
    validateFn?: SkyFileValidateFn,
  ): SkyFileItem {
    if (fileItem.file.size < minFileSize) {
      fileItem.errorType = 'minFileSize';
      fileItem.errorParam = minFileSize.toString();
      return fileItem;
    } else if (fileItem.file.size > maxFileSize) {
      fileItem.errorType = 'maxFileSize';
      fileItem.errorParam = maxFileSize.toString();
      return fileItem;
    } else if (this.fileTypeRejected(fileItem.file.type, acceptedTypes)) {
      fileItem.errorType = 'fileType';
      fileItem.errorParam = this.#getAcceptedTypesList(acceptedTypes);
      return fileItem;
    } else if (validateFn) {
      const errorParam = validateFn(fileItem);

      if (errorParam) {
        fileItem.errorType = 'validate';
        fileItem.errorParam = errorParam;
      }
      return fileItem;
    } else {
      return fileItem;
    }
  }

  /**
   * Returns `true` if a directory is found in the provided `files` parameter.
   */
  public hasDirectory(files: FileList): boolean {
    for (let index = 0; index < files.length; index++) {
      const file: any = files.item(index);
      if (
        file.webkitGetAsEntry &&
        file.webkitGetAsEntry() &&
        file.webkitGetAsEntry().isDirectory
      ) {
        return true;
      }
    }

    return false;
  }

  public fileTypeRejected(fileType: string, acceptedTypes?: string): boolean {
    if (!acceptedTypes) {
      return false;
    }

    if (!fileType) {
      return true;
    }

    const acceptedTypesUpper = acceptedTypes.toUpperCase();
    const typeArray = acceptedTypesUpper.split(',');

    return !this.#fileTypeInArray(typeArray, fileType.toUpperCase());
  }

  #fileTypeInArray(typeArray: string[], fileType: string): boolean {
    if (typeArray.indexOf(fileType) !== -1) {
      return true;
    }

    for (const type of typeArray) {
      const validSubtype = this.#getMimeSubtype(type);

      if (validSubtype === '*') {
        if (this.#getMimeMainType(type) === this.#getMimeMainType(fileType)) {
          return true;
        }
      }
    }

    return false;
  }

  #getAcceptedTypesList(rawTypes: string | undefined): string | undefined {
    return rawTypes
      ?.toUpperCase()
      .split(',')
      .map((type) => {
        const subType = this.#getMimeSubtype(type);
        return subType.startsWith('X-') ? subType.substr(2) : subType;
      })
      .join(', ');
  }

  #getMimeSubtype(type: string): string {
    return type.substr(type.indexOf('/') + 1, type.length);
  }

  #getMimeMainType(type: string): string {
    return type.substr(0, type.indexOf('/'));
  }
}
