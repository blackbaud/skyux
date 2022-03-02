import { ElementRef, Injectable } from '@angular/core';

import { SkyAvatarSrc } from './avatar-src';

/**
 * @internal
 */
@Injectable()
export class SkyAvatarAdapterService {
  private blobUrl: string;

  public updateImage(elementRef: ElementRef, src: SkyAvatarSrc) {
    this.revokeBlobUrl();

    const el = elementRef.nativeElement;

    /*istanbul ignore else */
    if (el) {
      const imageEl = el.querySelector('.sky-avatar-image');

      /*istanbul ignore else */
      if (imageEl) {
        let url: string;

        if (src) {
          if (src instanceof File || src instanceof Blob) {
            url = this.createBlobUrl(src);
          } else {
            url = src;
          }
        }

        // Notice the quotes inside the `url` function. This ensures proper url escaping.
        imageEl.style.backgroundImage = url ? 'url("' + url + '")' : '';
      }
    }
  }

  public destroy() {
    this.revokeBlobUrl();
  }

  private createBlobUrl(src: Blob | File) {
    const url = URL.createObjectURL(src);

    // Keep the last blob URL around so we can revoke it later.
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
    this.blobUrl = url;
    return url;
  }

  private revokeBlobUrl() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = undefined;
    }
  }
}
