import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
export function getWindow(): any {
  return window;
}

/**
 * The application window reference service references the global window variable.
 * After users inject SkyAppWindowRef into a component, they can use the service to interact with
 * window properties and event handlers by referencing its nativeWindow property.
 */
@Injectable({
  providedIn: 'root'
})
export class SkyAppWindowRef {

  /**
   * References the global `window` variable.
   */
  public get nativeWindow(): any {
    return getWindow();
  }
}
