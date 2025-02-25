import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class.sky-docs-anatomy-item-optional': 'isOptional()',
  },
  selector: 'sky-docs-anatomy-item',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <div class="sky-docs-anatomy-item-marker">
      {{ marker() }}
    </div>
    <div class="sky-docs-anatomy-item-description">
      <ng-content />

      @if (isOptional()) {
        <span class="sky-deemphasized">&nbsp;(optional)</span>
      }
    </div>
  `,
})
export class SkyDocsAnatomyItemComponent {
  public isOptional = input(false, { transform: booleanAttribute });
  public marker = input.required<string>();
}
