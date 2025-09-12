import { inject } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyFilterBarFilterValue } from './filter-bar-filter-value';
import { SkyFilterItemModalContext } from './filter-item-modal-context';

/**
 * A specialized `SkyModalInstance` wrapper.
 */
export class SkyFilterItemModalInstance<TData = Record<string, unknown>> {
  /**
   * The context provided to the filter modal component.
   */
  public readonly context = inject<SkyFilterItemModalContext<TData>>(
    SkyFilterItemModalContext,
  );

  readonly #canceled = new Subject<SkyFilterBarFilterValue | undefined>();
  readonly #saved = new Subject<SkyFilterBarFilterValue | undefined>();

  /**
   * Fires when the user cancels the modal.
   * @internal
   */
  public readonly canceled = this.#canceled.asObservable();
  /**
   * Fires when the user saves the modal.
   * @internal
   */
  public readonly saved = this.#saved.asObservable();

  /**
   * Closes the modal instance with `reason="cancel"`.
   */
  public cancel(result?: SkyFilterBarFilterValue): void {
    this.#canceled.next(result);
    this.#canceled.complete();
  }

  /**
   * Closes the modal instance with `reason="save"`.
   * @param args
   */
  public save(result?: SkyFilterBarFilterValue): void {
    this.#saved.next(result);
    this.#saved.complete();
  }
}
