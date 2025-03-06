import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsEscapeHtml',
})
export class SkyDocsEscapeHtmlPipe implements PipeTransform {
  public transform(value: string): string {
    return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
