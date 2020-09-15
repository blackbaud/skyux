import {
  Component
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyBackToTopMessage,
  SkyBackToTopMessageType
} from '../../public/public_api';

@Component({
  selector: 'back-to-top-message-stream-visual',
  templateUrl: './back-to-top-message-stream-visual.component.html'
})
export class BackToTopMessageStreamVisualComponent {

  public backToTopController = new Subject<SkyBackToTopMessage>();

  public backToTopOptions = {
    buttonHidden: true
  };

  public sendBackToTopMessage(): void {
    this.backToTopController.next({ type: SkyBackToTopMessageType.BackToTop });
  }
 }
