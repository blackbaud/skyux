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
      border-left: 2px solid var(--sky-border-color-neutral-medium);
    }

    a.sky-docs-toc-link,
    .sky-docs-toc-heading {
      margin-bottom: 8px;
      padding-left: 10px;
    }

    a.sky-docs-toc-link {
      color: var(--sky-text-color-deemphasized);
      display: block;
      width: 100%;
      font-size: var(--sky-font-size-body-s);
      text-overflow: ellipsis;
      overflow: hidden;

      &:hover,
      &:focus-visible,
      &.sky-docs-toc-link-active {
        color: var(--sky-text-color-action-primary);
        text-decoration: none;
        border-left: 2px solid var(--sky-text-color-action-primary);
        margin-left: -2px;
      }
    }
  `,
  template: `
    <div class="sky-docs-toc-heading sky-font-heading-5">
      {{ headingText() }}
    </div>

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
