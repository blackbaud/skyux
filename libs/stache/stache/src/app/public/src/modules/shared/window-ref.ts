import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable()
export class StacheWindowRef {
  get nativeWindow(): any {
    return getWindow();
  }
}
