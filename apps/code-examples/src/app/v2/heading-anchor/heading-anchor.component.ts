import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';

type SkyHeadingAnchorHeadingTextFormat = 'normal' | 'code';
type SkyHeadingAnchorHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const DEFAULT_HEADING_LEVEL: SkyHeadingAnchorHeadingLevel = 2;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'headingId()',
  },
  imports: [NgTemplateOutlet, RouterLink, SkyIconModule],
  selector: 'sky-heading-anchor',
  styles: `
    :host {
      display: block;
    }

    .sky-heading-anchor {
      margin-left: var(--sky-margin-inline-xs);
    }
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
export class SkyHeadingAnchorComponent {
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
}
