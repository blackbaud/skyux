// #region imports
import { EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

// #endregion

export class SkyToastInstance {
  /**
   * An observable that indicates when the toast is closed.
   */
  public get closed(): Observable<void> {
    return this.#closed;
  }

  #closed = new EventEmitter<void>();

  /**
   * Closes the toast component.
   */
  public close(): void {
    this.#closed.emit();
    this.#closed.complete();
  }
}
