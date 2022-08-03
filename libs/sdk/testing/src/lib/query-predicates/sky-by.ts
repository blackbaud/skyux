import { DebugElement, Predicate } from '@angular/core';
import { By } from '@angular/platform-browser';

export class SkyBy {
  static dataSkyId(skyId: string): Predicate<DebugElement> {
    return By.css(`[data-sky-id="${skyId}"]`);
  }
}
