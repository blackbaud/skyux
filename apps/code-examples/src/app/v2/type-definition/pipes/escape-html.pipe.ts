import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyEscapeHtml',
  pure: true,
})
export class SkyEscapeHtmlPipe implements PipeTransform {
  // readonly #sanitizer = inject(DomSanitizer);

  public transform(value: string): string {
    // return this.#sanitizer.bypassSecurityTrustHtml(
    //   string.replace(/</g, '&lt;'),
    // );

    return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
