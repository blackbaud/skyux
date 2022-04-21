import { Component } from '@angular/core';
import { SkyBackToTopMessage, SkyBackToTopMessageType } from '@skyux/layout';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-back-to-top-message-stream',
  templateUrl: './back-to-top-message-stream.component.html',
})
export class BackToTopMessageStreamComponent {
  public backToTopController = new Subject<SkyBackToTopMessage>();

  public backToTopOptions = {
    buttonHidden: true,
  };

  public sendBackToTopMessage(): void {
    this.backToTopController.next({ type: SkyBackToTopMessageType.BackToTop });
  }
}
