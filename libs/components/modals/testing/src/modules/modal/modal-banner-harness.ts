import { SkyComponentHarness } from '@skyux/core/testing';

/**
 * Harness for interacting with a modal banner component in tests.
 */
export class SkyModalBannerHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-modal-banner';

  /**
   * Gets the image source URL from the banner's background image style.
   * Returns `null` if no image source is set.
   */
  public async getImageSrc(): Promise<string | null> {
    const backgroundImage = await (
      await this.host()
    ).getCssValue('background-image');

    if (!backgroundImage || backgroundImage === 'none') {
      return null;
    }

    // The component sets background-image as url("${imageSrc}") with internal
    // double quotes escaped as \". Strip the url("...") wrapper and unescape.
    const match = backgroundImage.match(/^url\("([\s\S]*)"\)$/);
    if (!match) {
      return null;
    }

    return match[1].replaceAll('\\"', '"');
  }
}
