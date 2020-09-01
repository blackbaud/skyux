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
 * This is the description for FooWindowRef.
 */
@Injectable()
export class FooWindowRef {

  /**
   * This is the description for nativeWindow().
   */
  public get nativeWindow(): any {
    return getWindow();
  }
}
