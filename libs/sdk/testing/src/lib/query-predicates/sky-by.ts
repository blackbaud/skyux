import { DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * @deprecated Import `SkyBy` from `@skyux/core/testing` instead.
 */
export class SkyBy {
  public static dataSkyId(skyId: string): Predicate<DebugElement> {
    return By.css(`[data-sky-id="${skyId}"]`);
  }
}
