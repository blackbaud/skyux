import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SkyTableOfContentsLink } from './table-of-contents-links';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterLink],
  selector: 'sky-table-of-contents',
  styles: `
    :host {
      display: block;
      padding-left: 15px;
      border-left: 4px solid var(--sky-background-color-info-light);
    }

    a.sky-docs-toc-link {
      color: var(--sky-text-color-default);
      display: block;
      width: 100%;
      font-size: 13px;
      text-overflow: ellipsis;
      margin-bottom: 8px;
      overflow: hidden;

      &:active {
        color: var(--sky-text-color-default);
      }

      &:hover,
      &:focus,
      &.sky-docs-toc-link-active {
        color: var(--sky-text-color-action-primary);
        text-decoration: none;
      }
    }

    .sky-docs-toc-heading {
      margin: 0 0 8px;
    }
  `,
  template: `
    <h4 class="sky-docs-toc-heading sky-font-heading-5">{{ headingText() }}</h4>
    <nav [attr.aria-label]="'Table of contents for ' + headingText()">
      @for (link of links(); track link.anchorId) {
        <a
          class="sky-docs-toc-link"
          queryParamsHandling="merge"
          [fragment]="link.anchorId"
          [ngClass]="{ 'sky-docs-toc-link-active': link.active }"
          [routerLink]="[]"
          >{{ link.title }}</a
        >
      }
    </nav>
  `,
})
export class SkyTableOfContentsComponent {
  public headingText = input.required<string>();
  public links = input.required<SkyTableOfContentsLink[]>();
}
