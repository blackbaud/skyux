import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyCharacterCounterScreenReader',
  standalone: true,
})
export class SkyCharacterCounterScreenReaderPipe implements PipeTransform {
  public transform(
    characterCount: number,
    characterCountLimit: number,
    alwaysAnnounce = false,
  ): string {
    // We want to announce every 10 characters if we are within 50 of the limit or every 50 otherwise.
    const modulus = characterCountLimit - characterCount <= 50 ? 10 : 50;

    if (
      alwaysAnnounce ||
      characterCount === characterCountLimit ||
      characterCount % modulus === 0
    ) {
      return characterCount.toLocaleString();
    } else {
      return '';
    }
  }
}
