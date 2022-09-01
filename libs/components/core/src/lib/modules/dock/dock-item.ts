import { Observable, Subject } from 'rxjs';

/**
 * Represents a single item added to the dock.
 */
export class SkyDockItem<T> {
  /**
   * An event that emits when the item is removed from the dock.
   */
  public get destroyed(): Observable<void> {
    return this.#destroyedObs;
  }

  #destroyed = new Subject<void>();

  #destroyedObs: Observable<void>;

  /**
   * @param componentInstance The item's component instance.
   * @param stackOrder The assigned stack order of the docked item.
   */
  constructor(
    public readonly componentInstance: T,
    public readonly stackOrder: number
  ) {
    this.#destroyedObs = this.#destroyed.asObservable();
  }

  /**
   * Removes the item from the dock.
   */
  public destroy(): void {
    this.#destroyed.next();
    this.#destroyed.complete();
  }
}
