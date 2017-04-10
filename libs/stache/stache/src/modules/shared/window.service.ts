import { Injectable } from '@angular/core';

function getWindow(): any {
   // return the global native browser window object
   return window;
}

@Injectable()
export class WindowRefService {
   get nativeWindow(): any {
      return getWindow();
   }
}
