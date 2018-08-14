import {
  Injectable
} from '@angular/core';

function getWindow() {
  return window;
}

// TODO: This service should be combined with the other window service
// in a breaking change.
@Injectable()
export class SkyAppWindowRef {
  public get nativeWindow() {
    return getWindow();
  }
}
