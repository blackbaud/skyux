import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable()
export class SkyClipboardWindowRef {

  get nativeWindow(): any {
    return getWindow();
  }
}
