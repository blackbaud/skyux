import { Pipe, PipeTransform } from '@angular/core';

import { marked } from 'marked';

// let inlineParagraph = false;

// marked.use({
//   renderer: {
//     paragraph(args) {
//       console.log(args);
//       return inlineParagraph ? `${args.text}` : false;
//     },
//     // code(args) {
//     //   console.log('code:', args);
//     //   return ``;
//     // },
//     // codespan({ text }) {
//     //   return `<code class="sky-codespan">${text}</code>`;
//     // },
//   },
// });

@Pipe({
  name: 'skyMarkdown',
  pure: true,
})
export class SkyMarkdownPipe implements PipeTransform {
  public transform(
    value: string,
    parserStyle: 'block' | 'inline' = 'inline',
  ): string {
    // const options: MarkedOptions = {};

    // if (paragraphStyle === 'inline') {
    //   inlineParagraph = true;
    //   // options.renderer = new Renderer({
    //   //   renderer: {
    //   //     paragraph({ text }) {
    //   //       return `${text}`;
    //   //     },
    //   //   }
    //   // })
    // } else {
    //   inlineParagraph = false;
    // }

    return parserStyle === 'inline'
      ? (marked.parseInline(value) as string)
      : (marked.parse(value) as string);
  }
}
