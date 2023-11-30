import { Observable, ReplaySubject } from 'rxjs';

/**
 * @internal
 * An API to provide default Angular component input values to child components.
 */
export class SkyDefaultInputProvider {
  #props: Record<string, Record<string, ReplaySubject<unknown>>> = {};

  public setValue<T>(componentName: string, inputName: string, value: T): void {
    const subject = this.#getSubject(componentName, inputName);
    subject.next(value);
  }

  public getValue<T>(
    componentName: string,
    inputName: string
  ): Observable<T> | undefined {
    const inputDefault = this.#getSubject(componentName, inputName);
    return inputDefault.asObservable() as Observable<T>;
  }

  #getSubject(
    componentName: string,
    inputName: string
  ): ReplaySubject<unknown> {
    const componentSubjects = this.#props[componentName] || {};
    const inputSubject = componentSubjects[inputName];

    if (!inputSubject) {
      componentSubjects[inputName] = new ReplaySubject(1);
      this.#props[componentName] = componentSubjects;
    }

    return componentSubjects[inputName];
  }
}
