// #region imports
import { Observable, Subject } from 'rxjs';

// #endregion

export class SkyToastInstance {
  /**
   * An observable that indicates when the toast is closed.
   */
  public get closed(): Observable<void> {
    return this.#closedObs;
  }

  #closed: Subject<void>;
  #closedObs: Observable<void>;

  constructor() {
    this.#closed = new Subject<void>();
    this.#closedObs = this.#closed.asObservable();
  }

  /**
   * Closes the toast component.
   */
  public close(): void {
    this.#closed.next();
    this.#closed.complete();
  }
}
