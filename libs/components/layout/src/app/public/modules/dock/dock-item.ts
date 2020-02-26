import {
  Observable,
  Subject
} from 'rxjs';

/**
 * Represents a single item added to the dock.
 * @deprecated Use `SkyDockItem` from `@skyux/core` instead.
 */
export class SkyDockItem<T> {

  /**
   * An event that emits when the item is removed from the dock.
   */
  public get destroyed(): Observable<void> {
    return this._destroyed.asObservable();
  }

  private _destroyed = new Subject<void>();

  /**
   * @param componentInstance The item's component instance.
   * @param stackOrder The assigned stack order of the docked item.
   */
  constructor(
    public readonly componentInstance: T,
    public readonly stackOrder: number
  ) { }

  /**
   * Removes the item from the dock.
   */
  public destroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

}
