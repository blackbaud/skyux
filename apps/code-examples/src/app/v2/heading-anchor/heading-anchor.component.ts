import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';

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
    '[attr.id]': 'headingId()',
  },
  imports: [NgTemplateOutlet, RouterLink, SkyIconModule],
  selector: 'sky-heading-anchor',
  styles: `
    :host {
      display: flex;
      align-items: center;
      position: relative;

      &:hover {
        .sky-heading-anchor-link {
          opacity: 1;
        }
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-right: var(--sky-margin-inline-sm);
    }

    .sky-heading-anchor-link {
      opacity: 0;
      transition: opacity 250ms;
      color: var(--sky-text-color-action-primary);
      position: absolute;
      left: -1.1em;
    }
  `,
  template: `
    <a
      class="sky-heading-anchor-link sky-font-heading-{{ headingLevel() }}"
      queryParamsHandling="merge"
      [fragment]="headingId()"
      [routerLink]="[]"
    >
      <sky-icon iconName="link" />
      <span class="sky-screen-reader-only"
        >Link for section titled {{ headingText() }}</span
      >
    </a>

    @switch (headingLevel()) {
      @case (1) {
        <h1>
          <ng-container [ngTemplateOutlet]="headingTextRef" />
        </h1>
      }
      @case (2) {
        <h2>
          <ng-container [ngTemplateOutlet]="headingTextRef" />
        </h2>
      }
      @case (3) {
        <h3>
          <ng-container [ngTemplateOutlet]="headingTextRef" />
        </h3>
      }
      @case (4) {
        <h4>
          <ng-container [ngTemplateOutlet]="headingTextRef" />
        </h4>
      }
      @case (5) {
        <h5>
          <ng-container [ngTemplateOutlet]="headingTextRef" />
        </h5>
      }
      @case (6) {
        <h6>
          <ng-container [ngTemplateOutlet]="headingTextRef" />
        </h6>
      }
    }

    <span class="sky-heading-anchor-content">
      <ng-content />
    </span>

    <ng-template #headingTextRef>
      @if (headingTextFormat() === 'code') {
        <code>{{ headingText() }}</code>
      } @else {
        {{ headingText() }}
      }
    </ng-template>
  `,
})
export class SkyHeadingAnchorComponent implements OnDestroy {
  readonly #anchorSvc = inject(SkyHeadingAnchorService, { skipSelf: true });

  public headingId = input.required<string>();
  public headingText = input.required<string>();
  public headingTextFormat = input<SkyHeadingAnchorHeadingTextFormat>('normal');

  public headingLevel = input(DEFAULT_HEADING_LEVEL, {
    transform: (value) => {
      const numValue = numberAttribute(value);

      if (numValue > 0 && numValue < 7) {
        return numValue as SkyHeadingAnchorHeadingLevel;
      }

      return DEFAULT_HEADING_LEVEL;
    },
  });

  constructor() {
    afterNextRender(() => {
      this.#anchorSvc.register(this);
    });
  }

  public ngOnDestroy(): void {
    this.#anchorSvc.unregister(this);
  }
}
