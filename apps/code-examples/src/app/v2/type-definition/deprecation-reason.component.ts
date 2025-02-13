import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyMarkdownPipe } from '../markdown/markdown.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyMarkdownPipe, SkyStatusIndicatorModule],
  selector: 'sky-deprecation-reason',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `<sky-status-indicator
    descriptionType="warning"
    indicatorType="warning"
  >
    <div
      [innerHTML]="'<strong>Deprecated. </strong>' + message() | skyMarkdown"
    ></div>
  </sky-status-indicator>`,
})
export class SkyDeprecationReasonComponent {
  public readonly message = input.required<string>();
}
