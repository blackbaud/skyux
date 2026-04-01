import { Component, computed, input } from '@angular/core';

/**
 * Specifies content to display at the top of the modal. The content extends
 * the full width of the modal without any padding or margin. In general, only
 * use a banner when the modal's `headingHidden` input is set to `true`.
 */
@Component({
  selector: 'sky-modal-banner',
  host: {
    '[class.sky-modal-banner-with-image]': 'backgroundImage()',
    '[style.background-image]': 'backgroundImage()',
  },
  templateUrl: './modal-banner.component.html',
  styleUrl: './modal-banner.component.scss',
})
export class SkyModalBannerComponent {
  /**
   * The banner image to display at the top of the modal. To fit the allotted
   * space, the image must have a 5:3 aspect ratio. If it is wider, extra space
   * appears under the image. If it is narrower, the bottom of the image is
   * cropped.
   */
  public readonly imageSrc = input('');

  protected readonly backgroundImage = computed(() => {
    const imageSrc = this.imageSrc();
    return imageSrc ? `url("${imageSrc.replaceAll('"', '\\"')}")` : null;
  });
}
