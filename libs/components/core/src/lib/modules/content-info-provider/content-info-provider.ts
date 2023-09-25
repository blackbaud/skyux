import { Observable, ReplaySubject } from 'rxjs';

import { SkyContentInfo } from './content-info';

/**
 * @internal
 * An API to provide information about a parent component's content to child components.
 * For example, toolbar can use this to provide its child components with a list
 * descriptor they can use to construct aria labels, or tree view can provide the node
 * name to its context menus.
 */
export class SkyContentInfoProvider {
  #contentInfo: ReplaySubject<SkyContentInfo> = new ReplaySubject(1);
  #currentValue: SkyContentInfo = {};

  public patchContentInfo(value: SkyContentInfo): void {
    const newValue = {
      ...this.#currentValue,
      ...value,
    };

    this.#currentValue = newValue;
    this.#contentInfo.next(newValue);
  }

  public getContentInfo(): Observable<SkyContentInfo> {
    return this.#contentInfo.asObservable();
  }
}
