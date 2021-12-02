import { ComponentRef } from '@angular/core';

/**
 * Represents a dock item's component reference.
 * @internal
 */
export interface SkyDockItemReference<T> {
  componentRef: ComponentRef<T>;

  stackOrder: number;
}
