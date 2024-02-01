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
    const modulus = characterCountLimit - characterCount <= 50 ? 10 : 50;

    if (
      characterCount === characterCountLimit ||
      characterCount % modulus === 0
    ) {
      this.#previousAnnouncementPoint = characterCount;
      return characterCount.toLocaleString();
    } else if (this.#previousAnnouncementPoint === undefined) {
      this.#previousAnnouncementPoint = characterCount;
      return this.#previousAnnouncementPoint.toLocaleString();
    } else if (
      Math.floor(characterCount / modulus) ===
      Math.floor(this.#previousAnnouncementPoint / modulus)
    ) {
      return this.#previousAnnouncementPoint.toLocaleString();
    } else {
      return (Math.floor(characterCount / modulus) * modulus).toLocaleString();
    }
  }
}
