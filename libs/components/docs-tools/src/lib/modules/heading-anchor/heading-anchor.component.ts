import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
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

import { SkyDocsHeadingAnchorHeadingLevel } from './heading-anchor-heading-level';
import { SkyDocsHeadingAnchorHeadingTextFormat } from './heading-anchor-heading-text-format';
import { SkyDocsHeadingAnchorService } from './heading-anchor.service';

const DEFAULT_HEADING_LEVEL: SkyDocsHeadingAnchorHeadingLevel = 2;

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class SkyDocsHeadingAnchorComponent implements AfterViewInit, OnDestroy {
  readonly #elementRef = inject(ElementRef);
  readonly #anchorSvc = inject(SkyDocsHeadingAnchorService, { optional: true });

  public readonly anchorId = input.required<string>();
  public readonly headingText = input.required<string>();
  public readonly headingTextFormat =
    input<SkyDocsHeadingAnchorHeadingTextFormat>('normal');

  public readonly categoryColor = input<SkyDocsCategoryColor | undefined>();
  public readonly categoryTemplate = input<TemplateRef<unknown> | undefined>();
  public readonly categoryText = input<string | undefined>();

  public equals(el: Element): boolean {
    return this.#elementRef.nativeElement === el;
  }

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

  public ngAfterViewInit(): void {
    this.#anchorSvc?.register(this);
  }

  public ngOnDestroy(): void {
    this.#anchorSvc?.unregister(this);
  }
}
