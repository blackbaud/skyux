import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable()
export class HelpWindowRef {

  get nativeWindow(): any {
    return getWindow();
  }
}
