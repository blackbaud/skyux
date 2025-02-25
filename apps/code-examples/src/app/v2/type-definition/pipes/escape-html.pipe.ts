import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyEscapeHtml',
})
export class SkyEscapeHtmlPipe implements PipeTransform {
  public transform(value: string): string {
    return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
