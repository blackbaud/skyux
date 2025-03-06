import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SkyDocsCategoryTagModule } from '../category-tag/category-tag.module';

import { SkyDocsTableOfContentsLink } from './table-of-contents-links';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, SkyDocsCategoryTagModule],
  selector: 'sky-docs-toc',
  styleUrl: './table-of-contents.component.scss',
  templateUrl: './table-of-contents.component.html',
})
export class SkyDocsTableOfContentsComponent {
  public readonly headingText = input.required<string>();
  public readonly links = input.required<SkyDocsTableOfContentsLink[]>();
}
