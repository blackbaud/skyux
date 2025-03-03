import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyDocsCategoryColor } from '../category-tag/category-color';
import { SkyDocsCategoryTagModule } from '../category-tag/category-tag.module';

import { SkyDocsHeadingAnchorService } from './heading-anchor.service';

type SkyDocsHeadingAnchorHeadingTextFormat = 'normal' | 'code';
type SkyDocsHeadingAnchorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const DEFAULT_HEADING_LEVEL: SkyDocsHeadingAnchorHeadingLevel = 2;

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'anchorId()',
  },
  imports: [
    NgTemplateOutlet,
    RouterLink,
    SkyDocsCategoryTagModule,
    SkyIconModule,
    SkyTrimModule,
  ],
  selector: 'sky-docs-heading-anchor',
  styleUrl: './heading-anchor.component.scss',
  templateUrl: './heading-anchor.component.html',
})
export class SkyDocsHeadingAnchorComponent implements OnInit, OnDestroy {
  readonly #anchorSvc = inject(SkyDocsHeadingAnchorService, { optional: true });

  public readonly anchorId = input.required<string>();
  public readonly headingText = input.required<string>();
  public readonly headingTextFormat =
    input<SkyDocsHeadingAnchorHeadingTextFormat>('normal');

  public readonly categoryColor = input<SkyDocsCategoryColor | undefined>();
  public readonly categoryTemplate = input<TemplateRef<unknown> | undefined>();
  public readonly categoryText = input<string | undefined>();

  public readonly headingLevel = input(DEFAULT_HEADING_LEVEL, {
    transform: (value) => {
      const numValue = numberAttribute(value);

      if (numValue > 0 && numValue < 7) {
        return numValue as SkyDocsHeadingAnchorHeadingLevel;
      }

      return DEFAULT_HEADING_LEVEL;
    },
  });

  public readonly strikethrough = input(false, { transform: booleanAttribute });

  public ngOnInit(): void {
    this.#anchorSvc?.register(this);
  }

  public ngOnDestroy(): void {
    this.#anchorSvc?.unregister(this);
  }
}
