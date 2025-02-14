import { Pipe, PipeTransform } from '@angular/core';

import { marked } from 'marked';

marked.use({
  renderer: {
    // code(args) {
    //   console.log('code:', args);
    //   return ``;
    // },
    // codespan({ text }) {
    //   return `<code class="sky-codespan">${text}</code>`;
    // },
  },
});

@Pipe({
  name: 'skyMarkdown',
  pure: true,
})
export class SkyMarkdownPipe implements PipeTransform {
  public transform(value: string): string {
    return marked.parse(value) as string;
  }
}
