import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyDocsPillColor } from '../pill/pill-color';

import { SkyHeadingAnchorService } from './heading-anchor.service';

type SkyHeadingAnchorHeadingTextFormat = 'normal' | 'code';
type SkyHeadingAnchorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const DEFAULT_HEADING_LEVEL: SkyHeadingAnchorHeadingLevel = 2;

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
    SkyIconModule,
    // SkyDocsPillModule,
    SkyTrimModule,
  ],
  selector: 'sky-heading-anchor',
  styleUrl: './heading-anchor.component.scss',
  templateUrl: './heading-anchor.component.html',
})
export class SkyHeadingAnchorComponent implements OnInit, OnDestroy {
  readonly #anchorSvc = inject(SkyHeadingAnchorService, { optional: true });

  public readonly anchorId = input.required<string>();
  public readonly headingText = input.required<string>();
  public readonly headingTextFormat =
    input<SkyHeadingAnchorHeadingTextFormat>('normal');

  public readonly categoryColor = input<SkyDocsPillColor | undefined>();
  public readonly categoryText = input<string | undefined>();

  public readonly headingLevel = input(DEFAULT_HEADING_LEVEL, {
    transform: (value) => {
      const numValue = numberAttribute(value);

      if (numValue > 0 && numValue < 7) {
        return numValue as SkyHeadingAnchorHeadingLevel;
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
