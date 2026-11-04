import { Component, input } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

/**
 * Sets a quotation, such as a customer testimonial, apart from the surrounding
 * body text.
 * @preview
 */
@Component({
  selector: 'sky-blockquote',
  templateUrl: './blockquote.html',
  styleUrl: './blockquote.scss',
  imports: [SkyIconModule, SkyLayoutResourcesModule],
})
export class SkyBlockquote {
  /**
   * The name of the person or organization the quotation is attributed to.
   */
  public readonly author = input<string>();

  /**
   * The URL of the quotation's source. When set, the attribution links to it,
   * and it reads "Source" when `author` isn't set.
   */
  public readonly quoteSource = input<string>();
}
