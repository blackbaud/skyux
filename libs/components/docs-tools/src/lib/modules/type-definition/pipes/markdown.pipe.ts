import { Pipe, PipeTransform } from '@angular/core';

import { Tokens, marked } from 'marked';

const renderer = {
  codespan(token: Tokens.Codespan): string {
    return `<code class="sky-docs-codespan">${token.text}</code>`;
  },
};

marked.use({
  renderer,
});

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsMarkdown',
})
export class SkyDocsMarkdownPipe implements PipeTransform {
  public transform(
    value: string,
    parserStyle: 'block' | 'inline' = 'inline',
  ): string {
    return parserStyle === 'inline'
      ? (marked.parseInline(value) as string)
      : (marked.parse(value) as string);
  }
}
