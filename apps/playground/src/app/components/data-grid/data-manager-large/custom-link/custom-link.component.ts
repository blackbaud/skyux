import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-custom-link',
  templateUrl: './custom-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
      }
    `,
  ],
})
export class CustomLinkComponent {
  public readonly link = input<string>();
}
