import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  standalone: true,
  name: 'skyInputBoxHintText',
})
export class SkyInputBoxHintTextPipe implements PipeTransform {
  public transform(
    hintText?: string,
    hostHintText?: string,
  ): string | undefined {
    if (hintText && hostHintText) {
      return `${hintText} ${hostHintText}`;
    }

    return hintText || hostHintText;
  }
}
