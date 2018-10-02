import {
  EventEmitter
} from '@angular/core';

import {
  SkyConfirmCloseEventArgs
} from './types';

export class SkyConfirmInstance {
  public closed = new EventEmitter<SkyConfirmCloseEventArgs>();
}
