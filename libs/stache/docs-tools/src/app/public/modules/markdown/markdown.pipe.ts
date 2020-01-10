import {
  Pipe,
  PipeTransform
} from '@angular/core';

const marked = require('marked/lib/marked.js');

@Pipe({
  name: 'skyDocsMarkdown'
})
export class SkyDocsMarkdownPipe implements PipeTransform {

  public transform(markdown: string, parsingMode: 'inline' | 'block' = 'block'): string {
    if (!markdown) {
      return '';
    }

    if (parsingMode === 'inline') {
      return marked.inlineLexer(markdown, []);
    }

    return marked(markdown);
  }

}
