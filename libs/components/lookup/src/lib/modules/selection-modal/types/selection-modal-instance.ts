import { Observable, Subject } from 'rxjs';

import { SkySelectionModalCloseArgs } from './selection-modal-close-args';

/**
 * Represents an instance of a selection modal.
 */
export class SkySelectionModalInstance {
  /**
   * An event that the selection modal instance emits when it closes.
   * It emits a `SkySelectionModalCloseArgs` object with a `selectedItems` property that includes
   * items selected by users on close or save and a `reason` property that indicates
   * whether the selection modal was saved or closed without saving.
   * The `reason` property accepts `"cancel"`, `"close"`, and `"save"`.
   */
  public get closed(): Observable<SkySelectionModalCloseArgs> {
    return this.#closedObs;
  }

  /**
   * @internal
   */
  public get itemAdded(): Observable<unknown> {
    return this.#itemAddedObs;
  }

  /**
   * @internal
   */
  public id: string;

  #closed = new Subject<SkySelectionModalCloseArgs>();
  #closedObs: Observable<SkySelectionModalCloseArgs>;
  #itemAdded = new Subject<unknown>();
  #itemAddedObs: Observable<unknown>;

  constructor(id: string) {
    this.id = id;

    this.#closedObs = this.#closed.asObservable();
    this.#itemAddedObs = this.#itemAdded.asObservable();
  }

  /**
   * @internal
   */
  public close(args: SkySelectionModalCloseArgs): void {
    this.#closed.next(args);
    this.#closed.complete();
  }

  /**
   * @internal
   */
  public addItem(itemToAdd: unknown): void {
    this.#itemAdded.next(itemToAdd);
  }
}
