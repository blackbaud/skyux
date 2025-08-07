import { ElementRef, Injectable } from '@angular/core';

import { SkyAvatarSrc } from './avatar-src';

/**
 * @internal
 */
@Injectable()
export class SkyAvatarAdapterService {
  #blobUrl: string | undefined;

  public updateImage(elementRef: ElementRef, src: SkyAvatarSrc): void {
    this.#revokeBlobUrl();

    const el = elementRef.nativeElement;

    /*istanbul ignore else */
    if (el) {
      const imageEl = el.querySelector('.sky-avatar-image');

      /*istanbul ignore else */
      if (imageEl) {
        let url = src;

        if (src instanceof File || src instanceof Blob) {
          url = this.#createBlobUrl(src);
        }

        // Notice the quotes inside the `url` function. This ensures proper url escaping.
        imageEl.style.backgroundImage = 'url("' + url + '")';
      }
    }
  }

  public destroy(): void {
    this.#revokeBlobUrl();
  }

  #createBlobUrl(src: Blob | File): string {
    const url = URL.createObjectURL(src);

    // Keep the last blob URL around so we can revoke it later.
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    this.#blobUrl = url;
    return url;
  }

  #revokeBlobUrl(): void {
    if (this.#blobUrl) {
      URL.revokeObjectURL(this.#blobUrl);
      this.#blobUrl = undefined;
    }
  }
}
