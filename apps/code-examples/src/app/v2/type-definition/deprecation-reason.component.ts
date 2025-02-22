import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyMarkdownPipe } from '../markdown/markdown.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-margin-stacked-lg]': 'stacked()',
  },
  imports: [SkyMarkdownPipe, SkyStatusIndicatorModule],
  selector: 'sky-deprecation-reason',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <sky-status-indicator descriptionType="warning" indicatorType="warning">
      <strong class="sky-font-emphasized">Deprecated. </strong
      ><span [innerHTML]="message() | skyMarkdown"></span>
    </sky-status-indicator>
  `,
})
export class SkyDeprecationReasonComponent {
  public readonly message = input.required<string>();
  public readonly stacked = input(false, { transform: booleanAttribute });
}
