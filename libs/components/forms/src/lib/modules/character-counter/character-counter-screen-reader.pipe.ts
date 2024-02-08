import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyCharacterCounterScreenReader',
  standalone: true,
})
export class SkyCharacterCounterScreenReaderPipe implements PipeTransform {
  #previousAnnouncementPoint: number | undefined;

  public transform(
    characterCount: number | undefined,
    characterCountLimit: number | undefined,
  ): string {
    /* Safety check */
    /* istanbul ignore if */
    if (characterCount === undefined || characterCountLimit === undefined) {
      return '';
    }

    // We want to announce every 10 characters if we are within 50 of the limit or every 50 otherwise.
    const modulus =
      characterCountLimit - Math.floor(characterCount / 10) * 10 <= 50
        ? 10
        : 50;

    if (
      characterCount === characterCountLimit ||
      characterCount % modulus === 0 ||
      this.#previousAnnouncementPoint === undefined
    ) {
      this.#previousAnnouncementPoint = characterCount;
    } else {
      // We want the floor of the previous announcement and modulus in case the previous announcement wasn't an announcement point.
      const previousAnnouncementQuotient = Math.floor(
        this.#previousAnnouncementPoint / modulus,
      );
      // Lower limit of what announcement should have been made for the current count
      const currentAnnouncementQuotient = Math.floor(characterCount / modulus);
      // Next announcement that would be made if the current count increases
      const currentAnnouncementNextAnnouncement = Math.ceil(
        characterCount / modulus,
      );

      // Jump to the appropriate announcement point if the count jumps. For example, if going from 43 of 50 characters to 21 of 50 characters.
      if (
        currentAnnouncementQuotient !== previousAnnouncementQuotient &&
        currentAnnouncementNextAnnouncement !== previousAnnouncementQuotient
      ) {
        this.#previousAnnouncementPoint =
          Math.floor(characterCount / modulus) * modulus;
      }
    }

    return this.#previousAnnouncementPoint.toLocaleString();
  }
}
