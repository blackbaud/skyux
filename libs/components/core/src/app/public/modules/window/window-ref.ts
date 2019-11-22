import {
  Injectable
} from '@angular/core';

export function getWindow(): any {
  return window;
}

@Injectable()
export class SkyAppWindowRef {
  public get nativeWindow(): any {
    return getWindow();
  }
}
