import { Component, input } from '@angular/core';

import { SkyBlockquote } from '../blockquote';

@Component({
  selector: 'sky-blockquote-test',
  imports: [SkyBlockquote],
  template: `
    <sky-blockquote [author]="author()" [quoteSource]="quoteSource()">
      Sample testimonial
    </sky-blockquote>
  `,
})
export class SkyBlockquoteTestComponent {
  public readonly author = input<string>();
  public readonly quoteSource = input<string>();
}
