import { Pipe, PipeTransform } from '@angular/core';

import { marked } from 'marked';

marked.use({
  renderer: {
    // heading({ tokens, depth }) {
    //   const text = this.parser.parseInline(tokens);
    //   const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    //   return `
    //           <h${depth}>
    //             <a name="${escapedText}" class="anchor" href="#${escapedText}">
    //               <span class="header-link"></span>
    //             </a>
    //             ${text}
    //           </h${depth}>`;
    // },
    // code(args) {
    //   console.log('code:', args);
    //   return ``;
    // },
    codespan({ text }) {
      return `<code class="sky-codespan">${text}</code>`;
    },
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
