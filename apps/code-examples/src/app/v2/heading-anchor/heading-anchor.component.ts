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

import { SkyPillComponent } from '../pill/pill.component';

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
  imports: [NgTemplateOutlet, RouterLink, SkyIconModule, SkyPillComponent],
  selector: 'sky-heading-anchor',
  styles: `
    :host {
      display: block;
      &:hover {
        .sky-heading-anchor {
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
      position: relative;
    }

    .sky-heading-anchor {
      opacity: 0;
      margin-left: var(--sky-margin-inline-xs);
      transition: opacity 250ms;
      position: absolute;
    }

    // .heading-icon {
    //   background-color: #006ea8;
    //   color: #fff;
    //   width: 30px;
    //   height: 30px;
    //   border-radius: 100%;
    //   display: inline-flex;
    //   margin-right: 8px;
    //   align-items: center;
    //   justify-content: center;
    // }
  `,
  template: `
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

    <ng-template #headingTextRef>
      @if (headingTextFormat() === 'code') {
        <code>{{ headingText() }}</code>
      } @else {
        {{ headingText() }}
      }

      <a
        class="sky-heading-anchor"
        queryParamsHandling="merge"
        [fragment]="headingId()"
        [routerLink]="[]"
      >
        <sky-icon iconName="link" />
        <span hidden>Section titled {{ headingText() }}</span>
      </a>
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
