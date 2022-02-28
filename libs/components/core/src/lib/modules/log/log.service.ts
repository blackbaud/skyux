import { Injectable } from '@angular/core';

/**
 * @deprecated The `SkyLogService` will be removed in the next major version of `@skyux/core`.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLogService {
  public warn(message?: any, ...optionalParams: any[]): void {
    /*istanbul ignore else */
    if (window.console) {
      //eslint-disable-next-line prefer-spread,prefer-rest-params
      window.console.warn.apply(window.console, arguments);
    }
  }
}
