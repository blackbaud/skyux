import { Pipe, PipeTransform } from '@angular/core';

import { marked } from 'marked';

@Pipe({
  name: 'skyMarkdown',
})
export class SkyMarkdownPipe implements PipeTransform {
  public transform(
    value: string,
    parserStyle: 'block' | 'inline' = 'inline',
  ): string {
    return parserStyle === 'inline'
      ? (marked.parseInline(value) as string)
      : (marked.parse(value) as string);
  }
}
