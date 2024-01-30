import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyCharacterCounterScreenReader',
  standalone: true,
})
export class SkyCharacterCounterScreenReaderPipe implements PipeTransform {
  #hasFocus = false;

  public transform(
    characterCount: number | undefined,
    characterCountLimit: number | undefined,
    hasFocus: boolean,
  ): string {
    /* Safety check */
    /* istanbul ignore if */
    if (characterCount === undefined || characterCountLimit === undefined) {
      return '';
    }

    // We want to announce every 10 characters if we are within 50 of the limit or every 50 otherwise.
    const modulus = characterCountLimit - characterCount <= 50 ? 10 : 50;
    let returnString = '';

    // We want to clear the screen reader when focus is lost - no matter the current count
    if (!hasFocus && this.#hasFocus) {
      returnString = '';
    } else if (
      (!this.#hasFocus && hasFocus) ||
      characterCount === characterCountLimit ||
      characterCount % modulus === 0
    ) {
      returnString = characterCount.toLocaleString();
    }

    this.#hasFocus = hasFocus;
    return returnString;
  }
}
