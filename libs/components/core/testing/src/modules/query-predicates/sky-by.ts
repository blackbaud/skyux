import { DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Provides predicates for querying elements rendered by SKY UX components.
 * @internal
 */
export class SkyBy {
  /**
   * Creates a predicate that matches elements with the given `data-sky-id` attribute value.
   */
  public static dataSkyId(skyId: string): Predicate<DebugElement> {
    return By.css(`[data-sky-id="${skyId}"]`);
  }
}
