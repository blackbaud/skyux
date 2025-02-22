import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * @internal
 */
@Pipe({
  name: 'skySafeHtml',
  pure: true,
})
export class SkySafeHtmlPipe implements PipeTransform {
  readonly #sanitizer = inject(DomSanitizer);

  public transform(string: string): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(
      string.replace(/</g, '&lt;'),
    );
  }
}
