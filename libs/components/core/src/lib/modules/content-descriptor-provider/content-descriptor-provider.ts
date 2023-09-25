import { Observable, ReplaySubject } from 'rxjs';

/**
 * @internal
 * An API to provide a description of a parent component's content to child components.
 * For example, toolbar can use this to provide its child components with a list
 * descriptor they can use to construct aria labels, or tree view can provide the node
 * name to its context menus.
 */
export class SkyContentDescriptorProvider {
  #contentDescriptor: ReplaySubject<string> = new ReplaySubject(1);

  public setContentDescriptor(value: string): void {
    this.#contentDescriptor.next(value);
  }

  public getContentDescriptor(): Observable<string> {
    return this.#contentDescriptor.asObservable();
  }
}
