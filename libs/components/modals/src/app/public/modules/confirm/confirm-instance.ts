import {
  EventEmitter
} from '@angular/core';

import {
  SkyConfirmCloseEventArgs
} from './confirm-closed-event-args';

export class SkyConfirmInstance {
  public closed = new EventEmitter<SkyConfirmCloseEventArgs>();
}
