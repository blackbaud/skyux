/**
 * @deprecated since version 2.15.0. update and use the skyux-lib-clipboard unless major bugs are discovered before full deprecation in v3.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-copy-to-clipboard',
  templateUrl: './clipboard.component.html'
})
export class StacheCopyToClipboardComponent {
  @Input()
  public copyTarget: HTMLElement;

  @Input()
  public buttonText: string;

  @Input()
  public buttonClickedText: string;
}
